import { describe, expect, it } from 'vitest';
import { getMockApiMetadata, getMockApiOrders, listMockOrderDtos } from './mock-order-api';

describe('mock Order API fixture', () => {
  it('maps the current database seed without dropping orders, stages or tracking events', () => {
    const orders = getMockApiOrders();
    const stages = orders.flatMap((order) => order.shippingInfo?.stages || []);
    const events = stages.flatMap((stage) => stage.webhookEvents || []);

    expect(getMockApiMetadata().database).toBe('supership-superplatform-order-db');
    expect(orders).toHaveLength(53);
    expect(stages).toHaveLength(130);
    expect(events).toHaveLength(151);
    expect(orders.every((order) => /^\d{13}$/.test(order.id))).toBe(true);
  });

  it('keeps canonical stage codes and real carrier waybill codes separate', () => {
    const orders = getMockApiOrders();
    const stages = orders.flatMap((order) => order.shippingInfo?.stages || []);

    expect(
      stages.every((stage) =>
        /^STG-(PICKUP|DELIVERY|RETURN|FINAL-RETURN)-\d{4}$/.test(stage.stageCode || ''),
      ),
    ).toBe(true);
    expect(stages.some((stage) => stage.tracking === 'GY8YLSDK')).toBe(true);
    expect(stages.some((stage) => stage.tracking === 'SPXVN066263841279')).toBe(true);
    expect(stages.some((stage) => stage.tracking === 'STGS983264RT.826941743')).toBe(true);
    expect(stages.some((stage) => stage.tracking === '999800060099893')).toBe(true);
  });

  it('exposes the six COD, settlement and compensation projections from orders', () => {
    const order = getMockApiOrders().find((item) => item.id === '9209190000006');

    expect(order).toMatchObject({
      collectedAmount: 560000,
      codCollectionStatus: 4,
      settledAmount: 0,
      codSettlementStatus: 6,
      compensationAmount: 280000,
      compensationStatus: 3,
    });
  });

  it('supports the driver allocation failure status from the new API catalog', () => {
    const dto = listMockOrderDtos().find((item) => item.order_code === '9209190000003');
    const order = getMockApiOrders().find((item) => item.id === '9209190000003');

    expect(dto?.status_code).toBe('SPF-0303');
    expect(order?.status).toBe('Không tìm được tài xế');
    expect(order?.serviceType).toBe('instant');
    expect(order?.selectedCarrier).toBe('Green SM Express');
    expect(order?.instantTracking?.state).toBe('DRIVER_NOT_FOUND');
  });

  it('has at least one current Order for every one of the 45 SPF statuses', () => {
    const statuses = new Set(listMockOrderDtos().map((item) => item.status_code));

    expect(statuses.size).toBe(45);
    expect(statuses.has('SPF-0302')).toBe(true);
    expect(statuses.has('SPF-1108')).toBe(true);
  });

  it('hydrates batch-created orders and keeps the planned carrier visible before waybill creation', () => {
    const orders = getMockApiOrders();
    const localOrder = orders.find((item) => item.id === '9100000000005');
    const superAiOrder = orders.find((item) => item.id === '9100000000006');

    expect(localOrder).toMatchObject({
      name: 'Dương Minh Quân',
      product: 'Bộ ga giường cotton 1,6 m',
      selectedCarrier: 'SuperShip',
      status: 'Đang tạo đơn NVC',
    });
    expect(superAiOrder).toMatchObject({
      name: 'Mai Khánh Linh',
      product: 'Đèn bàn LED chống cận',
      selectedCarrier: 'BEST Express',
      status: 'Đang tạo đơn NVC',
    });
    expect(localOrder?.statusHistory).toHaveLength(1);
    expect(superAiOrder?.shippingInfo?.carrierStatusText).toBe(
      'BEST Express – Đang tạo đơn NVC',
    );
  });

  it('keeps the delivery carrier block available while the order is waiting for pickup', () => {
    const waitingPickupOrders = getMockApiOrders().filter((item) => item.spfCode === 'SPF-0301');

    expect(waitingPickupOrders).toHaveLength(3);
    expect(
      waitingPickupOrders.every((order) =>
        order.shippingInfo?.stages?.some(
          (stage) =>
            stage.key === 'pickup' &&
            Boolean(stage.carrier) &&
            stage.carrierStatusCode === 'WAITING_PICKUP',
        ),
      ),
    ).toBe(true);
    expect(
      waitingPickupOrders.every((order) =>
        order.shippingInfo?.stages?.some(
          (stage) =>
            stage.key === 'delivery' &&
            Boolean(stage.carrier) &&
            Boolean(stage.tracking),
        ),
      ),
    ).toBe(true);
  });

  it('synthesizes canonical stages (Lấy - Giao - Hoàn nếu có) for single-carrier and partial orders', () => {
    const orders = getMockApiOrders();
    const findOrder = (id: string) => orders.find((o) => o.id === id)!;

    // 1. Đơn 9100000000001 (J&T Express): Lấy -> Giao
    const o1 = findOrder('9100000000001');
    expect(o1.shippingInfo?.stages?.map((s) => s.key)).toEqual(['pickup', 'delivery']);
    expect(o1.shippingInfo?.stages?.every((s) => s.carrier === 'J&T Express')).toBe(true);

    // 2. Đơn 9100000000002 (GHN): Lấy -> Giao (cùng mã vận đơn, cả 2 completed)
    const o2 = findOrder('9100000000002');
    expect(o2.shippingInfo?.stages?.map((s) => s.key)).toEqual(['pickup', 'delivery']);
    expect(o2.shippingInfo?.stages?.every((s) => s.carrier === 'GHN')).toBe(true);
    expect(o2.shippingInfo?.stages?.every((s) => s.tracking === 'GY8YLSDK')).toBe(true);
    expect(o2.shippingInfo?.stages?.every((s) => s.status === 'completed')).toBe(true);

    // 3. Đơn 9100000000003 (Đa NVC: SuperShip -> J&T Express): Lấy -> Giao
    const o3 = findOrder('9100000000003');
    expect(o3.shippingInfo?.stages?.map((s) => s.key)).toEqual(['pickup', 'delivery']);
    expect(o3.shippingInfo?.stages?.[0]?.carrier).toBe('SuperShip');
    expect(o3.shippingInfo?.stages?.[1]?.carrier).toBe('J&T Express');

    // 4. Đơn 9100000000004 (SPX Express - Giao 1 phần): Lấy -> Giao -> Hoàn
    const o4 = findOrder('9100000000004');
    expect(o4.shippingInfo?.stages?.map((s) => s.key)).toEqual(['pickup', 'delivery', 'return']);
    expect(o4.shippingInfo?.stages?.every((s) => s.carrier === 'SPX Express')).toBe(true);
    expect(o4.shippingInfo?.stages?.every((s) => s.tracking === 'SPXVN066263841279')).toBe(true);

    // 5. Đơn 9100000000005 (SuperShip): Lấy -> Giao
    const o5 = findOrder('9100000000005');
    expect(o5.shippingInfo?.stages?.map((s) => s.key)).toEqual(['pickup', 'delivery']);
    expect(o5.shippingInfo?.stages?.every((s) => s.carrier === 'SuperShip')).toBe(true);

    // 6. Đơn 9100000000006 (BEST Express): Lấy -> Giao
    const o6 = findOrder('9100000000006');
    expect(o6.shippingInfo?.stages?.map((s) => s.key)).toEqual(['pickup', 'delivery']);
    expect(o6.shippingInfo?.stages?.every((s) => s.carrier === 'BEST Express')).toBe(true);

    // 7. Đơn 9100000000007 (Viettel Post): Lấy (active) -> Giao (pending)
    const o7 = findOrder('9100000000007');
    expect(o7.shippingInfo?.stages?.map((s) => s.key)).toEqual(['pickup', 'delivery']);
    expect(o7.shippingInfo?.stages?.[0]).toMatchObject({ carrier: 'Viettel Post', status: 'active', key: 'pickup' });
    expect(o7.shippingInfo?.stages?.[1]).toMatchObject({ carrier: 'Viettel Post', status: 'pending', key: 'delivery' });

    // 8. Đơn 9100000000008 (Vietnam Post, pickup_method = 2): Gửi hàng (active) -> Giao (pending)
    const o8 = findOrder('9100000000008');
    expect(o8.shippingInfo?.stages?.map((s) => s.key)).toEqual(['pickup', 'delivery']);
    expect(o8.shippingInfo?.stages?.[0]).toMatchObject({ carrier: 'Vietnam Post', title: 'Gửi hàng', status: 'active' });
    expect(o8.shippingInfo?.stages?.[1]).toMatchObject({ carrier: 'Vietnam Post', title: 'Giao', status: 'pending' });

    // 9. Đơn 9100000000009 (BEST Express): Lấy (active) -> Giao (pending)
    const o9 = findOrder('9100000000009');
    expect(o9.shippingInfo?.stages?.map((s) => s.key)).toEqual(['pickup', 'delivery']);
    expect(o9.shippingInfo?.stages?.[0]).toMatchObject({ carrier: 'BEST Express', status: 'active', key: 'pickup' });
    expect(o9.shippingInfo?.stages?.[1]).toMatchObject({ carrier: 'BEST Express', status: 'pending', key: 'delivery' });
  });

  it('supports the active instant delivery scenario (SPF-0801) with Green SM Express', () => {
    const orders = getMockApiOrders();
    const order = orders.find((item) => item.id === '9209190000008');

    expect(order).toBeDefined();
    expect(order?.selectedCarrier).toBe('Green SM Express');
    expect(order?.spfCode).toBe('SPF-0801');
    expect(order?.status).toBe('Đang giao hàng');
    expect(order?.serviceType).toBe('instant');
    expect(order?.shipperDeliveryName).toBe('Trần Minh Khoa');
    expect(order?.shipperDeliveryPhone).toBe('0938124567');
    expect(order?.shipperDeliveryCode).toBe('GSM-DRV-218');

    expect(order?.instantTracking).toMatchObject({
      state: 'IN_DELIVERY',
      vehicleType: 'Xe máy điện',
      vehiclePlate: '59-TD 218.45',
      remainingDistanceKm: 2.5,
      etaMinutes: 15,
    });

    const stages = order?.shippingInfo?.stages || [];
    expect(stages).toHaveLength(2);
    expect(stages[0]).toMatchObject({
      key: 'pickup',
      carrier: 'Green SM Express',
      tracking: 'GSM-EXP-20260920-000008',
      status: 'completed',
    });
    expect(stages[1]).toMatchObject({
      key: 'delivery',
      carrier: 'Green SM Express',
      tracking: 'GSM-EXP-20260920-000008',
      status: 'active',
    });
  });

  it('supports the delivered instant delivery scenario (SPF-0901) with GrabExpress and POD proofs', () => {
    const orders = getMockApiOrders();
    const order = orders.find((item) => item.id === '9209190000009');

    expect(order).toBeDefined();
    expect(order?.selectedCarrier).toBe('GrabExpress');
    expect(order?.spfCode).toBe('SPF-0901');
    expect(order?.status).toBe('Đã giao hàng');
    expect(order?.serviceType).toBe('instant');
    expect(order?.shipperDeliveryName).toBe('Lê Quốc Bảo');
    expect(order?.shipperDeliveryPhone).toBe('0973456789');
    expect(order?.shipperDeliveryCode).toBe('GRAB-DRV-509');
    expect(order?.collectedAmount).toBe(680000);
    expect(order?.codCollectionStatus).toBe(3);

    expect(order?.instantTracking).toMatchObject({
      state: 'DELIVERED',
      vehicleType: 'Xe máy',
      vehiclePlate: '59-U2 509.86',
      remainingDistanceKm: 0,
      etaMinutes: 0,
    });

    expect(order?.deliveryProofs).toHaveLength(1);
    expect(order?.deliveryProofs?.[0]).toMatchObject({
      id: 'POD-9209190000009-01',
      imageUrl: '/images/delivery-proof/proof-delivered-v1.png',
      capturedBy: 'Lê Quốc Bảo',
    });

    const stages = order?.shippingInfo?.stages || [];
    expect(stages).toHaveLength(2);
    expect(stages[0]).toMatchObject({
      key: 'pickup',
      carrier: 'GrabExpress',
      tracking: 'DELV-1708923452-B9C0D',
      status: 'completed',
    });
    expect(stages[1]).toMatchObject({
      key: 'delivery',
      carrier: 'GrabExpress',
      tracking: 'DELV-1708923452-B9C0D',
      status: 'completed',
    });
  });
});
