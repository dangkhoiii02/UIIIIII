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
      reason: 'Đơn hàng không thuộc phạm vi Shop hiện tại.',
    });
  });

  it('allows shop editing before pickup but not after pickup', () => {
    expect(getOrderPermission({ kind: 'shop', shopId: 'S275518' }, order, 'edit_order').allowed).toBe(true);
    expect(
      getOrderPermission(
        { kind: 'shop', shopId: 'S275518' },
        { ...order, spfCode: 'SPF-0801', status: 'Đang giao hàng' },
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
    expect(getOrderPermission(internal, order, 'change_carrier').allowed).toBe(true);
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
});

