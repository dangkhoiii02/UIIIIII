import type { ActorRole } from './types';

export type FilterGroupKey =
  | 'identity'
  | 'shop_select'
  | 'recipient'
  | 'sender_warehouse'
  | 'recipient_address'
  | 'carrier'
  | 'external_routing'
  | 'order_status'
  | 'carrier_status'
  | 'shipper'
  | 'pickup'
  | 'handover'
  | 'delivery'
  | 'cancel'
  | 'nvc_waybill'
  | 'price_account'
  | 'label'
  | 'return'
  | 'final_return'
  | 'partial_delivery'
  | 'exchange'
  | 'cod'
  | 'support'
  | 'incident'
  | 'claim'
  | 'sync'
  | 'ops_anomaly'
  | 'time';

/**
 * Ma trận nhóm bộ lọc theo Actor (Mục 5.4.1.2 Spec UC-ORD-004)
 */
const MATRIX: Record<FilterGroupKey, Record<ActorRole, boolean>> = {
  identity: { shop: true, cskh: true, ops: true, sales: true, finance: true, admin: true },
  shop_select: { shop: false, cskh: true, ops: true, sales: true, finance: true, admin: true },
  recipient: { shop: true, cskh: true, ops: true, sales: true, finance: true, admin: true },
  sender_warehouse: { shop: true, cskh: true, ops: true, sales: false, finance: true, admin: true },
  recipient_address: { shop: true, cskh: true, ops: true, sales: true, finance: true, admin: true },
  carrier: { shop: true, cskh: true, ops: true, sales: true, finance: true, admin: true },
  external_routing: { shop: false, cskh: false, ops: true, sales: false, finance: false, admin: true },
  order_status: { shop: true, cskh: true, ops: true, sales: true, finance: true, admin: true },
  carrier_status: { shop: false, cskh: true, ops: true, sales: false, finance: false, admin: true },
  shipper: { shop: false, cskh: true, ops: true, sales: false, finance: false, admin: true },
  pickup: { shop: true, cskh: true, ops: true, sales: false, finance: false, admin: true },
  handover: { shop: false, cskh: false, ops: true, sales: false, finance: false, admin: true },
  delivery: { shop: true, cskh: true, ops: true, sales: false, finance: false, admin: true },
  cancel: { shop: true, cskh: true, ops: true, sales: false, finance: false, admin: true },
  nvc_waybill: { shop: true, cskh: true, ops: true, sales: false, finance: false, admin: true },
  price_account: { shop: false, cskh: false, ops: false, sales: true, finance: true, admin: true },
  label: { shop: true, cskh: true, ops: true, sales: false, finance: false, admin: true },
  return: { shop: true, cskh: true, ops: true, sales: false, finance: true, admin: true },
  final_return: { shop: true, cskh: true, ops: true, sales: false, finance: true, admin: true },
  partial_delivery: { shop: true, cskh: true, ops: true, sales: false, finance: true, admin: true },
  exchange: { shop: true, cskh: true, ops: true, sales: false, finance: false, admin: true },
  cod: { shop: true, cskh: true, ops: false, sales: false, finance: true, admin: true },
  support: { shop: true, cskh: true, ops: true, sales: false, finance: false, admin: true },
  incident: { shop: true, cskh: true, ops: true, sales: false, finance: false, admin: true },
  claim: { shop: true, cskh: true, ops: true, sales: false, finance: true, admin: true },
  sync: { shop: false, cskh: false, ops: true, sales: false, finance: false, admin: true },
  ops_anomaly: { shop: false, cskh: false, ops: true, sales: false, finance: false, admin: true },
  time: { shop: true, cskh: true, ops: true, sales: true, finance: true, admin: true },
};

export function isGroupAllowed(role: ActorRole, group: FilterGroupKey): boolean {
  return MATRIX[group]?.[role] ?? false;
}

export const ROLE_LABELS: Record<ActorRole, { label: string; badge: string; isInternal: boolean }> = {
  shop: { label: 'Shop (Khách hàng)', badge: 'SHOP', isInternal: false },
  cskh: { label: 'CSKH (Hỗ trợ)', badge: 'CSKH', isInternal: true },
  ops: { label: 'Nhân viên Vận hành', badge: 'OPS', isInternal: true },
  sales: { label: 'Nhân viên Kinh doanh', badge: 'SALES', isInternal: true },
  finance: { label: 'Kế toán / Đối soát', badge: 'FINANCE', isInternal: true },
  admin: { label: 'Quản trị viên (Admin)', badge: 'ADMIN', isInternal: true },
};
