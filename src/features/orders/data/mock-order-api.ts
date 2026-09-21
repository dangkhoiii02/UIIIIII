import mockOrderApiData from './mock-order-api-data.json';
import type {
  CarrierWebhookEvent,
  DeliveryProof,
  Order,
  ShippingRoutingInfo,
  ShippingStageItem,
} from '../model/types';
import {
  SPF_STATUS_MAP,
  type SpfStatusCode,
  type SpfStatusName,
} from '../model/spf-status-catalog';

export const MOCK_ORDER_API_BASE_URL = '/mock-api/v1';

interface MockPartyDto {
  name: string | null;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
}

interface MockAddressDto {
  address_detail: string | null;
  full_address: string | null;
  province_code: string | null;
  district_code: string | null;
  commune_code: string | null;
  latitude: number | null;
  longitude: number | null;
}

interface MockGoodsDto {
  content_type: number;
  product_name: string;
  declared_value: number;
  currency_code: string;
  tag_codes: number[];
}

interface MockMeasureDto {
  weight_g: number;
  length_cm: number;
  width_cm: number;
  height_cm: number;
}

interface MockNoteDto {
  note_code: string;
  note_type: number;
  visibility_scope: number;
  content: string;
  created_display_name: string;
  created_at: string;
}

interface MockRequestDto {
  request_code: string;
  request_type: string;
  request_status: number;
  requested_at: string;
  completed_at: string | null;
  result_code: string | null;
  result_reason: string | null;
}

interface MockStatusHistoryDto {
  from_status_code: SpfStatusCode | null;
  status_code: SpfStatusCode;
  status_name: string;
  reason_code: string | null;
  reason: string | null;
  changed_at: string;
}

interface MockWaybillDto {
  carrier_waybill_code: string;
  carrier_sorting_code: string | null;
  waybill_status: number;
  carrier_status_code: string | null;
  carrier_status_name: string | null;
  carrier_status_at: string | null;
  request_sent_at: string | null;
  carrier_accepted_at: string | null;
}

interface MockTrackingEventDto {
  event_id: string;
  event_code: string;
  event_name: string;
  carrier_status_code: string | null;
  carrier_status_name: string | null;
  stage_status_code: string | null;
  location: string;
  reason_code: string | null;
  reason: string | null;
  occurred_at: string;
  received_at: string;
  order_sequence_no: number;
  apply_result: number;
  dedupe_key: string;
}

export interface MockDriverDto {
  name: string;
  phone: string;
  carrier_shipper_code?: string;
  vehicle_type?: string;
  license_plate?: string;
  latitude?: number;
  longitude?: number;
  remaining_distance_km?: number;
  eta_minutes?: number;
}

export interface MockImageDto {
  image_code: string;
  image_type: number;
  url: string;
  description?: string;
}

interface MockStageDto {
  stage_code: string;
  stage_no: number;
  leg_type: 1 | 2 | 3 | 4;
  stage_status_code: string;
  stage_status_name: string | null;
  carrier_code: number;
  carrier_name: string;
  started_at: string | null;
  completed_at: string | null;
  driver?: MockDriverDto | null;
  waybill: MockWaybillDto | null;
  tracking_events: MockTrackingEventDto[];
}

export interface MockOrderDto {
  order_code: string;
  shop_id: string;
  soc: string;
  status_code: SpfStatusCode;
  status_name: SpfStatusName;
  customer_model: number;
  transport_model: number;
  selection_mode: number;
  pricing_code: string;
  planned_carrier_code: number | null;
  planned_carrier_name: string | null;
  cod_amount: number;
  collected_amount: number;
  cod_collection_status: number;
  settled_amount: number;
  cod_settlement_status: number;
  compensation_amount: number;
  compensation_status: number;
  inspection_type: number;
  fee_payer: number;
  pickup_method: number;
  service_codes: number[];
  delivery_note: string;
  delivery_result: number;
  created_channel: string;
  created_at: string;
  updated_at: string;
  sender: MockPartyDto | null;
  receiver: MockPartyDto | null;
  pickup_address: MockAddressDto | null;
  delivery_address: MockAddressDto | null;
  goods: MockGoodsDto | null;
  measure: MockMeasureDto | null;
  notes: MockNoteDto[];
  images?: MockImageDto[];
  requests: MockRequestDto[];
  status_history: MockStatusHistoryDto[];
  stages: MockStageDto[];
}

interface MockApiEnvelope {
  meta: {
    mock_api: string;
    database: string;
    schema: string;
    generated_from: string;
    total: number;
  };
  data: MockOrderDto[];
}

const fixture = mockOrderApiData as unknown as MockApiEnvelope;

const stageIdentity: Record<MockStageDto['leg_type'], Pick<ShippingStageItem, 'key' | 'title'>> = {
  1: { key: 'pickup', title: 'Lấy' },
  2: { key: 'delivery', title: 'Giao' },
  3: { key: 'return', title: 'Hoàn' },
  4: { key: 'refund', title: 'Trả cuối' },
};

const carrierEventStatusMap: Record<string, SpfStatusCode> = {
  READY_TO_PICK: 'SPF-0301',
  WAITING_PICKUP: 'SPF-0301',
  PICKED: 'SPF-0501',
  PICKED_UP: 'SPF-0501',
  HANDOVER_RECEIVED: 'SPF-0605',
  RECEIVED: 'SPF-0605',
  IN_TRANSIT: 'SPF-0701',
  TRANSPORTING: 'SPF-0701',
  TRANSPORTING_LATE: 'SPF-0701',
  DELIVERING: 'SPF-0801',
  DELIVERED: 'SPF-0901',
  DELIVERED_CORRECTION: 'SPF-0901',
};

function isSpfStatusCode(value: string | null): value is SpfStatusCode {
  return Boolean(value && SPF_STATUS_MAP[value as SpfStatusCode]);
}

function resolveMappedStatus(event: MockTrackingEventDto, fallback: SpfStatusCode): SpfStatusCode {
  if (isSpfStatusCode(event.stage_status_code)) return event.stage_status_code;
  if (isSpfStatusCode(event.event_code)) return event.event_code;
  return (
    carrierEventStatusMap[event.stage_status_code || ''] ||
    carrierEventStatusMap[event.event_code] ||
    fallback
  );
}

function mapWebhookEvent(
  event: MockTrackingEventDto,
  fallback: SpfStatusCode,
): CarrierWebhookEvent {
  const mappedSpfCode = resolveMappedStatus(event, fallback);
  return {
    id: event.event_id,
    receivedAt: event.received_at,
    eventAt: event.occurred_at,
    statusCode: event.carrier_status_code || event.event_code,
    statusText: event.carrier_status_name || event.event_name,
    mappedSpfCode,
    mappedSpfStatus: SPF_STATUS_MAP[mappedSpfCode].name as SpfStatusName,
    processingStatus:
      event.apply_result === 1 ? 'processed' : event.apply_result === 2 ? 'duplicate' : 'failed',
    requestId: event.dedupe_key,
    location: event.location || undefined,
    note: event.reason || undefined,
    payload: JSON.stringify({
      reason_code: event.reason_code,
      order_sequence_no: event.order_sequence_no,
      apply_result: event.apply_result,
    }),
  };
}

function resolveStageStatus(stage: MockStageDto, index: number): ShippingStageItem['status'] {
  if (stage.completed_at || stage.stage_status_code === 'COMPLETED') return 'completed';
  if (stage.started_at || index === 0) return 'active';
  return 'pending';
}

function mapStage(
  stage: MockStageDto,
  index: number,
  orderStatus: SpfStatusCode,
  orderStatusName: string,
): ShippingStageItem {
  const identity = stageIdentity[stage.leg_type];
  const events = [...stage.tracking_events]
    .sort((left, right) => right.order_sequence_no - left.order_sequence_no)
    .map((event) => mapWebhookEvent(event, orderStatus));
  const latestEvent = events[0];
  return {
    ...identity,
    stageCode: stage.stage_code,
    stageNo: stage.stage_no,
    legType: stage.leg_type,
    carrier: stage.carrier_name,
    tracking: stage.waybill?.carrier_waybill_code || '',
    isSuperShip: stage.carrier_code === 1,
    status: resolveStageStatus(stage, index),
    carrierStatusText:
      stage.waybill?.carrier_status_name ||
      stage.stage_status_name ||
      latestEvent?.statusText ||
      `${stage.carrier_name} – ${orderStatusName}`,
    carrierStatusCode:
      stage.waybill?.carrier_status_code || stage.stage_status_code || latestEvent?.statusCode,
    carrierUpdatedAt:
      stage.waybill?.carrier_status_at || latestEvent?.eventAt || stage.started_at || undefined,
    webhookEvents: events,
  };
}

function resolveCurrentStage(stages: ShippingStageItem[]): ShippingRoutingInfo['currentStage'] {
  const active = stages.find((stage) => stage.status === 'active');
  if (active) return active.key;
  const pending = stages.find((stage) => stage.status === 'pending');
  if (pending) return pending.key;
  return stages.length ? 'completed' : undefined;
}

function mapCustomerModel(value: number): Order['customerModel'] {
  if (value === 1) return 'LOCAL_LEGACY';
  if (value === 2) return 'LOCAL_NEW';
  if (value === 4) return 'SUPERAI';
  return 'NATIONAL';
}

function mapFulfillmentPlan(value: number): Order['fulfillmentPlan'] {
  if (value === 1) return 'LOCAL_SUPERSHIP';
  if (value === 2) return 'LOCAL_PARTNER';
  return 'DIRECT_CARRIER';
}

function mapCodPaymentStatus(value: number): string {
  if (value === 5) return 'PAID';
  if (value === 3 || value === 4 || value === 6) return 'PROCESSING';
  return 'UNPAID';
}

function mapBusinessType(dto: MockOrderDto, stages: ShippingStageItem[]): Order['businessType'] {
  if (dto.status_code === 'SPF-1202') return 'EXCHANGE';
  if (dto.delivery_result === 2) return 'PARTIAL';
  if (stages.some((stage) => stage.key === 'return' || stage.key === 'refund')) return 'RETURN';
  return 'STANDARD';
}

function synthesizeCanonicalStages(
  dto: MockOrderDto,
  rawStages: ShippingStageItem[],
): ShippingStageItem[] {
  const hasPickup = rawStages.some((s) => s.key === 'pickup');
  const hasDelivery = rawStages.some((s) => s.key === 'delivery');
  const hasReturn = rawStages.some((s) => s.key === 'return' || s.key === 'refund');
  const isPartialDelivery = dto.delivery_result === 2 || dto.status_code === 'SPF-0902';
  const isReturnStatus =
    dto.status_code.startsWith('SPF-10') ||
    dto.status_code.startsWith('SPF-11') ||
    dto.status_code.startsWith('SPF-12');

  // Đơn đã có đầy đủ chặng Lấy hoặc chặng dừng sớm ở Lấy (không thiếu chặng hoàn)
  if (hasPickup && (!isPartialDelivery || hasReturn)) {
    return rawStages;
  }

  const deliveryStage = rawStages.find((s) => s.key === 'delivery');
  const pickupStage = rawStages.find((s) => s.key === 'pickup');

  const carrierName =
    deliveryStage?.carrier ||
    pickupStage?.carrier ||
    dto.planned_carrier_name ||
    'SuperShip';
  const waybillCode =
    deliveryStage?.tracking ||
    pickupStage?.tracking ||
    '';
  const isSuperShipCarrier = carrierName.toLowerCase().includes('super');

  const stages: ShippingStageItem[] = [];

  // 1. Chặng Lấy
  if (hasPickup) {
    stages.push(pickupStage!);
  } else {
    const isPastPickup = [
      'SPF-0501', 'SPF-0502', 'SPF-0601', 'SPF-0602', 'SPF-0603', 'SPF-0604', 'SPF-0605', 'SPF-0606',
      'SPF-0701', 'SPF-0702', 'SPF-0801', 'SPF-0802', 'SPF-0803', 'SPF-0901', 'SPF-0902',
      'SPF-1001', 'SPF-1002', 'SPF-1003', 'SPF-1004', 'SPF-1005', 'SPF-1006', 'SPF-1007', 'SPF-1008', 'SPF-1009',
      'SPF-1101', 'SPF-1102', 'SPF-1103', 'SPF-1104', 'SPF-1105', 'SPF-1106', 'SPF-1107', 'SPF-1108',
      'SPF-1201', 'SPF-1202',
    ].includes(dto.status_code);

    const isPickupActive =
      dto.status_code === 'SPF-0301' ||
      dto.status_code === 'SPF-0302' ||
      dto.status_code === 'SPF-0303' ||
      dto.status_code === 'SPF-0401' ||
      dto.status_code === 'SPF-0402' ||
      dto.status_code === 'SPF-0403' ||
      dto.status_code === 'SPF-0101' ||
      dto.status_code === 'SPF-0102';

    const pickupStatus: ShippingStageItem['status'] = isPastPickup
      ? 'completed'
      : isPickupActive
        ? 'active'
        : 'pending';

    const isDropoff = dto.pickup_method === 2;
    const pickupTitle = isDropoff ? 'Gửi hàng' : 'Lấy';
    const pickupStatusText = isPastPickup
      ? (isDropoff ? 'Đã gửi tại bưu cục' : 'Đã lấy hàng')
      : isDropoff
        ? 'Chờ gửi tại bưu cục'
        : dto.status_code === 'SPF-0101' || dto.status_code === 'SPF-0102'
          ? `${carrierName} – ${dto.status_name || 'Đang tạo đơn NVC'}`
          : 'Chờ lấy hàng';

    stages.push({
      key: 'pickup',
      title: pickupTitle,
      stageCode: 'STG-PICKUP-0001',
      stageNo: 1,
      legType: 1,
      carrier: carrierName,
      tracking: waybillCode,
      isSuperShip: isSuperShipCarrier,
      status: pickupStatus,
      carrierStatusText: pickupStatusText,
      carrierStatusCode: isPastPickup ? 'PICKED_UP' : 'WAITING_PICKUP',
      carrierUpdatedAt: deliveryStage?.carrierUpdatedAt || dto.updated_at,
      webhookEvents: [],
    });
  }

  // 2. Chặng Giao
  if (hasDelivery) {
    const isOrderInPickup =
      dto.status_code === 'SPF-0301' ||
      dto.status_code === 'SPF-0302' ||
      dto.status_code === 'SPF-0303' ||
      dto.status_code === 'SPF-0101' ||
      dto.status_code === 'SPF-0102';

    const adjustedStatus: ShippingStageItem['status'] =
      isOrderInPickup && !dto.stages.some((s) => s.completed_at)
        ? 'pending'
        : deliveryStage!.status;

    stages.push({
      ...deliveryStage!,
      stageNo: 2,
      status: adjustedStatus,
      carrierStatusText:
        isOrderInPickup && !dto.stages.some((s) => s.completed_at)
          ? 'Chờ tiếp nhận giao hàng'
          : deliveryStage!.carrierStatusText,
    });
  }

  // 3. Chặng Hoàn (nếu có luồng hoàn)
  const needsReturnStage = hasReturn || isPartialDelivery || isReturnStatus;

  if (hasReturn) {
    const returnStage = rawStages.find((s) => s.key === 'return' || s.key === 'refund');
    stages.push({
      ...returnStage!,
      stageNo: stages.length + 1,
    });
  } else if (needsReturnStage) {
    const isReturned = dto.status_code.startsWith('SPF-12');
    const isReturning = dto.status_code.startsWith('SPF-11');
    const returnStatus: ShippingStageItem['status'] = isReturned
      ? 'completed'
      : isReturning || isPartialDelivery
        ? 'active'
        : 'pending';

    const returnStatusText = isReturned
      ? 'Chuyển hoàn thành công'
      : isReturning || isPartialDelivery
        ? 'Đang chuyển hoàn về Shop'
        : 'Chờ xác nhận chuyển hoàn';

    stages.push({
      key: 'return',
      title: 'Hoàn',
      stageCode: 'STG-RETURN-0001',
      stageNo: stages.length + 1,
      legType: 3,
      carrier: carrierName,
      tracking: waybillCode,
      isSuperShip: isSuperShipCarrier,
      status: returnStatus,
      carrierStatusText: returnStatusText,
      carrierStatusCode: isReturned ? 'RETURNED' : isReturning || isPartialDelivery ? 'IN_RETURN' : 'WAITING_RETURN',
      carrierUpdatedAt: dto.updated_at,
      webhookEvents: [],
    });
  }

  return stages;
}

export function adaptMockOrderDto(dto: MockOrderDto): Order {
  const rawStages = dto.stages.map((stage, index) =>
    mapStage(stage, index, dto.status_code, dto.status_name),
  );
  const stages = synthesizeCanonicalStages(dto, rawStages);
  const pickup = stages.find((stage) => stage.key === 'pickup');
  const delivery = stages.find((stage) => stage.key === 'delivery');
  const returnStage = stages.find((stage) => stage.key === 'return');
  const finalReturn = stages.find((stage) => stage.key === 'refund');
  const activeStage = stages.find((s) => s.status === 'active');
  const pendingStage = stages.find((s) => s.status === 'pending');
  const primaryStage = activeStage || pendingStage || delivery || pickup || returnStage || finalReturn;
  const plannedCarrier = primaryStage?.carrier || dto.planned_carrier_name || undefined;
  const isInstant = stages.some(
    (stage) => stage.carrier === 'Green SM Express' || stage.carrier === 'GrabExpress',
  );
  const deliveryStageDto = dto.stages.find((s) => s.leg_type === 2);
  const pickupStageDto = dto.stages.find((s) => s.leg_type === 1);
  const driverDto =
    deliveryStageDto?.driver ||
    pickupStageDto?.driver ||
    dto.stages.find((s) => s.driver)?.driver;

  const instantState: NonNullable<Order['instantTracking']>['state'] = (() => {
    switch (dto.status_code) {
      case 'SPF-0303':
        return 'DRIVER_NOT_FOUND';
      case 'SPF-0301':
        return 'DRIVER_ASSIGNED';
      case 'SPF-0401':
        return 'DRIVER_TO_PICKUP';
      case 'SPF-0501':
      case 'SPF-0502':
        return 'PICKED_UP';
      case 'SPF-0801':
        return 'IN_DELIVERY';
      case 'SPF-0901':
        return 'DELIVERED';
      default:
        return 'CREATED';
    }
  })();
  const instantTracking: Order['instantTracking'] = isInstant
    ? {
        state: instantState,
        statusLabel: dto.status_name,
        currentAddress:
          instantState === 'DRIVER_NOT_FOUND' || instantState === 'CREATED'
            ? dto.pickup_address?.full_address || ''
            : dto.delivery_address?.full_address || '',
        updatedAt: primaryStage?.carrierUpdatedAt || dto.updated_at,
        progressPercent:
          instantState === 'DELIVERED' ? 100 : instantState === 'IN_DELIVERY' ? 70 : 0,
        pickupAddress: dto.pickup_address?.full_address || '',
        deliveryAddress: dto.delivery_address?.full_address || '',
        remainingDistanceKm:
          driverDto?.remaining_distance_km !== undefined
            ? driverDto.remaining_distance_km
            : instantState === 'DRIVER_NOT_FOUND' || instantState === 'CREATED'
              ? undefined
              : instantState === 'DELIVERED'
                ? 0
                : 2.5,
        etaMinutes:
          driverDto?.eta_minutes !== undefined
            ? driverDto.eta_minutes
            : instantState === 'DRIVER_NOT_FOUND' || instantState === 'CREATED'
              ? undefined
              : instantState === 'DELIVERED'
                ? 0
                : 15,
        estimatedArrivalAt:
          instantState === 'DRIVER_NOT_FOUND' || instantState === 'CREATED'
            ? undefined
            : dto.updated_at,
        vehicleType:
          driverDto?.vehicle_type ||
          (plannedCarrier === 'Green SM Express' ? 'Xe máy điện' : 'Xe máy'),
        vehiclePlate: driverDto?.license_plate,
        latitude: driverDto?.latitude,
        longitude: driverDto?.longitude,
      }
    : undefined;
  const noteParts = [dto.delivery_note, ...dto.notes.map((note) => note.content)].filter(Boolean);

  const deliveryProofs: DeliveryProof[] = (dto.images || [])
    .filter((img) => img.image_type === 2)
    .map((img) => ({
      id: img.image_code,
      imageUrl: img.url,
      capturedAt: dto.status_code.startsWith('SPF-09') ? dto.updated_at : dto.created_at,
      capturedBy: driverDto?.name || 'Nhân viên giao hàng',
      note: img.description || 'Kiện hàng đã được bàn giao trực tiếp cho người nhận.',
    }));

  return {
    id: dto.order_code,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    status: dto.status_name,
    spfCode: dto.status_code,
    statusHistory: dto.status_history.map((entry) => ({
      fromStatusCode: entry.from_status_code || undefined,
      statusCode: entry.status_code,
      statusName: entry.status_name,
      reasonCode: entry.reason_code || undefined,
      reason: entry.reason || undefined,
      changedAt: entry.changed_at,
    })),
    printed: false,
    batchId: dto.created_channel === 'BATCH' ? `BATCH-${dto.order_code}` : '',
    reconciliationId: '',
    name: dto.receiver?.contact_name || dto.receiver?.name || 'Chưa có người nhận',
    phone: dto.receiver?.phone || '',
    address: dto.delivery_address?.address_detail || dto.delivery_address?.full_address || '',
    region: dto.delivery_address?.full_address || '',
    product: dto.goods?.product_name || 'Chưa có thông tin hàng hóa',
    weight: dto.measure?.weight_g || 0,
    value: dto.goods?.declared_value || 0,
    cod: dto.cod_amount,
    length: dto.measure?.length_cm || 0,
    width: dto.measure?.width_cm || 0,
    height: dto.measure?.height_cm || 0,
    privateId: dto.soc,
    note: noteParts.join('\n'),
    payer: dto.fee_payer === 2 ? 'recipient' : 'sender',
    inspection: dto.inspection_type === 3 ? 'try' : dto.inspection_type === 2 ? 'view' : 'none',
    returnGoods: stages.some((stage) => stage.key === 'return' || stage.key === 'refund'),
    businessType: mapBusinessType(dto, stages),
    customerApplication: dto.customer_model === 4 ? 'SUPERAI' : 'SUPERSHIP',
    customerModel: mapCustomerModel(dto.customer_model),
    fulfillmentPlan: mapFulfillmentPlan(dto.transport_model),
    selectedCarrier: plannedCarrier,
    selectedService: dto.service_codes.map((code) => `SERVICE-${code}`).join(', '),
    carrierSelectionMode: `MODE-${dto.selection_mode}`,
    shippingInfo: {
      pickupCarrier: pickup?.carrier,
      pickupTracking: pickup?.tracking,
      deliveryCarrier: delivery?.carrier || (stages.length ? undefined : plannedCarrier),
      deliveryTracking: delivery?.tracking,
      returnCarrier: returnStage?.carrier,
      returnTracking: returnStage?.tracking,
      refundCarrier: finalReturn?.carrier,
      refundTracking: finalReturn?.tracking,
      currentStage: resolveCurrentStage(stages),
      carrierStatusText:
        primaryStage?.carrierStatusText ||
        (plannedCarrier ? `${plannedCarrier} – ${dto.status_name}` : dto.status_name),
      stages,
    },
    clientCode: dto.pricing_code,
    shopId: dto.shop_id,
    shopName: dto.sender?.name || 'Shop dataseed',
    shopPhone: dto.sender?.phone || '',
    sourceChannel: dto.created_channel.toLocaleLowerCase('vi'),
    serviceType: isInstant ? 'instant' : dto.service_codes.join(','),
    dispatchMethod: dto.pickup_method === 2 ? 'dropoff' : 'pickup',
    senderName: dto.sender?.contact_name || dto.sender?.name || '',
    senderPhone: dto.sender?.phone || '',
    senderAddress: dto.pickup_address?.full_address || '',
    shipperDeliveryName: driverDto?.name,
    shipperDeliveryPhone: driverDto?.phone,
    shipperDeliveryCode: driverDto?.carrier_shipper_code,
    deliveryProofs: deliveryProofs.length > 0 ? deliveryProofs : undefined,
    isExternalRouted: dto.transport_model === 2 || dto.transport_model === 3,
    deliveryResult:
      dto.delivery_result === 2 ? 'PARTIAL' : dto.delivery_result === 1 ? 'FULL' : 'NONE',
    supportStatus: dto.requests.some((request) => request.request_type === 'SUPPORT')
      ? 'PROCESSING'
      : undefined,
    codPaymentStatus: mapCodPaymentStatus(dto.cod_settlement_status),
    collectedAmount: dto.collected_amount,
    codCollectionStatus: dto.cod_collection_status,
    settledAmount: dto.settled_amount,
    codSettlementStatus: dto.cod_settlement_status,
    compensationAmount: dto.compensation_amount,
    compensationStatus: dto.compensation_status,
    syncStatus: dto.requests.some((request) => request.request_status === 4)
      ? 'FAILED'
      : 'SYNCED',
    pickupAt: pickup?.carrierUpdatedAt,
    deliveryAt: dto.status_code.startsWith('SPF-09') ? dto.updated_at : undefined,
    returnedAt: dto.status_code.startsWith('SPF-12') ? dto.updated_at : undefined,
    instantTracking,
  };
}

export function listMockOrderDtos(): MockOrderDto[] {
  return structuredClone(fixture.data);
}

export function getMockApiOrders(): Order[] {
  return listMockOrderDtos().map(adaptMockOrderDto);
}

export function getMockApiMetadata(): MockApiEnvelope['meta'] {
  return structuredClone(fixture.meta);
}
