import { describe, expect, it } from 'vitest';
import { billableWeight, filterOrders, validateOrder } from './order';
import { defaultOrderInput, emptyFilters } from './types';
import { createMemoryOrderRepository } from '../data/order-repository';
import { getSpfLifecyclePhase, SPF_STATUS_MAP } from './spf-status-catalog';
const valid = {
  ...defaultOrderInput,
  name: 'Khách mẫu',
  phone: '0901234567',
  address: '1 Đường mẫu',
  region: 'Hà Nội',
  product: 'Áo',
};
describe('order domain', () => {
  it('rejects invalid numbers and phones, permits zero COD', () => {
    expect(validateOrder(valid)).toEqual([]);
    expect(validateOrder({ ...valid, phone: '123', cod: NaN, weight: 0 })).toHaveLength(3);
  });
  it('uses volumetric weight when it exceeds actual weight', () => {
    expect(billableWeight({ ...valid, length: 20, width: 20, height: 20 })).toBe(1600);
  });
  it('validates the entire batch before writing', () => {
    const repository = createMemoryOrderRepository([]);
    expect(() => repository.create([valid, { ...valid, phone: '' }])).toThrow();
    expect(repository.list()).toEqual([]);
  });
  it('updates an existing order without creating a duplicate', () => {
    const repository = createMemoryOrderRepository([]);
    const [order] = repository.create([valid]);
    repository.update(order!.id, { ...valid, cod: 50000 });
    expect(repository.list()).toHaveLength(1);
    expect(repository.list()[0]?.cod).toBe(50000);
  });
  it('records every label print with actor and keeps the total count', () => {
    const repository = createMemoryOrderRepository([]);
    const [order] = repository.create([valid]);
    repository.markPrinted([order!.id], {
      printedBy: 'S275518 · AB Shop',
      actorType: 'shop',
      templateType: 'S10 · 100 × 150 mm',
    });
    repository.markPrinted([order!.id], {
      printedBy: 'Nguyễn Minh · Nội bộ SuperPlatform',
      actorType: 'internal',
      templateType: 'A6 · 105 × 148 mm',
    });

    const printed = repository.list()[0]!;
    expect(printed.printed).toBe(true);
    expect(printed.printHistory).toHaveLength(2);
    expect(printed.printHistory?.map((entry) => entry.printedBy)).toEqual([
      'S275518 · AB Shop',
      'Nguyễn Minh · Nội bộ SuperPlatform',
    ]);
  });
  it('audits every internal view of the active delivery shipper phone', () => {
    const repository = createMemoryOrderRepository([]);
    const [order] = repository.create([valid]);

    repository.recordAccessAudit(order!.id, {
      viewedBy: 'Nhân viên nội bộ SuperPlatform',
      field: 'shipper_delivery_phone',
      reason: 'Tra cứu phục vụ vận hành đơn hàng',
    });

    expect(repository.list()[0]?.accessAudit).toHaveLength(1);
    expect(repository.list()[0]?.accessAudit?.[0]).toMatchObject({
      viewedBy: 'Nhân viên nội bộ SuperPlatform',
      field: 'shipper_delivery_phone',
    });
  });
  it('moves a failed delivery through redelivery and return-request operations', () => {
    const seedRepository = createMemoryOrderRepository([]);
    const [created] = seedRepository.create([valid]);
    const failed = {
      ...created!,
      status: 'Giao hàng thất bại' as const,
      spfCode: 'SPF-0802' as const,
    };

    const redeliveryRepository = createMemoryOrderRepository([failed]);
    const redelivery = redeliveryRepository.applyOperation(failed.id, {
      type: 'request-redelivery',
    });
    expect(redelivery).toMatchObject({
      spfCode: 'SPF-0803',
      status: 'Đang yêu cầu giao lại',
    });

    const returnRepository = createMemoryOrderRepository([failed]);
    const returnRequest = returnRepository.applyOperation(failed.id, {
      type: 'request-return',
      reason: 'Người nhận từ chối nhận hàng',
    });
    expect(returnRequest).toMatchObject({
      spfCode: 'SPF-1001',
      status: 'Chờ xác nhận chuyển hoàn',
      returnReason: 'Người nhận từ chối nhận hàng',
    });
    const confirmed = returnRepository.applyOperation(failed.id, { type: 'confirm-return' });
    expect(confirmed).toMatchObject({
      spfCode: 'SPF-1002',
      status: 'Đã xác nhận chuyển hoàn',
    });
  });

  it('changes carrier with an audit record and rejects the current carrier', () => {
    const seedRepository = createMemoryOrderRepository([]);
    const [created] = seedRepository.create([valid]);
    const routed = {
      ...created!,
      selectedCarrier: 'GHN',
      shippingInfo: {
        deliveryCarrier: 'GHN',
        deliveryTracking: 'GHN-001',
        currentStage: 'pickup' as const,
        stages: [
          {
            key: 'delivery' as const,
            title: 'Giao',
            carrier: 'GHN',
            tracking: 'GHN-001',
            status: 'pending' as const,
          },
        ],
      },
    };
    const repository = createMemoryOrderRepository([routed]);

    expect(() =>
      repository.applyOperation(routed.id, {
        type: 'change-carrier',
        carrier: 'GHN',
        reason: 'Thử trùng NVC',
        changedBy: 'Ops',
      }),
    ).toThrow('NVC mới phải khác NVC đang phụ trách.');

    const changed = repository.applyOperation(routed.id, {
      type: 'change-carrier',
      carrier: 'Viettel Post',
      reason: 'NVC cũ quá tải',
      changedBy: 'Ops',
    });
    expect(changed.shippingInfo?.deliveryCarrier).toBe('Viettel Post');
    expect(changed.carrierChangeHistory?.[0]).toMatchObject({
      fromCarrier: 'GHN',
      toCarrier: 'Viettel Post',
      reason: 'NVC cũ quá tải',
    });
  });
  it('treats both payer selections as all and applies date filters', () => {
    const repository = createMemoryOrderRepository([]);
    const [order] = repository.create([valid]);
    const sample = { ...order!, createdAt: '2026-09-12T12:00:00+07:00' };
    expect(filterOrders([sample], { ...emptyFilters, sender: true, recipient: true })).toHaveLength(
      1,
    );
    expect(
      filterOrders([sample], { ...emptyFilters, days: '1' }, new Date('2026-09-13T12:00:00+07:00')),
    ).toEqual([]);
  });

  it('finds the same order from pickup, delivery, or return waybill', () => {
    const repository = createMemoryOrderRepository([]);
    const [created] = repository.create([valid]);
    const routedOrder = {
      ...created!,
      shippingInfo: {
        currentStage: 'return' as const,
        stages: [
          {
            key: 'pickup' as const,
            title: 'Chuyển',
            carrier: 'SuperShip',
            tracking: 'STGS983262LM.826941741',
          },
          {
            key: 'delivery' as const,
            title: 'Giao',
            carrier: 'BEST Express',
            tracking: '999800060099891',
          },
          {
            key: 'return' as const,
            title: 'Hoàn',
            carrier: 'SuperShip',
            tracking: 'STGS983262LM.826941743',
          },
        ],
      },
    };

    for (const waybill of [
      'STGS983262LM.826941741',
      '999800060099891',
      'STGS983262LM.826941743',
    ]) {
      expect(filterOrders([routedOrder], { ...emptyFilters, query: waybill })).toEqual([
        routedOrder,
      ]);
      expect(filterOrders([routedOrder], { ...emptyFilters, carrierWaybill: waybill })).toEqual([
        routedOrder,
      ]);
    }
  });

  it('filters general carrier and each carrier stage independently', () => {
    const repository = createMemoryOrderRepository([]);
    const [created] = repository.create([valid]);
    const routedOrder = {
      ...created!,
      shippingInfo: {
        stages: [
          {
            key: 'pickup' as const,
            title: 'Chuyển',
            carrier: 'SuperShip',
            tracking: 'STGS983262LM.826941741',
          },
          {
            key: 'delivery' as const,
            title: 'Giao',
            carrier: 'BEST Express',
            tracking: '999800060099891',
          },
        ],
      },
    };

    expect(filterOrders([routedOrder], { ...emptyFilters, carrierAny: 'best' })).toHaveLength(1);
    expect(filterOrders([routedOrder], { ...emptyFilters, carrierPickup: 'best' })).toEqual([]);
    expect(filterOrders([routedOrder], { ...emptyFilters, carrierDelivery: 'best' })).toHaveLength(
      1,
    );
  });

  it('seeds a concise representative order set with matching names and stages', () => {
    const orders = createMemoryOrderRepository().list();
    const codes = orders.map((order) => order.spfCode);

    expect(orders).toHaveLength(9);
    expect(codes).toEqual(
      expect.arrayContaining([
        'SPF-0301',
        'SPF-0801',
        'SPF-0802',
        'SPF-0901',
        'SPF-1009',
        'SPF-1201',
        'SPF-0201',
      ]),
    );
    expect(new Set(codes).size).toBe(7);
    const instantOrders = orders.filter((order) => order.serviceType === 'instant');
    expect(instantOrders.map((order) => order.selectedCarrier)).toEqual(
      expect.arrayContaining(['Green SM Express', 'GrabExpress']),
    );
    for (const instantOrder of instantOrders) {
      expect(instantOrder.instantTracking?.currentAddress).toBeTruthy();
      expect(instantOrder.instantTracking?.updatedAt).toBeTruthy();
      expect(instantOrder.instantTracking?.progressPercent).toBeGreaterThan(0);
      expect(instantOrder.instantTracking?.vehiclePlate).toBeTruthy();
    }

    for (const order of orders) {
      expect(order.status).toBe(SPF_STATUS_MAP[order.spfCode].name);
      expect(order.shippingInfo?.carrierStatusText).toBeTruthy();
      expect(order.shipperDeliveryName).toBeTruthy();
      expect(order.shipperDeliveryCode).toBeTruthy();
      expect(order.shipperDeliveryPhone).toBeTruthy();
      if (order.spfCode === 'SPF-0901') {
        expect(order.deliveryProofs?.[0]?.imageUrl).toBe(
          '/images/delivery-proof/proof-delivered-v1.png',
        );
      }
      for (const stage of order.shippingInfo?.stages || []) {
        expect(stage.carrierStatusText).toBeTruthy();
        expect(stage.carrierStatusCode).toBeTruthy();
        expect(stage.carrierUpdatedAt).toBeTruthy();
        expect(stage.webhookEvents?.length).toBeGreaterThan(0);
        expect(stage.webhookEvents?.[0]?.requestId).toBeTruthy();
        for (const event of stage.webhookEvents || []) {
          expect(event.mappedSpfStatus).toBe(SPF_STATUS_MAP[event.mappedSpfCode].name);
        }
      }

      const phase = getSpfLifecyclePhase(order.spfCode);
      const currentStage = order.shippingInfo?.currentStage;
      if (phase === 'creating' || phase === 'pickup') expect(currentStage).toBe('pickup');
      if (phase === 'handover' || phase === 'delivery') expect(currentStage).toBe('delivery');
      if (phase === 'return' && order.spfCode < 'SPF-1101') expect(currentStage).toBe('return');
      if (phase === 'return' && order.spfCode >= 'SPF-1101') expect(currentStage).toBe('refund');
      if (phase === 'returned' || order.spfCode === 'SPF-0201')
        expect(currentStage).toBe('completed');
    }
  });

  it('filters raw carrier status independently for delivery, return, and final-return legs', () => {
    const orders = createMemoryOrderRepository().list();

    const deliveryFailed = filterOrders(orders, {
      ...emptyFilters,
      carrierStatusDelivery: 'Giao hàng thất bại',
    });
    expect(deliveryFailed.map((order) => order.spfCode)).toContain('SPF-1009');

    const returning = filterOrders(orders, {
      ...emptyFilters,
      carrierStatusReturn: 'Đang chuyển hoàn',
    });
    expect(returning.map((order) => order.spfCode)).toContain('SPF-1009');

    const finalReturnOrder = {
      ...orders[0]!,
      shippingInfo: {
        ...orders[0]!.shippingInfo!,
        stages: [
          ...(orders[0]!.shippingInfo?.stages || []),
          {
            key: 'refund' as const,
            title: 'Trả cuối',
            carrier: 'GHTK',
            tracking: 'GHTK-RT000001',
            status: 'active' as const,
            carrierStatusText: 'Đang trả hàng',
          },
        ],
      },
    };
    const finalReturn = filterOrders([finalReturnOrder], {
      ...emptyFilters,
      carrierFinalReturn: 'ghtk',
      carrierStatusFinalReturn: 'Đang trả hàng',
    });
    expect(finalReturn).toHaveLength(1);
  });

  it('uses the explicit external-routing flag instead of inferring from carrier count', () => {
    const repository = createMemoryOrderRepository([]);
    const [created] = repository.create([valid]);
    const multipleCarriers = {
      ...created!,
      isExternalRouted: false,
      shippingInfo: {
        stages: [
          {
            key: 'pickup' as const,
            title: 'Lấy',
            carrier: 'SuperShip',
            tracking: 'PICKUP-01',
          },
          {
            key: 'delivery' as const,
            title: 'Giao',
            carrier: 'GHN',
            tracking: 'DELIVERY-01',
          },
        ],
      },
    };

    expect(
      filterOrders([multipleCarriers], { ...emptyFilters, isExternalRouted: true }),
    ).toEqual([]);
    expect(
      filterOrders(
        [{ ...multipleCarriers, isExternalRouted: true }],
        { ...emptyFilters, isExternalRouted: true },
      ),
    ).toHaveLength(1);
  });

  it('filters internal operational flags and shipper contacts', () => {
    const repository = createMemoryOrderRepository([]);
    const [created] = repository.create([valid]);
    const failedPickup = {
      ...created!,
      status: 'Lấy hàng thất bại' as const,
      spfCode: 'SPF-0402' as const,
      shipperPickupPhone: '0901234567',
      updatedAt: '2026-09-15T08:00:00+07:00',
    };

    expect(
      filterOrders(
        [failedPickup],
        { ...emptyFilters, pickupFailed: true, shipperPickupPhone: '34567' },
        new Date('2026-09-16T10:00:00+07:00'),
      ),
    ).toHaveLength(1);
    expect(
      filterOrders(
        [failedPickup],
        { ...emptyFilters, statusAgeHours: '30' },
        new Date('2026-09-16T10:00:00+07:00'),
      ),
    ).toEqual([]);
  });

  it('filters stale carrier updates while excluding terminal orders', () => {
    const orders = createMemoryOrderRepository().list();
    const active = orders.find((order) => order.id === '551029381205')!;
    const terminal = orders.find((order) => order.id === '992831024316')!;
    const result = filterOrders(
      [active, terminal],
      { ...emptyFilters, anomalyNoUpdateHours: '24' },
      new Date('2026-09-16T18:00:00+07:00'),
    );

    expect(result.map((order) => order.spfCode)).toEqual(['SPF-0801']);
  });
});
