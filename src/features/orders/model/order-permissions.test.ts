import { describe, expect, it } from 'vitest';
import { defaultOrderInput, type Order } from './types';
import { getOrderPermission } from './order-permissions';

const order: Order = {
  ...defaultOrderInput,
  id: '100000000001',
  shopId: 'S275518',
  createdAt: '2026-09-18T10:00:00+07:00',
  status: 'Chờ lấy hàng',
  spfCode: 'SPF-0301',
  printed: false,
  batchId: '',
  reconciliationId: '',
};

describe('order permissions', () => {
  it('limits a shop to its own orders', () => {
    expect(getOrderPermission({ kind: 'shop', shopId: 'OTHER' }, order, 'view_order')).toEqual({
      allowed: false,
      mode: 'blocked',
      reason: 'Đơn hàng không thuộc phạm vi Shop hiện tại.',
    });
  });

  it('allows basic edits through delivery and blocks them after delivery', () => {
    expect(getOrderPermission({ kind: 'shop', shopId: 'S275518' }, order, 'edit_order').allowed).toBe(true);
    const deliveringDecision = getOrderPermission(
      { kind: 'shop', shopId: 'S275518' },
      { ...order, spfCode: 'SPF-0801', status: 'Đang giao hàng', selectedCarrier: 'Green SM Express' },
      'edit_order',
    );
    expect(deliveringDecision.allowed).toBe(true);
    expect(deliveringDecision.mode).toBe('direct');
    expect(
      getOrderPermission(
        { kind: 'shop', shopId: 'S275518' },
        { ...order, spfCode: 'SPF-0801', status: 'Đang giao hàng', selectedCarrier: 'GrabExpress' },
        'edit_cod',
      ).mode,
    ).toBe('direct');
    expect(
      getOrderPermission(
        { kind: 'shop', shopId: 'S275518' },
        { ...order, spfCode: 'SPF-0901', status: 'Đã giao hàng' },
        'edit_order',
      ).allowed,
    ).toBe(false);
  });

  it('only allows redelivery after a failed delivery', () => {
    const viewer = { kind: 'shop' as const, shopId: 'S275518' };
    expect(getOrderPermission(viewer, order, 'request_redelivery').allowed).toBe(false);
    expect(
      getOrderPermission(
        viewer,
        { ...order, spfCode: 'SPF-0802', status: 'Giao hàng thất bại' },
        'request_redelivery',
      ).allowed,
    ).toBe(true);
  });

  it('keeps carrier change and carrier cost internal-only', () => {
    const shop = { kind: 'shop' as const, shopId: 'S275518' };
    const internal = { kind: 'internal' as const };
    expect(getOrderPermission(shop, order, 'change_carrier').allowed).toBe(false);
    expect(getOrderPermission(shop, order, 'view_carrier_cost').allowed).toBe(false);
    expect(getOrderPermission(internal, order, 'change_carrier').allowed).toBe(false);
    expect(
      getOrderPermission(
        internal,
        { ...order, spfCode: 'SPF-0501', status: 'Đã lấy hàng' },
        'change_carrier',
      ).allowed,
    ).toBe(true);
  });

  it('blocks carrier changes after last-mile delivery has started', () => {
    const delivering = {
      ...order,
      spfCode: 'SPF-0801' as const,
      status: 'Đang giao hàng' as const,
    };
    expect(getOrderPermission({ kind: 'internal' }, delivering, 'change_carrier')).toEqual({
      allowed: false,
      mode: 'blocked',
      reason: 'Chỉ được đổi NVC giao sau khi đã lấy hàng và trước khi bắt đầu bàn giao.',
    });
  });

  it('honors internal permission and data scope restrictions', () => {
    expect(
      getOrderPermission(
        { kind: 'internal', permissions: ['view_order'], dataShopIds: ['S275518'] },
        order,
        'change_carrier',
      ).allowed,
    ).toBe(false);
    expect(
      getOrderPermission(
        { kind: 'internal', dataShopIds: ['OTHER'] },
        order,
        'view_order',
      ).allowed,
    ).toBe(false);
  });

  it('keeps shop maintenance actions out of the internal role', () => {
    const delivered = { ...order, spfCode: 'SPF-0901' as const, status: 'Đã giao hàng' as const };
    expect(getOrderPermission({ kind: 'internal' }, order, 'edit_order').allowed).toBe(false);
    expect(getOrderPermission({ kind: 'internal' }, order, 'cancel_order').allowed).toBe(false);
    expect(getOrderPermission({ kind: 'internal' }, order, 'add_goods_images').allowed).toBe(false);
    expect(getOrderPermission({ kind: 'internal' }, delivered, 'edit_order').allowed).toBe(false);
    expect(getOrderPermission({ kind: 'internal' }, delivered, 'cancel_order').allowed).toBe(false);
    expect(getOrderPermission({ kind: 'internal' }, delivered, 'add_goods_images').allowed).toBe(
      false,
    );
    expect(
      getOrderPermission(
        { kind: 'internal' },
        { ...order, spfCode: 'SPF-1001', status: 'Chờ xác nhận chuyển hoàn' },
        'change_carrier',
      ).allowed,
    ).toBe(false);
  });

  it('resolves direct, support and new-waybill carrier outcomes separately', () => {
    const viewer = { kind: 'shop' as const, shopId: 'S275518' };
    const failedDelivery = { ...order, spfCode: 'SPF-0802' as const, status: 'Giao hàng thất bại' as const };

    expect(
      getOrderPermission(
        viewer,
        { ...failedDelivery, selectedCarrier: 'GHN' },
        'request_redelivery',
      ).mode,
    ).toBe('direct');
    expect(
      getOrderPermission(
        viewer,
        { ...failedDelivery, selectedCarrier: 'BEST Express' },
        'request_redelivery',
      ).mode,
    ).toBe('request_support');
    expect(
      getOrderPermission(
        viewer,
        { ...order, spfCode: 'SPF-0901', status: 'Đã giao hàng', selectedCarrier: 'SPX Express' },
        'request_exchange_return',
      ).mode,
    ).toBe('new_waybill');
  });

  it('always allows label printing for Shop and internal users in scope', () => {
    const blockedBefore = {
      ...order,
      spfCode: 'SPF-0101' as const,
      status: 'Đang tạo đơn NVC' as const,
    };
    const returned = {
      ...order,
      spfCode: 'SPF-1203' as const,
      status: 'Đã trả một phần' as const,
    };

    expect(
      getOrderPermission({ kind: 'shop', shopId: 'S275518' }, blockedBefore, 'print_label').allowed,
    ).toBe(true);
    expect(
      getOrderPermission({ kind: 'shop', shopId: 'S275518' }, returned, 'print_label').allowed,
    ).toBe(true);
    expect(
      getOrderPermission({ kind: 'internal', permissions: ['view_order'] }, returned, 'print_label')
        .allowed,
    ).toBe(true);
  });
});
