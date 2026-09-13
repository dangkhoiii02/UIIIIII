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
  FileText,
  Copy,
  Truck,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { money } from '@/shared/lib/format';
import { useToast } from '@/shared/ui/toast-context';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import type { Order, ShippingRoutingInfo, ShippingStageItem } from '../model/types';

export type OrderAction = 'detail' | 'support' | 'copy' | 'edit' | 'print' | 'cancel';

function renderCarrierStatusBadge(statusText: string) {
  const text = statusText.toLowerCase();
  let badgeClass = 'status-tag-blue';
  let Icon = Truck;

  if (text.includes('hoãn') || text.includes('hủy') || text.includes('lỗi') || text.includes('trả') || text.includes('hoàn')) {
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
      <span>{statusText}</span>
    </div>
  );
}

function renderCarrierLogo(carrier: string, isSuperShip?: boolean) {
  const name = (carrier || '').toLowerCase();

  if (isSuperShip || name.includes('super')) {
    return (
      <div className="carrier-brand-logo supership" title="SuperShip (Đơn vị chủ quản)">
        <img src="/carriers/supership_emblem.png" alt="SuperShip" className="carrier-brand-img" />
      </div>
    );
  }

  if (name.includes('ghn') || name.includes('nhanh')) {
    return (
      <div className="carrier-brand-logo ghn" title="Giao Hàng Nhanh (GHN)">
        <img src="/carriers/ghn_emblem.png" alt="GHN" className="carrier-brand-img" />
      </div>
    );
  }

  if (name.includes('ninja')) {
    return (
      <div className="carrier-brand-logo ninjavan" title="NinjaVan">
        <img src="/carriers/ninjavan_emblem.svg" alt="NinjaVan" className="carrier-brand-img" />
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
      <div className="carrier-brand-logo viettelpost" title="ViettelPost">
        <img src="/carriers/viettel_emblem.png" alt="ViettelPost" className="carrier-brand-img" />
      </div>
    );
  }

  return (
    <div className="carrier-brand-logo generic" title={carrier}>
      <span className="carrier-brand-initials">{carrier.slice(0, 3).toUpperCase()}</span>
    </div>
  );
}

function getShippingStages(shipping?: ShippingRoutingInfo): ShippingStageItem[] {
  if (!shipping) {
    return [
      { key: 'pickup', title: 'Lấy hàng', carrier: 'SuperShip', tracking: '9101156640004', isSuperShip: true, status: 'completed' },
      { key: 'delivery', title: 'Giao hàng', carrier: 'GHN', tracking: 'GY8C1303', isSuperShip: false, status: 'active' },
    ];
  }

  if (shipping.stages && shipping.stages.length > 0) {
    return shipping.stages;
  }

  if (shipping.returnCarrier || shipping.refundCarrier) {
    return [
      {
        key: 'pickup',
        title: 'Lấy hàng',
        carrier: shipping.pickupCarrier || 'SuperShip',
        tracking: shipping.pickupTracking || '9101156640004',
        isSuperShip: true,
        status: 'completed',
      },
      {
        key: 'delivery',
        title: 'Giao hàng',
        carrier: shipping.deliveryCarrier || 'GHN',
        tracking: shipping.deliveryTracking || 'GY8C1303',
        isSuperShip: false,
        status: 'completed',
      },
      {
        key: 'return',
        title: 'Hoàn hàng',
        carrier: shipping.returnCarrier || shipping.deliveryCarrier || 'GHN',
        tracking: shipping.returnTracking || 'RET88C1303',
        isSuperShip: false,
        status: shipping.currentStage === 'refund' || shipping.currentStage === 'completed' ? 'completed' : 'active',
      },
      {
        key: 'refund',
        title: 'Trả hàng',
        carrier: shipping.refundCarrier || 'SuperShip',
        tracking: shipping.refundTracking || '9101156640099',
        isSuperShip: true,
        status: shipping.currentStage === 'completed' ? 'completed' : shipping.currentStage === 'refund' ? 'active' : 'pending',
      },
    ];
  }

  return [
    {
      key: 'pickup',
      title: 'Lấy hàng',
      carrier: shipping.pickupCarrier || 'SuperShip',
      tracking: shipping.pickupTracking || '9101156640004',
      isSuperShip: true,
      status: shipping.currentStage === 'pickup' ? 'active' : 'completed',
    },
    {
      key: 'delivery',
      title: 'Giao hàng',
      carrier: shipping.deliveryCarrier || 'GHN',
      tracking: shipping.deliveryTracking || 'GY8C1303',
      isSuperShip: false,
      status: shipping.currentStage === 'pickup' ? 'pending' : shipping.currentStage === 'completed' ? 'completed' : 'active',
    },
  ];
}

const actions = [
  { key: 'detail', title: 'Chi tiết', Icon: Eye },
  { key: 'support', title: 'Gửi yêu cầu hỗ trợ', Icon: Send },
  { key: 'copy', title: 'Tạo lại', Icon: RotateCw },
  { key: 'edit', title: 'Sửa đơn', Icon: Pencil },
  { key: 'print', title: 'In đơn', Icon: Printer },
  { key: 'cancel', title: 'Hủy đơn', Icon: X },
] as const;

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
  selected,
  onSelect,
  onAction,
}: {
  orders: Order[];
  selected: string[];
  onSelect: (ids: string[]) => void;
  onAction: (action: OrderAction, order: Order) => void;
}) {
  const notify = useToast();
  const [visiblePhones, setVisiblePhones] = useState<Record<string, boolean>>({});
  const [journeyModalOrder, setJourneyModalOrder] = useState<Order | null>(null);

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
    <section className="card body order-results">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: 36, paddingLeft: 16 }}>
                <input
                  type="checkbox"
                  aria-label="Chọn tất cả"
                  checked={!!orders.length && orders.every((order) => selected.includes(order.id))}
                  onChange={(e) =>
                    onSelect(e.target.checked ? orders.map((order) => order.id) : [])
                  }
                />
              </th>
              <th style={{ minWidth: 150 }}>Mã Đơn Hàng</th>
              <th style={{ minWidth: 200 }}>Khách Hàng</th>
              <th style={{ minWidth: 200 }}>Thông Tin Đơn Hàng</th>
              <th style={{ minWidth: 220 }}>Thông Tin Vận Chuyển</th>
              <th style={{ minWidth: 120 }}>Tiền Thu Khách</th>
              <th style={{ minWidth: 120 }}>Trị Giá Hàng</th>
              <th style={{ minWidth: 130 }}>Trạng Thái Đơn Hàng</th>
              <th style={{ width: 90, textAlign: 'center' }}>Tác Vụ</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const shipping = order.shippingInfo || {
                pickupCarrier: 'SuperShip',
                pickupTracking: '9101156640004',
                deliveryCarrier: 'GHN',
                deliveryTracking: 'GY8C1303',
                carrierStatusText: 'GHN – Đang lấy hàng',
                currentStage: 'pickup',
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
                  <td>
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

                  {/* Cột 2: Khách Hàng (User, Phone, MapPin) */}
                  <td>
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
                          <div className="address-sub">{order.region}</div>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Cột 3: Thông Tin Đơn Hàng (Package, Scale, Note) */}
                  <td>
                    <div className="table-order-info-cell">
                      <div className="cell-item-row">
                        <Package size={14} className="cell-icon-slate" />
                        <span className="product-name-bold">{order.product}</span>
                      </div>

                      <div className="cell-item-row">
                        <Scale size={14} className="cell-icon-slate" />
                        <span className="product-weight-text">{order.weight} gr</span>
                      </div>

                      {order.note && (
                        <div className="cell-item-row-top">
                          <FileText size={14} className="cell-icon-slate note-icon" />
                          <div className="product-note-text">{order.note}</div>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Cột 4: Thông Tin Vận Chuyển (Thống nhất: Step -> Step chỉ hiển thị logo) */}
                  <td className="col-shipping">
                    {(() => {
                      const stages = getShippingStages(shipping);

                      return (
                        <div className="table-shipping-info-cell step-logo-flow-mode">
                          {/* Chuỗi Step -> Step logo */}
                          <div className="step-logo-track">
                            {stages.map((st, idx) => {
                              const isLast = idx === stages.length - 1;
                              const isDone = st.status === 'completed';
                              const isActive = st.status === 'active';
                              const isNextPending = !isLast && stages[idx + 1]?.status === 'pending';

                              return (
                                <div key={st.key} className="step-node-item">
                                  {/* Logo của chặng */}
                                  <div
                                    className={`step-logo-circle ${st.status || 'pending'} ${
                                      isActive ? 'active-pulse' : ''
                                    }`}
                                    onClick={(e) =>
                                      handleCopyTracking(st.tracking, `${st.title} - ${st.carrier}`, e)
                                    }
                                    title={`${st.title}: ${st.carrier} (${st.tracking})\nNhấp để sao chép mã vận đơn`}
                                  >
                                    {renderCarrierLogo(st.carrier, st.isSuperShip)}
                                  </div>

                                  {/* Mũi tên kết nối sang chặng tiếp theo: Step -> Step */}
                                  {!isLast && (
                                    <div
                                      className={`step-arrow-connector ${
                                        isDone ? 'done' : isActive ? 'active' : isNextPending ? 'pending' : ''
                                      }`}
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
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Pill Badge trạng thái */}
                          <div
                            className="shipping-status-container clickable"
                            onClick={() => setJourneyModalOrder(order)}
                            title="Nhấp để xem chi tiết toàn bộ hành trình"
                          >
                            {renderCarrierStatusBadge(
                              shipping.carrierStatusText ||
                                `${shipping.deliveryCarrier || 'GHN'} – Đang lấy hàng`
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </td>

                  {/* Cột 5: Tiền Thu Khách */}
                  <td className="red" style={{ fontWeight: 700, fontSize: 13.5, paddingTop: 16 }}>
                    {money(order.cod)}
                  </td>

                  {/* Cột 6: Trị Giá Hàng */}
                  <td className="green" style={{ fontWeight: 700, fontSize: 13.5, paddingTop: 16 }}>
                    {money(order.value)}
                  </td>

                  {/* Cột 7: Trạng Thái Đơn Hàng */}
                  <td style={{ paddingTop: 14 }}>
                    <span className="status">{order.status}</span>
                  </td>

                  {/* Cột 8: Tác Vụ */}
                  <td>
                    <div className="row-actions">
                      {actions.map(({ key, title, Icon }) => (
                        <button
                          key={key}
                          type="button"
                          className="action-btn-circle"
                          title={title}
                          aria-label={title}
                          onClick={() => onAction(key, order)}
                          disabled={key === 'cancel' && order.status === 'Đã hủy'}
                        >
                          <Icon size={15} />
                        </button>
                      ))}
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
          Đang hiển thị {orders.length ? '1 - ' + orders.length : '0'} của {orders.length} tổng cộng
        </span>
        <span>Trang 1</span>
      </div>

      {/* Modal Chi tiết toàn bộ hành trình (Phương án B) */}
      {journeyModalOrder && (
        <Modal
          title={`Hành trình vận chuyển đa chặng · Đơn #${journeyModalOrder.id}`}
          onClose={() => setJourneyModalOrder(null)}
          wide
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Button
                variant="secondary"
                onClick={() => {
                  const stages = getShippingStages(journeyModalOrder.shippingInfo);
                  const text = stages.map((s) => `${s.title}: ${s.carrier} - ${s.tracking}`).join('\n');
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
                <span className="summary-label">Trạng thái:</span>
                <span className="summary-status-tag">
                  {journeyModalOrder.shippingInfo?.carrierStatusText || journeyModalOrder.status}
                </span>
              </div>
            </div>

            {/* Stepper trực quan 4 bước */}
            <div className="journey-modal-stepper">
              {getShippingStages(journeyModalOrder.shippingInfo).map((stage, idx, arr) => (
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
              {getShippingStages(journeyModalOrder.shippingInfo).map((stage, idx) => (
                <div key={stage.key} className={`journey-card-item ${stage.status}`}>
                  <div className="journey-card-header">
                    <div className="card-header-left">
                      <span className="stage-num-badge">Chặng {idx + 1}</span>
                      <span className="stage-main-title">{stage.title}</span>
                    </div>
                    <span className={`stage-status-chip ${stage.status}`}>
                      {stage.status === 'completed'
                        ? '✓ Đã hoàn tất'
                        : stage.status === 'active'
                        ? '● Đang chuyển hoàn'
                        : '○ Chờ tiếp nhận'}
                    </span>
                  </div>

                  <div className="journey-card-body">
                    <div className="card-info-row">
                      <span className="info-label">Đơn vị vận chuyển:</span>
                      <span className="info-value modal-carrier-value-with-logo">
                        <span className="modal-carrier-mini-logo">{renderCarrierLogo(stage.carrier, stage.isSuperShip)}</span>
                        <strong>{stage.carrier}</strong> {stage.isSuperShip && '(Đơn vị chủ quản)'}
                      </span>
                    </div>

                    <div className="card-info-row">
                      <span className="info-label">Mã vận đơn:</span>
                      <div className="waybill-code-row">
                        <code className="waybill-code">{stage.tracking}</code>
                        <button
                          type="button"
                          className="btn-modal-copy"
                          onClick={(e) => handleCopyTracking(stage.tracking, stage.title, e)}
                          title="Sao chép mã vận đơn này"
                        >
                          <Copy size={12} />
                          <span>Sao chép</span>
                        </button>
                      </div>
                    </div>
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
