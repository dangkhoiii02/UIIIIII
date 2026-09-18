import type { Order } from './types';

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
  | 'edit_order'
  | 'edit_recipient'
  | 'edit_delivery_address'
  | 'edit_cod'
  | 'edit_delivery_note'
  | 'edit_goods'
  | 'edit_declared_weight'
  | 'edit_pickup_address'
  | 'edit_return_address'
  | 'add_goods_images'
  | 'retry_create_waybill'
  | 'cancel_order'
  | 'request_pickup_retry'
  | 'request_handover_retry'
  | 'request_redelivery'
  | 'request_exchange_return'
  | 'request_return'
  | 'request_return_pickup_retry'
  | 'request_return_handover_retry'
  | 'request_final_return_retry'
  | 'confirm_return'
  | 'change_carrier'
  | 'request_support'
  | 'report_incident'
  | 'submit_claim'
  | 'request_compensation'
  | 'print_label'
  | 'export_order'
  | 'reconcile_carrier'
  | 'view_carrier_cost';

export type OrderActionMode =
  | 'direct'
  | 'request_support'
  | 'conditional'
  | 'new_waybill'
  | 'blocked';

export interface PermissionDecision {
  allowed: boolean;
  mode: OrderActionMode;
  reason?: string;
}

const INTERNAL_CAPABILITIES: OrderCapability[] = [
  'view_order',
  'view_journey',
  'view_raw_carrier_status',
  'view_shipper',
  'request_support',
  'report_incident',
  'submit_claim',
  'request_compensation',
  'confirm_return',
  'change_carrier',
  'print_label',
  'export_order',
  'reconcile_carrier',
  'view_carrier_cost',
];

const SHOP_MAINTENANCE_CAPABILITIES: OrderCapability[] = [
  'edit_order',
  'edit_recipient',
  'edit_delivery_address',
  'edit_cod',
  'edit_delivery_note',
  'edit_goods',
  'edit_declared_weight',
  'edit_pickup_address',
  'edit_return_address',
  'add_goods_images',
  'retry_create_waybill',
  'cancel_order',
  'request_pickup_retry',
  'request_handover_retry',
  'request_redelivery',
  'request_exchange_return',
  'request_return',
  'request_return_pickup_retry',
  'request_return_handover_retry',
  'request_final_return_retry',
];

const INTERNAL_ONLY_CAPABILITIES: OrderCapability[] = [
  'view_raw_carrier_status',
  'confirm_return',
  'change_carrier',
  'reconcile_carrier',
  'view_carrier_cost',
];

const CHANGE_BASIC_INFO_CODES = new Set([
  'SPF-0301', 'SPF-0401', 'SPF-0402', 'SPF-0403', 'SPF-0501', 'SPF-0502',
  'SPF-0601', 'SPF-0602', 'SPF-0603', 'SPF-0604', 'SPF-0605', 'SPF-0606',
  'SPF-0701', 'SPF-0702', 'SPF-0801', 'SPF-0802', 'SPF-0803',
]);
const CHANGE_GOODS_CODES = new Set(['SPF-0301', 'SPF-0401', 'SPF-0402', 'SPF-0403']);
const CANCEL_CODES = new Set([
  'SPF-0102', 'SPF-0202', 'SPF-0301', 'SPF-0401', 'SPF-0402', 'SPF-0403',
]);
const CHANGE_CARRIER_CODES = new Set(['SPF-0501', 'SPF-0502']);
const REQUEST_RETURN_CODES = new Set(['SPF-0702', 'SPF-0801', 'SPF-0802', 'SPF-0803']);
const EXCHANGE_RETURN_CODES = new Set([
  'SPF-0501', 'SPF-0502', 'SPF-0601', 'SPF-0602', 'SPF-0603', 'SPF-0604',
  'SPF-0605', 'SPF-0606', 'SPF-0701', 'SPF-0702', 'SPF-0801', 'SPF-0802',
  'SPF-0803', 'SPF-0901',
]);
const GOODS_IMAGE_CODES = new Set([
  'SPF-0201', 'SPF-0202', 'SPF-0301', 'SPF-0401', 'SPF-0402', 'SPF-0403',
  'SPF-0802', 'SPF-0803', 'SPF-0901', 'SPF-1005', 'SPF-1107', 'SPF-1201',
  'SPF-1202', 'SPF-1203',
]);
const RETURN_ADDRESS_CODES = new Set([
  'SPF-0702', 'SPF-0801', 'SPF-0802', 'SPF-0803', 'SPF-0902', 'SPF-1001',
  'SPF-1107', 'SPF-1108',
]);

function allowed(
  mode: Exclude<OrderActionMode, 'blocked'> = 'direct',
  reason?: string,
): PermissionDecision {
  return { allowed: true, mode, reason };
}

function denied(reason: string): PermissionDecision {
  return { allowed: false, mode: 'blocked', reason };
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
  return allowed();
}

function carrierFamily(
  order: Order,
): 'ghn' | 'vtp' | 'best' | 'spx' | 'jt' | 'vnpost' | 'instant' | 'other' {
  const carrier = (
    order.shippingInfo?.deliveryCarrier ||
    order.selectedCarrier ||
    ''
  ).toLocaleLowerCase('vi');
  if (carrier.includes('ghn') || carrier.includes('giao hàng nhanh')) return 'ghn';
  if (carrier.includes('viettel') || carrier.includes('vtp')) return 'vtp';
  if (carrier.includes('best')) return 'best';
  if (carrier.includes('spx') || carrier.includes('shopee')) return 'spx';
  if (carrier.includes('j&t') || carrier.includes('jnt')) return 'jt';
  if (carrier.includes('vietnam post') || carrier.includes('vnpost')) return 'vnpost';
  if (carrier.includes('green sm') || carrier.includes('grab')) return 'instant';
  return 'other';
}

function editResolution(order: Order): PermissionDecision {
  const carrier = carrierFamily(order);
  if (carrier === 'ghn' || carrier === 'vtp' || carrier === 'vnpost') return allowed();
  return allowed(
    'request_support',
    'NVC hiện tại tiếp nhận thay đổi qua kênh hỗ trợ. Dữ liệu chỉ cập nhật sau khi NVC xác nhận.',
  );
}

function cancelResolution(order: Order): PermissionDecision {
  const carrier = carrierFamily(order);
  if (carrier === 'best' || carrier === 'spx') {
    return allowed('request_support', 'NVC hiện tại cần CSKH phối hợp để hủy vận đơn.');
  }
  return allowed();
}

function stateDecision(order: Order, capability: OrderCapability): PermissionDecision {
  const code = order.spfCode;
  const carrier = carrierFamily(order);

  if (capability === 'view_order' || capability === 'view_journey') return allowed();
  if (capability === 'view_shipper') {
    return order.shipperDeliveryPhone
      ? allowed()
      : denied('Nhà vận chuyển chưa cung cấp thông tin shipper.');
  }
  if (capability === 'view_raw_carrier_status' || capability === 'view_carrier_cost') {
    return allowed();
  }
  if (
    capability === 'edit_order' ||
    capability === 'edit_recipient' ||
    capability === 'edit_delivery_address' ||
    capability === 'edit_cod' ||
    capability === 'edit_delivery_note'
  ) {
    if (!CHANGE_BASIC_INFO_CODES.has(code)) {
      return denied('Trạng thái hiện tại không cho phép thay đổi thông tin giao hàng.');
    }
    // Shop được sửa trực tiếp khi đơn đang giao; không chuyển sang luồng hỗ trợ.
    if (code === 'SPF-0801') return allowed();
    return editResolution(order);
  }
  if (capability === 'edit_goods' || capability === 'edit_pickup_address') {
    return CHANGE_GOODS_CODES.has(code)
      ? editResolution(order)
      : denied('Trạng thái hiện tại không cho phép thay đổi dữ liệu này.');
  }
  if (capability === 'edit_declared_weight') {
    if (CHANGE_GOODS_CODES.has(code)) return editResolution(order);
    if (code === 'SPF-0501' && carrier === 'ghn') {
      return allowed('conditional', 'GHN cho phép điều chỉnh khối lượng khai báo ở trạng thái này.');
    }
    return denied('Không thể điều chỉnh khối lượng khai báo ở trạng thái hiện tại.');
  }
  if (capability === 'edit_return_address') {
    if (!RETURN_ADDRESS_CODES.has(code)) {
      return denied('Trạng thái hiện tại không cho phép thay đổi địa chỉ trả/hoàn.');
    }
    if (carrier === 'ghn') {
      return allowed('conditional', 'GHN chỉ cho đổi địa chỉ trước khi bắt đầu chuyển hoàn.');
    }
    return allowed('new_waybill', 'NVC hiện tại cần phát sinh vận đơn RETURN_FINAL tới địa chỉ trả mới.');
  }
  if (capability === 'add_goods_images') {
    return GOODS_IMAGE_CODES.has(code)
      ? allowed()
      : denied('Trạng thái hiện tại không cho phép cập nhật ảnh hàng hóa.');
  }
  if (capability === 'retry_create_waybill') {
    return code === 'SPF-0102'
      ? allowed()
      : denied('Chỉ thử tạo lại vận đơn khi lần tạo vận đơn NVC bị lỗi.');
  }
  if (capability === 'cancel_order') {
    return CANCEL_CODES.has(code)
      ? cancelResolution(order)
      : denied('Order đã qua giai đoạn cho phép hủy.');
  }
  if (capability === 'request_pickup_retry') {
    if (code !== 'SPF-0402') return denied('Chỉ yêu cầu lấy lại sau khi lấy hàng thất bại.');
    return carrier === 'vtp'
      ? allowed()
      : allowed('request_support', 'NVC hiện tại tiếp nhận yêu cầu lấy lại qua CSKH.');
  }
  if (capability === 'change_carrier') {
    return CHANGE_CARRIER_CODES.has(code)
      ? allowed()
      : denied('Chỉ được đổi NVC giao sau khi đã lấy hàng và trước khi bắt đầu bàn giao.');
  }
  if (capability === 'request_handover_retry') {
    return code === 'SPF-0603'
      ? allowed('request_support', 'Yêu cầu bàn giao lại cần Vận hành phối hợp với NVC.')
      : denied('Chỉ yêu cầu bàn giao lại khi lần bàn giao gần nhất thất bại.');
  }
  if (capability === 'request_redelivery') {
    if (code !== 'SPF-0802') return denied('Chỉ yêu cầu giao lại sau khi giao hàng thất bại.');
    return carrier === 'ghn' || carrier === 'vtp'
      ? allowed()
      : allowed('request_support', 'NVC hiện tại tiếp nhận yêu cầu giao lại qua CSKH.');
  }
  if (capability === 'request_exchange_return') {
    if (!EXCHANGE_RETURN_CODES.has(code)) {
      return denied('Trạng thái hiện tại không cho phép đổi hoặc lấy hàng về.');
    }
    if (code === 'SPF-0901' || carrier === 'spx' || carrier === 'vnpost') {
      return allowed('new_waybill', 'Nghiệp vụ này cần phát sinh mã vận đơn thu hồi mới.');
    }
    if (carrier === 'instant' || carrier === 'other') {
      return allowed('request_support', 'NVC này chưa có chính sách tích hợp được xác nhận; chuyển CSKH xử lý.');
    }
    return allowed('conditional', 'Cần kiểm tra điều kiện dịch vụ, COD và khối lượng theo NVC.');
  }
  if (capability === 'request_return') {
    if (!REQUEST_RETURN_CODES.has(code)) {
      return denied('Trạng thái hiện tại không cho phép yêu cầu chuyển hoàn.');
    }
    return carrier === 'ghn' || carrier === 'vtp'
      ? allowed()
      : allowed('request_support', 'NVC hiện tại tiếp nhận chuyển hoàn qua CSKH.');
  }
  if (capability === 'request_return_pickup_retry') {
    return code === 'SPF-1005'
      ? allowed('request_support', 'Yêu cầu lấy lại hàng hoàn cần phối hợp với NVC.')
      : denied('Chỉ thao tác khi lần lấy hàng hoàn gần nhất thất bại.');
  }
  if (capability === 'request_return_handover_retry') {
    return code === 'SPF-1103'
      ? allowed('request_support', 'Bàn giao lại Hoàn → Trả cuối cần Vận hành phối hợp NVC.')
      : denied('Chỉ thao tác khi trả cho NVC hoàn cuối thất bại.');
  }
  if (capability === 'request_final_return_retry') {
    return code === 'SPF-1107'
      ? allowed('request_support', 'Yêu cầu trả lại cần CSKH phối hợp với NVC.')
      : denied('Chỉ thao tác khi lần trả hàng gần nhất thất bại.');
  }
  if (capability === 'confirm_return') {
    return code === 'SPF-1001'
      ? allowed()
      : denied('Chỉ xác nhận khi Order đang chờ xác nhận chuyển hoàn.');
  }
  if (capability === 'request_support') {
    return code === 'SPF-0101'
      ? denied('Order đang được tạo tại NVC, chưa phát sinh dữ liệu để hỗ trợ.')
      : allowed();
  }
  if (capability === 'report_incident') {
    return code >= 'SPF-0501' ? allowed() : denied('Chưa đủ điều kiện ghi nhận sự cố vận chuyển.');
  }
  if (capability === 'submit_claim') {
    return !['SPF-0101', 'SPF-0102', 'SPF-0201'].includes(code)
      ? allowed()
      : denied('Trạng thái hiện tại chưa cho phép gửi khiếu nại.');
  }
  if (capability === 'request_compensation') {
    return code >= 'SPF-0501'
      ? allowed()
      : denied('Trạng thái hiện tại chưa cho phép yêu cầu bồi thường.');
  }
  if (capability === 'print_label') {
    return allowed();
  }
  if (capability === 'export_order') {
    return code === 'SPF-0101'
      ? denied('Order đang tạo tại NVC nên chưa đủ dữ liệu để xuất.')
      : allowed();
  }
  if (capability === 'reconcile_carrier') {
    return code === 'SPF-0101'
      ? denied('Order đang tạo tại NVC nên chưa thể tra soát đồng bộ.')
      : allowed();
  }
  return denied('Chức năng chưa được cấu hình cho trạng thái hiện tại.');
}

export function getOrderPermission(
  viewer: OrderViewer,
  order: Order,
  capability: OrderCapability,
): PermissionDecision {
  const scope = checkScope(viewer, order);
  if (!scope.allowed) return scope;

  if (viewer.kind === 'recipient') {
    return ['view_order', 'view_journey'].includes(capability)
      ? stateDecision(order, capability)
      : denied('Người nhận chỉ được xem thông tin tracking công khai.');
  }
  if (viewer.kind === 'partner') {
    return ['view_order', 'view_journey'].includes(capability)
      ? stateDecision(order, capability)
      : denied('Chức năng này không nằm trong phạm vi được ủy quyền cho đối tác.');
  }
  if (viewer.kind === 'internal') {
    if (capability === 'print_label') return allowed();
    if (SHOP_MAINTENANCE_CAPABILITIES.includes(capability)) {
      return denied('Đây là thao tác của Shop, không thuộc nghiệp vụ Nội bộ.');
    }
    const capabilities = viewer.permissions ?? INTERNAL_CAPABILITIES;
    if (!capabilities.includes(capability)) {
      return denied('Tài khoản nội bộ chưa được cấp quyền thực hiện chức năng này.');
    }
    return stateDecision(order, capability);
  }
  if (INTERNAL_ONLY_CAPABILITIES.includes(capability)) {
    return denied('Chức năng này chỉ dành cho người dùng nội bộ có quyền.');
  }
  return stateDecision(order, capability);
}
