import { useState } from 'react';
import {
  Eye,
  EyeOff,
  Send,
  RotateCw,
  Pencil,
  Printer,
  X,
  User,
  Phone,
  MapPin,
  Package,
  Scale,
  Copy,
  Truck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Store,
  Zap,
} from 'lucide-react';
import { money } from '@/shared/lib/format';
import { useToast } from '@/shared/ui/toast-context';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import type { Order, ShippingRoutingInfo, ShippingStageItem } from '../model/types';
import { getSpfStatusTone } from '../model/spf-status-catalog';
import { getOrderPermission, type OrderCapability } from '../model/order-permissions';
import { formatInstantEta } from '../model/instant-tracking';

export type OrderAction = 'detail' | 'carrier' | 'support' | 'copy' | 'edit' | 'print' | 'cancel';

// Exported for the status-label unit test; this file otherwise renders the order table.
// eslint-disable-next-line react-refresh/only-export-components
export function getCleanCarrierStatus(statusText: string): string {
  if (!statusText) return '';
  return statusText.replace(/^[^-–—]+[-–—]\s*/i, '').trim() || statusText;
}

function renderCarrierStatusBadge(statusText: string) {
  const cleanStatus = getCleanCarrierStatus(statusText);
  const text = statusText.toLowerCase();
  let badgeClass = 'status-tag-blue';
  let Icon = Truck;

  if (
    text.includes('hoãn') ||
    text.includes('hủy') ||
    text.includes('lỗi') ||
    text.includes('trả') ||
    text.includes('hoàn')
  ) {
    badgeClass = 'status-tag-amber';
    Icon = AlertTriangle;
  } else if (text.includes('thành công') || text.includes('đã giao') || text.includes('hoàn tất')) {
    badgeClass = 'status-tag-green';
    Icon = CheckCircle2;
  } else if (text.includes('lấy') || text.includes('chờ')) {
    badgeClass = 'status-tag-rose';
    Icon = Clock;
  }

  return (
    <div className={`shipping-current-status-badge ${badgeClass}`}>
      <Icon size={12} className="status-badge-icon" />
      <span>{cleanStatus}</span>
    </div>
  );
}

function carrierStageStatus(order: Order, stage: ShippingStageItem) {
  if (stage.carrierStatusText) return stage.carrierStatusText;
  if (stage.status === 'completed') return 'Đã kết thúc chặng';
  if (stage.status === 'pending') return 'Chưa tiếp nhận';
  return getCleanCarrierStatus(order.shippingInfo?.carrierStatusText || 'Đang xử lý');
}

function carrierStageTone(stage: ShippingStageItem, statusText: string) {
  const normalized = statusText.toLocaleLowerCase('vi');
  if (
    normalized.includes('lỗi') ||
    normalized.includes('thất bại') ||
    normalized.includes('từ chối')
  )
    return 'failed';
  if (stage.status === 'completed') return 'completed';
  if (stage.status === 'active') return 'active';
  return 'pending';
}

function formatCarrierUpdatedAt(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function renderCarrierLogo(carrier: string, isSuperShip?: boolean) {
  const name = (carrier || '').toLowerCase();

  // Tên NVC của từng chặng là nguồn sự thật. Không dùng cờ isSuperShip cũ để
  // ghi đè logo Green SM/Grab/GHN... trên các đơn giao trực tiếp.
  if (name.includes('super')) {
    return (
      <div className="carrier-brand-logo supership" title="SuperShip (Đơn vị chủ quản)">
        <img src="/carriers/supership.jpg" alt="SuperShip" className="carrier-brand-img" />
      </div>
    );
  }

  if (name.includes('green sm') || name.includes('greensm')) {
    return (
      <div className="carrier-brand-logo green-sm" title="Green SM Express">
        <img src="/carriers/xanhsm.jpg" alt="Green SM Express" className="carrier-brand-img" />
      </div>
    );
  }

  if (name.includes('grab')) {
    return (
      <div className="carrier-brand-logo grab" title="GrabExpress">
        <img src="/carriers/grab.jpg" alt="GrabExpress" className="carrier-brand-img" />
      </div>
    );
  }

  if (name.includes('spx') || name.includes('shopee')) {
    return (
      <div className="carrier-brand-logo spx" title="SPX Express">
        <img src="/carriers/spx_official.svg" alt="SPX Express" className="carrier-brand-img" />
      </div>
    );
  }

  if (name.includes('j&t') || name.includes('jnt')) {
    return (
      <div className="carrier-brand-logo jt" title="J&amp;T Express">
        <img src="/carriers/jt_official.webp" alt="J&amp;T Express" className="carrier-brand-img" />
      </div>
    );
  }

  if (name.includes('ghn') || name.includes('nhanh')) {
    return (
      <div className="carrier-brand-logo ghn" title="Giao Hàng Nhanh (GHN)">
        <img src="/carriers/ghn.jpg" alt="GHN" className="carrier-brand-img" />
      </div>
    );
  }

  if (name.includes('best')) {
    return (
      <div className="carrier-brand-logo best" title="BEST Express">
        <img src="/carriers/BEST.jpg" alt="BEST Express" className="carrier-brand-img" />
      </div>
    );
  }

  if (name.includes('ghtk') || name.includes('tiết kiệm')) {
    return (
      <div className="carrier-brand-logo ghtk" title="Giao Hàng Tiết Kiệm (GHTK)">
        <img src="/carriers/ghtk_emblem.svg" alt="GHTK" className="carrier-brand-img" />
      </div>
    );
  }

  if (name.includes('viettel') || name.includes('vtp')) {
    return (
      <div className="carrier-brand-logo viettelpost" title="Viettel Post">
        <img src="/carriers/viettel_emblem.png" alt="Viettel Post" className="carrier-brand-img" />
      </div>
    );
  }

  if (name.includes('vietnam post') || name.includes('vietnampost') || name.includes('vnpost')) {
    return (
      <div className="carrier-brand-logo vnpost" title="Vietnam Post">
        <img src="/carriers/vnp.jpg" alt="Vietnam Post" className="carrier-brand-img" />
      </div>
    );
  }

  return (
    <div
      className={`carrier-brand-logo generic ${isSuperShip ? 'supership-fallback' : ''}`}
      title={carrier || 'Nhà vận chuyển'}
    >
      <Truck size={16} aria-hidden="true" />
    </div>
  );
}

function hasCarrierIcon(carrier: string, isSuperShip?: boolean) {
  return Boolean(carrier || isSuperShip);
}

function getShippingStages(
  shipping?: ShippingRoutingInfo,
  includeFinalReturn = false,
): ShippingStageItem[] {
  const normalizeStage = (stage: ShippingStageItem): ShippingStageItem => ({
    ...stage,
    isSuperShip: stage.carrier.toLocaleLowerCase('vi').includes('super'),
    title:
      stage.title ||
      (stage.key === 'pickup'
        ? 'Lấy'
        : stage.key === 'delivery'
          ? 'Giao'
          : stage.key === 'return'
            ? 'Hoàn'
            : 'Trả cuối'),
  });
  if (!shipping) {
    return [];
  }

  // Khi mock API đã trả danh sách chặng thì chỉ hiển thị đúng các chặng có trong database.
  if (shipping.stages) {
    return shipping.stages
      .filter((stage) => includeFinalReturn || stage.key !== 'refund')
      .map(normalizeStage);
  }

  // Nếu đơn có luồng chuyển hoàn -> đúng 3 chặng chuẩn: Lấy -> Giao -> Hoàn
  if (shipping.returnCarrier || shipping.refundCarrier) {
    const isCompleted = shipping.currentStage === 'completed';
    const isReturnLegActive =
      shipping.currentStage === 'return' && !shipping.carrierStatusText?.includes('BEST');

    return [
      {
        key: 'pickup',
        title: 'Lấy',
        carrier: shipping.pickupCarrier || 'SuperShip',
        tracking: shipping.pickupTracking || 'STGS983262LM.826941741',
        isSuperShip: true,
        status: 'completed',
      },
      {
        key: 'delivery',
        title: 'Giao',
        carrier: shipping.deliveryCarrier || 'BEST Express',
        tracking: shipping.deliveryTracking || '999800060099891',
        isSuperShip: false,
        // Khi "Đang chuyển hoàn", hàng vẫn có thể đang ở bưu cục giao của BEST.
        status: isCompleted ? 'completed' : isReturnLegActive ? 'completed' : 'active',
      },
      {
        key: 'return',
        title: 'Hoàn',
        carrier: shipping.returnCarrier || shipping.refundCarrier || 'SuperShip',
        tracking: shipping.returnTracking || shipping.refundTracking || 'STGS983262LM.826941743',
        isSuperShip: true,
        status: isCompleted ? 'completed' : isReturnLegActive ? 'active' : 'pending',
      },
    ];
  }

  // Đơn giao hàng bình thường: 2 chặng: Lấy -> Giao
  return [
    {
      key: 'pickup',
      title: 'Lấy',
      carrier: shipping.pickupCarrier || 'SuperShip',
      tracking: shipping.pickupTracking || 'STGS983262LM.826941741',
      isSuperShip: true,
      status: shipping.currentStage === 'pickup' ? 'active' : 'completed',
    },
    {
      key: 'delivery',
      title: 'Giao',
      carrier: shipping.deliveryCarrier || 'GHN',
      tracking: shipping.deliveryTracking || 'GY8YLSDK',
      isSuperShip: false,
      status:
        shipping.currentStage === 'pickup'
          ? 'pending'
          : shipping.currentStage === 'completed'
            ? 'completed'
            : 'active',
    },
  ];
}

// eslint-disable-next-line react-refresh/only-export-components
export function getTrackingSlots(stages: ShippingStageItem[]) {
  const pickup = stages.find((stage) => stage.key === 'pickup');
  const delivery = stages.find((stage) => stage.key === 'delivery');
  const returnStage = stages.find((stage) => stage.key === 'return' || stage.key === 'refund');

  const slots: { key: string; label: string; stage?: ShippingStageItem }[] = [];
  if (pickup?.tracking) {
    slots.push({
      key: 'pickup',
      label: pickup.title === 'Gửi hàng' ? 'Mã Gửi' : 'Mã Lấy',
      stage: pickup,
    });
  }
  if (delivery?.tracking) {
    slots.push({ key: 'delivery', label: 'Mã Giao', stage: delivery });
  }
  if (returnStage?.tracking) {
    slots.push({ key: 'return', label: 'Mã Hoàn', stage: returnStage });
  }
  return slots.filter(({ stage }) => Boolean(stage?.tracking));
}

const shopActions = [
  { key: 'detail', title: 'Chi tiết', Icon: Eye },
  { key: 'support', title: 'Gửi yêu cầu hỗ trợ', Icon: Send },
  { key: 'copy', title: 'Tạo lại đơn', Icon: RotateCw },
  { key: 'edit', title: 'Sửa đơn', Icon: Pencil },
  { key: 'print', title: 'In đơn', Icon: Printer },
  { key: 'cancel', title: 'Hủy đơn', Icon: X },
] as const;

const internalActions = [
  { key: 'detail', title: 'Xem chi tiết vận hành', Icon: Eye },
  { key: 'carrier', title: 'Vận hành nhà vận chuyển', Icon: Truck },
  { key: 'support', title: 'Xử lý yêu cầu', Icon: Send },
  { key: 'print', title: 'In nhãn', Icon: Printer },
] as const;

const ACTION_CAPABILITY: Record<OrderAction, OrderCapability | null> = {
  detail: 'view_order',
  carrier: 'view_raw_carrier_status',
  support: 'request_support',
  copy: null,
  edit: 'edit_order',
  print: 'print_label',
  cancel: 'cancel_order',
};

function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return '12/09/2026 • 11:26';
  if (dateStr.includes(' • ')) return dateStr;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} • ${hours}:${minutes}`;
  } catch {
    return dateStr;
  }
}

function maskPhone(phone: string): string {
  if (phone.length >= 10) {
    return phone.slice(0, 3) + '****' + phone.slice(-3);
  }
  return phone;
}

export function OrderTable({
  orders,
  totalCount,
  currentPage,
  pageSize,
  selected,
  onSelect,
  onAction,
  onPageChange,
  isInternal = false,
}: {
  orders: Order[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  selected: string[];
  onSelect: (ids: string[]) => void;
  onAction: (action: OrderAction, order: Order) => void;
  onPageChange: (page: number) => void;
  isInternal?: boolean;
}) {
  const notify = useToast();
  const [visiblePhones, setVisiblePhones] = useState<Record<string, boolean>>({});
  const [journeyModalOrder, setJourneyModalOrder] = useState<Order | null>(null);
  const rowActions = isInternal ? internalActions : shopActions;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const rangeStart = totalCount ? (currentPage - 1) * pageSize + 1 : 0;
  const rangeEnd = totalCount ? Math.min(currentPage * pageSize, totalCount) : 0;

  const handleCopy = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    notify(`Đã sao chép mã đơn: ${id}`);
  };

  const handleCopyTracking = (tracking: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(tracking);
    notify(`Đã sao chép mã vận đơn (${title}): ${tracking}`);
  };

  const togglePhone = (id: string) => {
    setVisiblePhones((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className={`card body order-results ${isInternal ? 'internal-order-results' : ''}`}>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th
                style={{
                  width: isInternal ? 36 : '3.5%',
                  minWidth: isInternal ? 36 : undefined,
                  paddingLeft: isInternal ? 8 : 12,
                }}
              >
                <input
                  type="checkbox"
                  aria-label="Chọn tất cả"
                  checked={!!orders.length && orders.every((order) => selected.includes(order.id))}
                  onChange={(e) =>
                    onSelect(e.target.checked ? orders.map((order) => order.id) : [])
                  }
                />
              </th>
              <th
                className="table-heading-left"
                style={{ width: isInternal ? 140 : '12%', minWidth: isInternal ? 140 : undefined }}
              >
                Mã Đơn Hàng
              </th>
              {isInternal ? (
                <>
                  <th className="table-heading-left" style={{ width: 160, minWidth: 160 }}>
                    Cửa Hàng / Shop
                  </th>
                  <th className="table-heading-left" style={{ width: 220, minWidth: 220 }}>
                    Người Nhận
                  </th>
                </>
              ) : (
                <th style={{ width: '17%' }}>Khách Hàng</th>
              )}
              <th
                className="table-heading-left"
                style={{ width: isInternal ? 155 : '13%', minWidth: isInternal ? 155 : undefined }}
              >
                Thông Tin Đơn Hàng
              </th>
              <th
                className="col-shipping"
                style={{ width: isInternal ? 230 : '15%', minWidth: isInternal ? 230 : undefined }}
              >
                {isInternal ? 'NVC & trạng thái từng chặng' : 'Thông Tin Vận Chuyển'}
              </th>
              <th
                className="customer-collection-column"
                style={{ width: isInternal ? 110 : '9.5%', minWidth: isInternal ? 110 : undefined }}
              >
                Tiền Thu Khách
              </th>
              <th
                className="order-value-column"
                style={{ width: isInternal ? 105 : '7.5%', minWidth: isInternal ? 105 : undefined }}
              >
                Trị Giá Hàng
              </th>
              <th
                className="order-status-column"
                style={{ width: isInternal ? 140 : '13%', minWidth: isInternal ? 140 : undefined }}
              >
                Trạng Thái Đơn Hàng
              </th>
              <th
                className="order-actions-column"
                style={{ width: isInternal ? 100 : '9%', minWidth: isInternal ? 100 : undefined }}
              >
                Tác Vụ
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const shipping = order.shippingInfo || {
                carrierStatusText: order.status,
                stages: [],
              };

              const isPhoneRevealed = !!visiblePhones[order.id];

              return (
                <tr key={order.id}>
                  <td style={{ paddingLeft: 16, paddingTop: 16 }}>
                    <input
                      type="checkbox"
                      aria-label={'Chọn đơn ' + order.id}
                      checked={selected.includes(order.id)}
                      onChange={(e) =>
                        onSelect(
                          e.target.checked
                            ? [...selected, order.id]
                            : selected.filter((id) => id !== order.id),
                        )
                      }
                    />
                  </td>

                  {/* Cột 1: Mã Đơn Hàng */}
                  <td className="table-primary-cell">
                    <div className="table-order-id-cell">
                      <span
                        className="order-id-link"
                        onClick={() => onAction('detail', order)}
                        title="Xem chi tiết đơn hàng"
                      >
                        {order.id}
                      </span>
                      <button
                        type="button"
                        className="cell-copy-btn"
                        onClick={(e) => handleCopy(order.id, e)}
                        title="Sao chép mã đơn"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                    <div className="table-cell-date">{formatDisplayDate(order.createdAt)}</div>
                  </td>

                  {/* Cột Cửa Hàng / Shop (Dành riêng cho Nội bộ) */}
                  {isInternal && (
                    <td className="table-primary-cell">
                      <div className="table-shop-cell">
                        <div className="cell-item-row table-shop-name-row">
                          <Store size={14} className="cell-icon-slate" />
                          <span
                            className="shop-name-bold"
                            title={order.shopName || 'AB Shop'}
                          >
                            {order.shopName || 'AB Shop'}
                          </span>
                        </div>
                        {order.shopPhone && (
                          <div className="cell-item-row shop-phone-sub">
                            <Phone size={12} className="cell-icon-slate" />
                            <span>{order.shopPhone}</span>
                          </div>
                        )}
                        {order.warehouseId && (
                          <div className="cell-item-row">
                            <span className="warehouse-tag">Kho: {order.warehouseId}</span>
                          </div>
                        )}
                      </div>
                    </td>
                  )}

                  {/* Cột Người Nhận / Khách Hàng */}
                  <td className="table-primary-cell">
                    <div className="table-customer-cell">
                      <div className="cell-item-row">
                        <User size={14} className="cell-icon-slate" />
                        <span className="customer-name-bold">{order.name}</span>
                      </div>

                      <div className="cell-item-row">
                        <Phone size={14} className="cell-icon-slate" />
                        <span className="customer-phone-text">
                          {isPhoneRevealed ? order.phone : maskPhone(order.phone)}
                        </span>
                        <button
                          type="button"
                          className="icon-eye-toggle-btn"
                          onClick={() => togglePhone(order.id)}
                          title={isPhoneRevealed ? 'Ẩn số điện thoại' : 'Xem số điện thoại đầy đủ'}
                        >
                          {isPhoneRevealed ? <EyeOff size={11} /> : <Eye size={11} />}
                        </button>
                      </div>

                      <div className="cell-item-row-top">
                        <MapPin size={14} className="cell-icon-slate pin-icon" />
                        <div className="customer-address-lines">
                          <div className="address-street">{order.address}</div>
                          <div className="address-sub">
                            {order.region ? order.region.replace(/\s*·\s*/g, ', ') : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Cột 3: Thông Tin Đơn Hàng (Package, Scale - Đã bỏ ghi chú) */}
                  <td className="table-primary-cell">
                    <div className="table-order-info-cell">
                      <div className="cell-item-row">
                        <Package size={14} className="cell-icon-slate" />
                        <span className="product-name-bold">{order.product}</span>
                      </div>

                      <div className="cell-item-row">
                        <Scale size={14} className="cell-icon-slate" />
                        <span className="product-weight-text">
                          {order.weight > 0 ? `${order.weight} gr` : 'Chưa có khối lượng'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Cột 4: Thông Tin Vận Chuyển (Thống nhất: Step -> Step chỉ hiển thị logo) */}
                  <td className="col-shipping">
                    {(() => {
                      const stages = getShippingStages(shipping, isInternal);
                      const visualStages = stages.filter((stage) =>
                        hasCarrierIcon(stage.carrier, stage.isSuperShip),
                      );

                      if (order.serviceType === 'instant' && order.instantTracking && !isInternal) {
                        const tracking = order.instantTracking;
                        const etaText = formatInstantEta(tracking.etaMinutes);
                        const carrier =
                          order.selectedCarrier || shipping.deliveryCarrier || 'Nhà vận chuyển';
                        const tripCode =
                          shipping.deliveryTracking || shipping.pickupTracking || 'Chưa có mã đơn';
                        const isSearching = tracking.state === 'CREATED';
                        const isDriverNotFound = tracking.state === 'DRIVER_NOT_FOUND';
                        const isGoingToPickup =
                          tracking.state === 'DRIVER_ASSIGNED' ||
                          tracking.state === 'DRIVER_TO_PICKUP';
                        const isDelivered = tracking.state === 'DELIVERED';
                        const statusLabel = isDriverNotFound
                          ? 'Không tìm được tài xế'
                          : isSearching
                          ? 'Đang tìm tài xế'
                          : isGoingToPickup
                            ? 'Đang đến lấy'
                            : isDelivered
                              ? 'Đã giao'
                              : tracking.state === 'ARRIVING'
                                ? 'Sắp đến'
                                : 'Đang giao';
                        const instantStatusTone = isDelivered
                          ? 'status-tag-green'
                          : isDriverNotFound
                            ? 'status-tag-rose'
                            : isSearching || isGoingToPickup
                            ? 'status-tag-rose'
                            : 'status-tag-blue';
                        const isPickupCompleted =
                          tracking.state === 'PICKED_UP' ||
                          tracking.state === 'IN_DELIVERY' ||
                          tracking.state === 'ARRIVING' ||
                          isDelivered;
                        const isDeliveryActive =
                          tracking.state === 'PICKED_UP' ||
                          tracking.state === 'IN_DELIVERY' ||
                          tracking.state === 'ARRIVING';
                        const pickupLegStatus = isPickupCompleted
                          ? 'Đã lấy'
                          : isDriverNotFound
                            ? 'Không có tài xế'
                            : isSearching
                            ? 'Chờ tài xế'
                            : 'Đang đến lấy';
                        const deliveryLegStatus = isDelivered
                          ? 'Đã giao'
                          : isDeliveryActive
                            ? 'Đang giao'
                            : 'Chờ giao';
                        return (
                          <div className="table-shipping-info-cell step-logo-flow-mode instant-order-shipping-stack">
                            <div className="step-logo-track" aria-label="Chặng lấy và giao">
                              <div className="step-node-item">
                                <span
                                  className={`step-logo-circle ${isPickupCompleted ? 'completed' : 'active active-pulse'}`}
                                  title={`Lấy · ${carrier} · ${pickupLegStatus}`}
                                >
                                  {renderCarrierLogo(carrier)}
                                </span>
                                <div
                                  className={`step-arrow-connector ${isPickupCompleted ? 'done' : 'active'}`}
                                >
                                  <span className="step-arrow-line" />
                                  <svg
                                    className="step-arrowhead"
                                    width="5"
                                    height="7"
                                    viewBox="0 0 5 7"
                                    aria-hidden="true"
                                  >
                                    <path
                                      d="M1 1L4 3.5L1 6"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="1.4"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <div className="step-node-item">
                                <span
                                  className={`step-logo-circle ${isDelivered ? 'completed' : isDeliveryActive ? 'active active-pulse' : 'pending'}`}
                                  title={`Giao · ${carrier} · ${deliveryLegStatus}`}
                                >
                                  {renderCarrierLogo(carrier)}
                                </span>
                              </div>
                            </div>

                            <div
                              className="shipping-tracking-list"
                              aria-label="Mã đơn nhà vận chuyển"
                            >
                              <button
                                type="button"
                                className="shipping-tracking-row tracking-delivery"
                                onClick={(event) =>
                                  handleCopyTracking(tripCode, `Mã đơn - ${carrier}`, event)
                                }
                                title={`${carrier}: ${tripCode}\nNhấp để sao chép`}
                              >
                                <span>Mã đơn:</span>
                                <code>{tripCode}</code>
                              </button>
                            </div>

                            <div className="instant-order-delivery-unit">
                              <div className="shipping-status-container">
                                <div
                                  className={`shipping-current-status-badge ${instantStatusTone}`}
                                >
                                  <Zap size={12} className="status-badge-icon" />
                                  <span>{statusLabel}</span>
                                </div>
                              </div>
                              <span className="instant-order-driver-copy">
                                {isSearching
                                  ? 'Chưa phân tài xế'
                                  : isDelivered
                                    ? `${order.shipperDeliveryName || 'Tài xế'} · Hoàn tất ${formatCarrierUpdatedAt(tracking.updatedAt)}`
                                    : etaText
                                      ? `${order.shipperDeliveryName || 'Đã phân tài xế'} · ETA ${etaText}`
                                      : order.shipperDeliveryName || 'Đã phân tài xế'}
                              </span>
                            </div>
                          </div>
                        );
                      }

                      if (!visualStages.length) {
                        const plannedCarrier =
                          order.selectedCarrier ||
                          shipping.deliveryCarrier ||
                          shipping.pickupCarrier ||
                          'Chưa xác định NVC';
                        return (
                          <div className="carrier-planning-card">
                            <span className="carrier-planning-logo">
                              {renderCarrierLogo(plannedCarrier)}
                            </span>
                            <span className="carrier-planning-copy">
                              <strong>{plannedCarrier}</strong>
                              <small>Chưa được cấp mã vận đơn</small>
                            </span>
                            <span className="carrier-planning-status">
                              {renderCarrierStatusBadge(
                                shipping.carrierStatusText || order.status,
                              )}
                            </span>
                          </div>
                        );
                      }

                      if (isInternal) {
                        return (
                          <div
                            className="internal-carrier-stage-list"
                            onClick={() => setJourneyModalOrder(order)}
                            title="Mở chi tiết quan hệ chặng và nhà vận chuyển"
                          >
                            {visualStages.map((stage) => {
                              const carrierStatus = carrierStageStatus(order, stage);
                              const tone = carrierStageTone(stage, carrierStatus);
                              return (
                                <button
                                  type="button"
                                  className={`internal-carrier-stage-row ${tone}`}
                                  key={stage.key}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setJourneyModalOrder(order);
                                  }}
                                >
                                  <span className="internal-stage-kind">{stage.title}</span>
                                  <span className="internal-stage-carrier-logo">
                                    {renderCarrierLogo(stage.carrier, stage.isSuperShip)}
                                  </span>
                                  <span className="internal-stage-carrier-copy">
                                    <strong>{stage.carrier}</strong>
                                    <code>{stage.tracking || 'Chưa có mã vận đơn'}</code>
                                    <small>{carrierStatus}</small>
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        );
                      }

                      return (
                        <div className="table-shipping-info-cell step-logo-flow-mode">
                          <div className="step-logo-track" aria-label="Luồng nhà vận chuyển">
                            {visualStages.map((stage, index) => {
                              const isLast = index === visualStages.length - 1;
                              const isDone = stage.status === 'completed';
                              const isActive = stage.status === 'active';
                              const isNextPending =
                                !isLast && visualStages[index + 1]?.status === 'pending';
                              return (
                                <div
                                  key={stage.key}
                                  className="step-node-item"
                                >
                                  <div
                                    className={`step-logo-circle ${stage.status || 'pending'} ${
                                      isActive ? 'active-pulse' : ''
                                    }`}
                                    onClick={(event) =>
                                      handleCopyTracking(
                                        stage.tracking,
                                        `${stage.title} - ${stage.carrier}`,
                                        event,
                                      )
                                    }
                                    title={`${stage.title}: ${stage.carrier} (${stage.tracking})\nNhấp để sao chép mã vận đơn`}
                                  >
                                    {renderCarrierLogo(stage.carrier, stage.isSuperShip)}
                                  </div>

                                  {!isLast && (
                                    <span
                                      className={`step-arrow-connector ${
                                        isDone
                                          ? 'done'
                                          : isActive
                                            ? 'active'
                                            : isNextPending
                                              ? 'pending'
                                              : ''
                                      }`}
                                      aria-hidden="true"
                                    >
                                      <span className="step-arrow-line" />
                                      <svg
                                        className="step-arrowhead"
                                        width="5"
                                        height="7"
                                        viewBox="0 0 5 7"
                                      >
                                        <path
                                          d="M1 1L4 3.5L1 6"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="1.4"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          <div className="shipping-tracking-list" aria-label="Mã vận đơn">
                            {getTrackingSlots(stages).map(({ key, label, stage }) => (
                              <button
                                type="button"
                                key={key}
                                className={`shipping-tracking-row tracking-${key}`}
                                onClick={(event) =>
                                  handleCopyTracking(
                                    stage!.tracking,
                                    `${label} - ${stage!.carrier}`,
                                    event,
                                  )
                                }
                                title={`${label} · ${stage!.carrier}: ${stage!.tracking}\nNhấp để sao chép`}
                              >
                                <span>{label}:</span>
                                <code>{stage!.tracking}</code>
                              </button>
                            ))}
                          </div>

                          {/* Pill Badge trạng thái */}
                          <div
                            className="shipping-status-container clickable"
                            onClick={() => setJourneyModalOrder(order)}
                            title="Nhấp để xem chi tiết toàn bộ hành trình"
                          >
                            {renderCarrierStatusBadge(
                              shipping.carrierStatusText || order.status,
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </td>

                  {/* Cột 5: Tiền Thu Khách */}
                  <td
                    className="red customer-collection-column"
                    style={{ fontWeight: 700, fontSize: 13.5, paddingTop: 16 }}
                  >
                    {money(order.cod)}
                  </td>

                  {/* Cột 6: Trị Giá Hàng */}
                  <td
                    className="green order-value-column"
                    style={{ fontWeight: 700, fontSize: 13.5, paddingTop: 16 }}
                  >
                    {money(order.value)}
                  </td>

                  {/* Cột 7: Trạng Thái Đơn Hàng */}
                  <td className="order-status-column" style={{ paddingTop: 14 }}>
                    <div className="order-status-stack">
                      <span className={`status status-${getSpfStatusTone(order.spfCode)}`}>
                        {order.status}
                      </span>
                    </div>
                  </td>

                  {/* Cột 8: Tác Vụ */}
                  <td className="order-actions-column">
                    <div className="row-actions">
                      {rowActions.map(({ key, title, Icon }) => {
                        if (isInternal && key === 'support' && !order.supportStatus) return null;
                        const capability = ACTION_CAPABILITY[key];
                        const decision = capability
                          ? getOrderPermission(
                              isInternal
                                ? { kind: 'internal' }
                                : { kind: 'shop', shopId: order.shopId || 'S275518' },
                              order,
                              capability,
                            )
                          : { allowed: true, mode: 'direct' as const, reason: undefined };
                        if (!decision.allowed) return null;
                        const actionTitle =
                          decision.mode === 'request_support' && key === 'edit'
                            ? 'Yêu cầu hỗ trợ sửa đơn'
                            : decision.mode === 'request_support' && key === 'cancel'
                              ? 'Yêu cầu hỗ trợ hủy đơn'
                              : title;
                        return (
                          <button
                            key={key}
                            type="button"
                            className="action-btn-circle"
                            title={actionTitle}
                            aria-label={actionTitle}
                            onClick={() => onAction(key, order)}
                          >
                            <Icon size={13} />
                          </button>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!orders.length && <div className="empty">Không tìm thấy đơn hàng phù hợp</div>}
      </div>
      <div className="pagination">
        <span>
          Đang hiển thị {rangeStart} - {rangeEnd} của {totalCount} tổng cộng
        </span>
        <div className="pagination-controls">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Trước
          </button>
          <span>
            Trang {currentPage}/{totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Sau
          </button>
        </div>
      </div>

      {/* Modal Chi tiết toàn bộ hành trình (Phương án B) */}
      {journeyModalOrder && (
        <Modal
          title={`${isInternal ? 'Quan hệ chặng & nhà vận chuyển' : 'Hành trình vận chuyển'} · Đơn #${journeyModalOrder.id}`}
          onClose={() => setJourneyModalOrder(null)}
          wide
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Button
                variant="secondary"
                onClick={() => {
                  const stages = getShippingStages(journeyModalOrder.shippingInfo, isInternal);
                  const text = stages
                    .map((s) => `${s.title}: ${s.carrier} - ${s.tracking}`)
                    .join('\n');
                  navigator.clipboard.writeText(text);
                  notify('Đã sao chép toàn bộ thông tin mã vận đơn các chặng!');
                }}
              >
                <Copy size={14} style={{ marginRight: 6 }} /> Sao chép tất cả mã chặng
              </Button>
              <Button variant="primary" onClick={() => setJourneyModalOrder(null)}>
                Đóng
              </Button>
            </div>
          }
        >
          <div className="shipping-journey-modal-body">
            {/* Tóm tắt đơn hàng */}
            <div className="journey-order-summary">
              <div className="summary-item">
                <span className="summary-label">Khách hàng:</span>
                <strong>{journeyModalOrder.name}</strong> ({journeyModalOrder.phone})
              </div>
              <div className="summary-item">
                <span className="summary-label">Sản phẩm:</span>
                <span>{journeyModalOrder.product}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Trạng thái Order:</span>
                <span className="summary-status-tag">
                  {journeyModalOrder.status}
                </span>
              </div>
            </div>

            {/* Stepper trực quan: Lấy -> Giao -> Hoàn -> Trả cuối */}
            <div className="journey-modal-stepper">
              {getShippingStages(journeyModalOrder.shippingInfo, isInternal)
                .filter((stage) => hasCarrierIcon(stage.carrier, stage.isSuperShip))
                .map((stage, idx, arr) => (
                  <div key={stage.key} className={`journey-modal-step-col ${stage.status}`}>
                    <div className="modal-step-node-wrap">
                      {idx > 0 && (
                        <div
                          className={`modal-step-line line-left ${
                            stage.status === 'completed' || stage.status === 'active' ? 'done' : ''
                          } ${stage.status === 'pending' ? 'dashed' : ''}`}
                        />
                      )}
                      <div
                        className={`modal-step-circle ${stage.status === 'active' ? 'stage-active' : ''}`}
                      >
                        {renderCarrierLogo(stage.carrier, stage.isSuperShip)}
                      </div>
                      {idx < arr.length - 1 && (
                        <div
                          className={`modal-step-line line-right ${
                            stage.status === 'completed' ? 'done' : ''
                          }`}
                        />
                      )}
                    </div>
                    <div className="modal-step-title">{stage.title}</div>
                    <div className="modal-step-carrier">{stage.carrier}</div>
                  </div>
                ))}
            </div>

            {/* Danh sách thẻ chi tiết từng chặng */}
            <div className="journey-stages-detail-list">
              {getShippingStages(journeyModalOrder.shippingInfo, isInternal)
                .filter((stage) => hasCarrierIcon(stage.carrier, stage.isSuperShip))
                .map((stage, idx) => (
                  <div key={stage.key} className={`journey-card-item ${stage.status}`}>
                    <div className="journey-card-header">
                      <div className="card-header-left">
                        <span className="stage-num-badge">Chặng {idx + 1}</span>
                        <span className="stage-main-title">{stage.title}</span>
                      </div>
                      <span className={`stage-status-chip ${stage.status}`}>
                        {carrierStageStatus(journeyModalOrder, stage)}
                      </span>
                    </div>

                    <div className="journey-card-body">
                      <div className="card-info-row">
                        <span className="info-label">Đơn vị vận chuyển:</span>
                        <span className="info-value modal-carrier-value-with-logo">
                          <span className="modal-carrier-mini-logo">
                            {renderCarrierLogo(stage.carrier, stage.isSuperShip)}
                          </span>
                          <strong>{stage.carrier}</strong>{' '}
                          {stage.isSuperShip && '(Đơn vị chủ quản)'}
                        </span>
                      </div>

                      <div className="card-info-row">
                        <span className="info-label">Mã chặng:</span>
                        <span className="info-value">
                          <code>{stage.stageCode || 'Chưa có mã chặng'}</code>
                        </span>
                      </div>

                      <div className="card-info-row">
                        <span className="info-label">Mã vận đơn:</span>
                        <div className="waybill-code-row">
                          <code className="waybill-code">
                            {stage.tracking || 'NVC chưa cấp mã vận đơn'}
                          </code>
                          {stage.tracking && (
                            <button
                              type="button"
                              className="btn-modal-copy"
                              onClick={(e) => handleCopyTracking(stage.tracking, stage.title, e)}
                              title="Sao chép mã vận đơn này"
                            >
                              <Copy size={12} />
                              <span>Sao chép</span>
                            </button>
                          )}
                        </div>
                      </div>
                      {isInternal && (
                        <div className="card-info-row">
                          <span className="info-label">Trạng thái NVC:</span>
                          <span className="info-value">
                            <strong>{carrierStageStatus(journeyModalOrder, stage)}</strong>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
