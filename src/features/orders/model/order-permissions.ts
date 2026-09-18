import type { Order } from './types';
import { getSpfLifecyclePhase } from './spf-status-catalog';

export type OrderViewer =
  | { kind: 'shop'; shopId: string }
  | { kind: 'internal'; permissions?: OrderCapability[]; dataShopIds?: string[] }
  | { kind: 'partner'; authorizedOrderIds: string[] }
  | { kind: 'recipient'; trackingOrderId: string };

export type OrderCapability =
  | 'view_order'
  | 'view_journey'
  | 'view_raw_carrier_status'
  | 'view_shipper'
  | 'add_goods_images'
  | 'edit_order'
  | 'edit_cod'
  | 'cancel_order'
  | 'request_support'
  | 'request_redelivery'
  | 'request_return'
  | 'confirm_return'
  | 'change_carrier'
  | 'view_carrier_cost';

export interface PermissionDecision {
  allowed: boolean;
  reason?: string;
}

const INTERNAL_CAPABILITIES: OrderCapability[] = [
  'view_order',
  'view_journey',
  'view_raw_carrier_status',
  'view_shipper',
  'add_goods_images',
  'edit_order',
  'edit_cod',
  'cancel_order',
  'request_support',
  'request_redelivery',
  'request_return',
  'confirm_return',
  'change_carrier',
  'view_carrier_cost',
];

function denied(reason: string): PermissionDecision {
  return { allowed: false, reason };
}

function checkScope(viewer: OrderViewer, order: Order): PermissionDecision {
  if (viewer.kind === 'shop' && order.shopId !== viewer.shopId) {
    return denied('Đơn hàng không thuộc phạm vi Shop hiện tại.');
  }
  if (
    viewer.kind === 'internal' &&
    viewer.dataShopIds?.length &&
    order.shopId &&
    !viewer.dataShopIds.includes(order.shopId)
  ) {
    return denied('Đơn hàng nằm ngoài phạm vi dữ liệu được phân công.');
  }
  if (viewer.kind === 'partner' && !viewer.authorizedOrderIds.includes(order.id)) {
    return denied('Đối tác chưa được ủy quyền xem đơn hàng này.');
  }
  if (viewer.kind === 'recipient' && viewer.trackingOrderId !== order.id) {
    return denied('Mã tra cứu không hợp lệ hoặc đã hết hiệu lực.');
  }
  return { allowed: true };
}

export function getOrderPermission(
  viewer: OrderViewer,
  order: Order,
  capability: OrderCapability,
): PermissionDecision {
  const scope = checkScope(viewer, order);
  if (!scope.allowed) return scope;

  const phase = getSpfLifecyclePhase(order.spfCode);
  if (capability === 'request_redelivery' && order.spfCode !== 'SPF-0802') {
    return denied('Chỉ yêu cầu giao lại khi lần giao gần nhất thất bại.');
  }
  if (capability === 'request_return' && order.spfCode !== 'SPF-0802') {
    return denied('Chỉ yêu cầu chuyển hoàn sau khi giao hàng thất bại.');
  }
  if (capability === 'confirm_return' && order.spfCode !== 'SPF-1001') {
    return denied('Chỉ xác nhận khi Order đang chờ xác nhận chuyển hoàn.');
  }
  if (capability === 'change_carrier' && ['delivered', 'returned', 'cancelled'].includes(phase)) {
    return denied('Không thể đổi NVC khi Order đã kết thúc.');
  }
  if (capability === 'view_shipper' && !order.shipperDeliveryPhone) {
    return denied('Nhà vận chuyển chưa cung cấp thông tin shipper.');
  }

  if (viewer.kind === 'recipient') {
    return ['view_order', 'view_journey'].includes(capability)
      ? { allowed: true }
      : denied('Người nhận chỉ được xem thông tin tracking công khai.');
  }

  if (viewer.kind === 'partner') {
    return ['view_order', 'view_journey'].includes(capability)
      ? { allowed: true }
      : denied('Chức năng này không nằm trong phạm vi được ủy quyền cho đối tác.');
  }

  if (viewer.kind === 'internal') {
    const capabilities = viewer.permissions ?? INTERNAL_CAPABILITIES;
    return capabilities.includes(capability)
      ? { allowed: true }
      : denied('Tài khoản nội bộ chưa được cấp quyền thực hiện chức năng này.');
  }

  if (['view_order', 'view_journey', 'request_support'].includes(capability)) {
    return { allowed: true };
  }
  if (['view_raw_carrier_status', 'confirm_return', 'change_carrier', 'view_carrier_cost'].includes(capability)) {
    return denied('Chức năng này chỉ dành cho người dùng nội bộ có quyền.');
  }
  const beforePickup = ['creating', 'pickup'].includes(phase) && order.spfCode !== 'SPF-0201';
  if (capability === 'add_goods_images') {
    return beforePickup
      ? { allowed: true }
      : denied('Chỉ có thể thêm ảnh trước khi nhà vận chuyển lấy hàng.');
  }
  if (capability === 'edit_order' || capability === 'edit_cod') {
    return beforePickup
      ? { allowed: true }
      : denied('Đơn đã được vận chuyển nên không còn được phép chỉnh sửa.');
  }
  if (capability === 'cancel_order') {
    return beforePickup
      ? { allowed: true }
      : denied('Đơn đã qua giai đoạn cho phép Shop hủy.');
  }
  if (capability === 'request_redelivery') {
    return order.spfCode === 'SPF-0802'
      ? { allowed: true }
      : denied('Chỉ yêu cầu giao lại khi lần giao gần nhất thất bại.');
  }
  if (capability === 'request_return') {
    return order.spfCode === 'SPF-0802'
      ? { allowed: true }
      : denied('Chỉ yêu cầu chuyển hoàn sau khi giao hàng thất bại.');
  }
  return denied('Shop không được phép thực hiện chức năng này.');
}
