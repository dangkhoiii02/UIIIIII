import type { Order, OrderFilters, OrderInput, ShippingStageItem } from './types';
import { getSpfLifecyclePhase, isSpfFailureStatus } from './spf-status-catalog';
export function validateOrder(input: OrderInput): string[] {
  const errors: string[] = [];
  if (![input.name, input.address, input.region, input.product].every((value) => value.trim()))
    errors.push('Điền đầy đủ thông tin người nhận, khu vực và sản phẩm.');
  if (!/^0\d{9}$/.test(input.phone))
    errors.push('Số điện thoại phải gồm 10 chữ số, bắt đầu bằng 0.');
  if (!Number.isFinite(input.weight) || input.weight <= 0)
    errors.push('Khối lượng phải lớn hơn 0.');
  if (
    ![input.value, input.cod, input.length, input.width, input.height].every(
      (n) => Number.isFinite(n) && n >= 0,
    )
  )
    errors.push('Giá trị, thu hộ và kích thước phải là số không âm.');
  if (input.note.length > 120) errors.push('Ghi chú không quá 120 ký tự.');
  return errors;
}
export function billableWeight(input: Pick<OrderInput, 'weight' | 'length' | 'width' | 'height'>) {
  return Math.max(input.weight, Math.ceil((input.length * input.width * input.height) / 5));
}
export function parseQuickInput(text: string): Partial<OrderInput> {
  const lines = text.trim().split(/\r?\n/);
  const phone = text.match(/0\d{9}/)?.[0];
  return {
    ...(phone ? { phone } : {}),
    ...(lines[0] ? { name: lines[0].replace(/0\d{9}/, '').trim() } : {}),
    ...(lines[1] ? { address: lines[1] } : {}),
    ...(lines[2] ? { product: lines[2] } : {}),
  };
}
export function filterOrders(orders: Order[], filters: OrderFilters, now = new Date()): Order[] {
  const match = (text: string, q: string) =>
    (text || '').toLocaleLowerCase('vi').includes(q.trim().toLocaleLowerCase('vi'));

  const carrierMatches = (carrier: string | undefined, value: string) => {
    if (!value) return true;
    const normalized = (carrier || '').toLocaleLowerCase('vi').replace(/[^a-z0-9]/g, '');
    const expected = value.toLocaleLowerCase('vi').replace(/[^a-z0-9]/g, '');
    const aliases: Record<string, string[]> = {
      supership: ['supership'],
      ghn: ['ghn', 'giaohangnhanh'],
      best: ['best', 'bestexpress'],
      ghtk: ['ghtk', 'giaohangtietkiem'],
      vtp: ['viettelpost', 'vtp'],
      jnt: ['jnt', 'jtexpress'],
      vnp: ['vnp', 'vietnampost'],
    };
    return (aliases[expected] || [expected]).some((alias) => normalized.includes(alias));
  };

  const shippingStages = (order: Order): ShippingStageItem[] => {
    const shipping = order.shippingInfo;
    if (!shipping) return [];
    if (shipping.stages?.length) return shipping.stages;
    return [
      shipping.pickupCarrier || shipping.pickupTracking
        ? {
            key: 'pickup' as const,
            title: 'Lấy',
            carrier: shipping.pickupCarrier || '',
            tracking: shipping.pickupTracking || '',
          }
        : null,
      shipping.deliveryCarrier || shipping.deliveryTracking
        ? {
            key: 'delivery' as const,
            title: 'Giao',
            carrier: shipping.deliveryCarrier || '',
            tracking: shipping.deliveryTracking || '',
          }
        : null,
      shipping.returnCarrier || shipping.returnTracking
        ? {
            key: 'return' as const,
            title: 'Hoàn',
            carrier: shipping.returnCarrier || '',
            tracking: shipping.returnTracking || '',
          }
        : null,
      shipping.refundCarrier || shipping.refundTracking
        ? {
            key: 'refund' as const,
            title: 'Trả cuối',
            carrier: shipping.refundCarrier || '',
            tracking: shipping.refundTracking || '',
          }
        : null,
    ].filter((stage): stage is NonNullable<typeof stage> => Boolean(stage));
  };

  const carrierStatusForStage = (
    order: Order,
    key: 'pickup' | 'delivery' | 'return' | 'refund',
  ) => {
    const stage = shippingStages(order).find((item) => item.key === key);
    if (!stage) return '';
    if (stage.carrierStatusText) return stage.carrierStatusText;
    if (order.shippingInfo?.currentStage === key) {
      return order.shippingInfo.carrierStatusText || '';
    }
    if (stage.status === 'completed') return 'Đã kết thúc chặng';
    if (stage.status === 'pending') return 'Chưa tiếp nhận';
    return order.shippingInfo?.carrierStatusText || 'Đang xử lý';
  };

  const dateForFilter = (order: Order) => {
    if (filters.timeField === 'updatedAt') return order.updatedAt || order.createdAt;
    if (filters.timeField === 'pickupAt') return order.pickupAt;
    if (filters.timeField === 'deliveryAt') return order.deliveryAt;
    if (filters.timeField === 'returnConfirmedAt') return order.returnConfirmedAt;
    if (filters.timeField === 'returnedAt') return order.returnedAt;
    return order.createdAt;
  };

  const results = orders.filter((order) => {
    const lifecyclePhase = getSpfLifecyclePhase(order.spfCode);
    const stages = shippingStages(order);
    const waybills = stages.map((stage) => stage.tracking);
    const carriers = stages.map((stage) => stage.carrier);
    const latestCarrierUpdate = stages.reduce((latest, stage) => {
      const timestamp = Date.parse(stage.carrierUpdatedAt || '');
      return Number.isNaN(timestamp) ? latest : Math.max(latest, timestamp);
    }, Date.parse(order.updatedAt || order.createdAt));
    const isTerminal = ['delivered', 'returned', 'cancelled'].includes(lifecyclePhase);
    const carrierSilentHours = Math.max(0, (now.getTime() - latestCarrierUpdate) / 3_600_000);
    const pendingAction = ['PENDING', 'PROCESSING', 'OVERDUE'].includes(
      order.supportStatus || '',
    );
    const businessError = isSpfFailureStatus(order.spfCode);
    const hasOperationalAnomaly =
      (!isTerminal && carrierSilentHours >= 24) ||
      Boolean(order.hasStatusMismatch) ||
      pendingAction ||
      businessError ||
      order.syncStatus === 'FAILED';

    if (
      filters.query &&
      ![
        order.id,
        order.name,
        order.phone,
        order.product,
        order.privateId,
        order.clientCode,
        order.shopId,
        order.shopName,
        order.shopPhone,
        order.senderName,
        order.senderPhone,
        ...waybills,
      ].some((text) => match(text || '', filters.query))
    )
      return false;

    if (filters.status && order.status !== filters.status) return false;
    if (filters.statusGroup === 'waiting' && !['creating', 'pickup'].includes(lifecyclePhase))
      return false;
    if (filters.statusGroup === 'shipping' && !['handover', 'delivery'].includes(lifecyclePhase))
      return false;
    if (filters.statusGroup === 'return' && !['return', 'returned'].includes(lifecyclePhase))
      return false;
    if (
      filters.statusGroup === 'completed' &&
      !(
        order.spfCode === 'SPF-0901' ||
        lifecyclePhase === 'returned' ||
        order.spfCode === 'SPF-0201'
      )
    )
      return false;
    if (filters.id && !match(order.id, filters.id)) return false;
    if (filters.phone && !match(order.phone, filters.phone)) return false;
    if (filters.privateId && !match(order.privateId, filters.privateId)) return false;
    if (filters.clientCode && !match(order.clientCode || '', filters.clientCode)) return false;
    if (filters.batchId && !match(order.batchId, filters.batchId)) return false;
    if (filters.reconciliationId && !match(order.reconciliationId, filters.reconciliationId))
      return false;
    if (
      filters.shopId &&
      ![order.shopId, order.shopName, order.shopPhone].some((value) =>
        match(value || '', filters.shopId),
      )
    )
      return false;
    if (filters.sourceChannel && order.sourceChannel !== filters.sourceChannel) return false;
    if (filters.serviceType && order.serviceType !== filters.serviceType) return false;
    if (filters.dispatchMethod && order.dispatchMethod !== filters.dispatchMethod) return false;
    if (filters.warehouseId && !match(order.warehouseId || '', filters.warehouseId)) return false;
    if (filters.senderAddress && !match(order.senderAddress || '', filters.senderAddress))
      return false;
    if (filters.recipientName && !match(order.name, filters.recipientName)) return false;
    if (filters.recipientAddress && !match(order.address, filters.recipientAddress)) return false;
    if (filters.recipientRegion && !match(order.region, filters.recipientRegion)) return false;
    if (filters.addressFormat && order.addressFormat !== filters.addressFormat) return false;
    if (filters.carrierWaybill && !waybills.some((code) => match(code, filters.carrierWaybill)))
      return false;

    if (filters.statusAgeHours) {
      const statusAgeHours = Math.max(
        0,
        (now.getTime() - Date.parse(order.updatedAt || order.createdAt)) / 3_600_000,
      );
      if (statusAgeHours < Number(filters.statusAgeHours)) return false;
    }

    if (
      filters.carrierAny &&
      !carriers.some((carrier) => carrierMatches(carrier, filters.carrierAny))
    )
      return false;
    if (
      filters.carrierPickup &&
      !stages.some(
        (stage) => stage.key === 'pickup' && carrierMatches(stage.carrier, filters.carrierPickup),
      )
    )
      return false;
    if (
      filters.carrierDelivery &&
      !stages.some(
        (stage) =>
          stage.key === 'delivery' && carrierMatches(stage.carrier, filters.carrierDelivery),
      )
    )
      return false;
    if (
      filters.carrierReturn &&
      !stages.some(
        (stage) => stage.key === 'return' && carrierMatches(stage.carrier, filters.carrierReturn),
      )
    )
      return false;
    if (
      filters.carrierFinalReturn &&
      !stages.some(
        (stage) =>
          stage.key === 'refund' && carrierMatches(stage.carrier, filters.carrierFinalReturn),
      )
    )
      return false;
    if (
      filters.carrierStatusPickup &&
      !match(carrierStatusForStage(order, 'pickup'), filters.carrierStatusPickup)
    )
      return false;
    if (
      filters.carrierStatusDelivery &&
      !match(carrierStatusForStage(order, 'delivery'), filters.carrierStatusDelivery)
    )
      return false;
    if (
      filters.carrierStatusReturn &&
      !match(carrierStatusForStage(order, 'return'), filters.carrierStatusReturn)
    )
      return false;
    if (
      filters.carrierStatusFinalReturn &&
      !match(carrierStatusForStage(order, 'refund'), filters.carrierStatusFinalReturn)
    )
      return false;
    if (
      filters.shipperPickupPhone &&
      !match(order.shipperPickupPhone || '', filters.shipperPickupPhone)
    )
      return false;
    if (
      filters.shipperDeliveryPhone &&
      !match(order.shipperDeliveryPhone || '', filters.shipperDeliveryPhone)
    )
      return false;
    if (
      filters.shipperReturnPhone &&
      !match(order.shipperReturnPhone || '', filters.shipperReturnPhone)
    )
      return false;
    if (
      filters.shipperFinalReturnPhone &&
      !match(order.shipperFinalReturnPhone || '', filters.shipperFinalReturnPhone)
    )
      return false;

    const deliveryResult = order.deliveryResult || (order.spfCode === 'SPF-0901' ? 'FULL' : 'NONE');
    if (filters.deliveryResult && deliveryResult !== filters.deliveryResult) return false;
    if (filters.businessType && (order.businessType || 'STANDARD') !== filters.businessType)
      return false;
    if (filters.returnReason && !match(order.returnReason || '', filters.returnReason))
      return false;

    // COD filters
    if (filters.hasCod && order.cod <= 0) return false;
    if (typeof filters.codMin === 'number' && order.cod < filters.codMin) return false;
    if (typeof filters.codMax === 'number' && order.cod > filters.codMax) return false;
    if (filters.codChanged && !order.codChanged) return false;
    if (filters.codPaymentStatus && order.codPaymentStatus !== filters.codPaymentStatus)
      return false;

    // Picked / Printed / Payer flags
    if (
      filters.picked !== filters.unpicked &&
      filters.picked !== (order.spfCode >= 'SPF-0501' && lifecyclePhase !== 'cancelled')
    )
      return false;

    if (filters.sender !== filters.recipient && filters.sender !== (order.payer === 'sender'))
      return false;

    if (filters.printed !== filters.unprinted && filters.printed !== order.printed) return false;

    if (filters.pickupFailed && order.spfCode !== 'SPF-0402') return false;
    const handoverDone =
      lifecyclePhase !== 'cancelled' &&
      (order.spfCode >= 'SPF-0605' || stages.some((stage) => stage.key === 'delivery' && stage.status !== 'pending'));
    if (filters.handoverDone && !handoverDone) return false;
    if (filters.handoverFailed && order.spfCode !== 'SPF-0603') return false;
    const hasCancelRequest = Boolean(order.cancelRequestedAt) || ['SPF-0201', 'SPF-0202'].includes(order.spfCode);
    if (filters.hasCancelRequest && !hasCancelRequest) return false;
    const cancelFailed =
      order.spfCode === 'SPF-0202' ||
      ['FAILED', 'REJECTED', 'UNKNOWN'].includes(order.carrierCancelStatus || '');
    if (filters.cancelCarrierFailed && !cancelFailed) return false;

    // Return & Exchange flags
    if (filters.hasExchange && order.businessType !== 'EXCHANGE' && !order.returnGoods) return false;
    if (filters.hasReturn && !['return', 'returned'].includes(lifecyclePhase)) return false;
    if (filters.hasPartialDelivery && deliveryResult !== 'PARTIAL') return false;
    if (filters.deliveryFailed && order.spfCode !== 'SPF-0802') return false;
    if (filters.delivered && deliveryResult !== 'FULL') return false;

    if (filters.hasSupportRequest && !order.supportStatus) return false;
    if (filters.supportStatus && order.supportStatus !== filters.supportStatus) return false;
    if (filters.supportSlaExceeded && order.supportStatus !== 'OVERDUE') return false;
    if (filters.hasIncident && !order.incidentType) return false;
    if (filters.incidentType && order.incidentType !== filters.incidentType) return false;
    if (filters.hasClaim && !order.claimStatus) return false;
    if (filters.claimStatus && order.claimStatus !== filters.claimStatus) return false;
    if (filters.hasCompensation && !order.compensationStatus) return false;
    if (filters.syncError && order.syncStatus !== 'FAILED') return false;
    if (filters.priceAccountType && order.priceAccountType !== filters.priceAccountType)
      return false;
    if (filters.isExternalRouted && !order.isExternalRouted) return false;
    if (filters.hasOpsAnomaly && !hasOperationalAnomaly) return false;
    if (filters.anomalyNoUpdateHours) {
      if (isTerminal || carrierSilentHours < Number(filters.anomalyNoUpdateHours)) return false;
    }
    if (filters.anomalyStatusMismatch && !order.hasStatusMismatch) return false;
    if (filters.anomalyPendingAction && !pendingAction) return false;
    if (filters.anomalyBusinessError && !businessError) return false;

    // Date cutoff
    if (filters.days) {
      const candidate = dateForFilter(order);
      if (!candidate) return false;
      const cutoff = new Date(now);
      cutoff.setHours(0, 0, 0, 0);
      cutoff.setDate(cutoff.getDate() - Math.max(0, Number(filters.days) - 1));
      if (new Date(candidate) < cutoff || new Date(candidate) > now) return false;
    }

    return true;
  });

  return results.sort(
    (a, b) =>
      (Date.parse(b.createdAt) - Date.parse(a.createdAt)) * (filters.sort === 'new' ? 1 : -1),
  );
}
