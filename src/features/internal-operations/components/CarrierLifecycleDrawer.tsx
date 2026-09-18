import { useState, useMemo } from 'react';
import {
  X,
  Copy,
  Check,
  Package,
  Route,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Send,
  Truck,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowUpDown,
} from 'lucide-react';
import type { Order, ShippingStageItem, CarrierWebhookEvent } from '@/features/orders';
import { isSpfFailureStatus } from '@/features/orders';
import { getCarrierFacilityCode } from '@/shared/lib/carriers';
import { useToast } from '@/shared/ui/toast-context';

interface CarrierLifecycleMilestone {
  id: string;
  stepNumber: number;
  time: string;
  title: string;
  carrier: string;
  carrierStatus: string;
  carrierStatusCode: string;
  spfStatus: string;
  spfCode: string;
  location: string;
  actor: string;
  note?: string;
  requestId?: string;
  statusType: 'created' | 'gateway' | 'pickup' | 'transit' | 'delivery' | 'success' | 'warn' | 'return';
  payload?: string;
}

function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return '14/09/2026 - 11:21';
  if (dateStr.includes(' - ') || dateStr.includes(' • ')) return dateStr;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  } catch {
    return dateStr;
  }
}

function renderCarrierLogo(carrier: string) {
  const name = (carrier || '').toLowerCase();
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
  if (name.includes('best')) {
    return (
      <div className="carrier-brand-logo best" title="BEST Express">
        <img src="/carriers/BEST.jpg" alt="BEST Express" className="carrier-brand-img" />
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
    <div className="carrier-brand-logo fallback" title={carrier}>
      <Truck size={14} />
    </div>
  );
}

function buildOrderCarrierTimeline(
  order: Order,
  stage: ShippingStageItem,
): CarrierLifecycleMilestone[] {
  const carrier = stage.carrier || 'SuperShip';
  const waybill = stage.tracking || 'CHƯA_CẤP_MÃ';
  const carrierFacilityCode = getCarrierFacilityCode(carrier);
  const createdAt = order.createdAt;
  const baseDate = new Date(createdAt);
  const isValidDate = !isNaN(baseDate.getTime());

  const addMinutes = (mins: number) => {
    if (!isValidDate) return createdAt;
    return new Date(baseDate.getTime() + mins * 60_000).toISOString();
  };

  const isReturn =
    order.spfCode === 'SPF-1009' ||
    order.spfCode === 'SPF-1002' ||
    order.spfCode === 'SPF-1102' ||
    stage.key === 'return';

  const isDelivered = order.spfCode === 'SPF-0901';
  const isFailed = isSpfFailureStatus(order.spfCode) || order.spfCode === 'SPF-0802';
  const isDeliveryPhase =
    order.spfCode === 'SPF-0801' || isDelivered || isFailed || stage.key === 'delivery';

  const milestones: CarrierLifecycleMilestone[] = [];

  // Mốc 1: Khởi tạo mã đơn hàng trên SuperPlatform
  milestones.push({
    id: `milestone-${order.id}-1`,
    stepNumber: 1,
    time: formatDisplayDate(createdAt),
    title: 'Khởi tạo mã đơn hàng trên SuperPlatform',
    carrier: 'SuperPlatform',
    carrierStatus: 'Khởi tạo đơn hàng',
    carrierStatusCode: 'WAYBILL_REQUESTED',
    spfStatus: 'Chờ tiếp nhận / Chưa lấy hàng',
    spfCode: 'SPF-0101',
    location: `Cửa hàng ${order.shopName || 'Shop'}`,
    actor: order.shopName || 'Cửa hàng',
    note: `Đơn hàng được khởi tạo thành công trên hệ thống. SuperPlatform cấp mã vận đơn ${waybill} cho nhà vận chuyển ${carrier}.`,
    requestId: `SPF-INIT-${order.id.slice(-6)}`,
    statusType: 'created',
    payload: JSON.stringify(
      {
        action: 'ORDER_CREATED',
        order_id: order.id,
        tracking_code: waybill,
        carrier,
        weight_gram: order.weight,
        cod_amount: order.cod,
        recipient_name: order.name,
      },
      null,
      2,
    ),
  });

  // Mốc 2: SuperPlatform đồng bộ sang Gateway NVC
  milestones.push({
    id: `milestone-${order.id}-2`,
    stepNumber: 2,
    time: formatDisplayDate(addMinutes(4)),
    title: `SuperPlatform đẩy dữ liệu sang Gateway ${carrier}`,
    carrier,
    carrierStatus: 'Tiếp nhận thông tin điện tử',
    carrierStatusCode: 'ACCEPTED',
    spfStatus: 'Chờ lấy hàng',
    spfCode: 'SPF-0301',
    location: `Cổng kết nối Gateway ${carrier}`,
    actor: 'SuperPlatform Sync Engine',
    note: `Gói tin tạo đơn đã đồng bộ thành công sang API của ${carrier}. Nhà vận chuyển xác nhận tiếp nhận thông tin điện tử và đưa vào hàng đợi lấy hàng.`,
    requestId: `EDI-SYNC-${order.id.slice(-6)}-01`,
    statusType: 'gateway',
    payload: JSON.stringify(
      {
        gateway_carrier: carrier,
        http_status: 200,
        carrier_tracking: waybill,
        status: 'ORDER_PUSHED_ACCEPTED',
      },
      null,
      2,
    ),
  });

  // Mốc 3: NVC phân bổ tài xế & Shipper đến lấy
  milestones.push({
    id: `milestone-${order.id}-3`,
    stepNumber: 3,
    time: formatDisplayDate(addMinutes(25)),
    title: `${carrier}: Điều phối shipper lấy hàng`,
    carrier,
    carrierStatus: 'Đang đi lấy hàng',
    carrierStatusCode: 'PICKING',
    spfStatus: 'Đang lấy hàng',
    spfCode: 'SPF-0401',
    location: carrierFacilityCode || `Bưu cục điều phối ${carrier}`,
    actor: `Shipper ${carrier}`,
    note: 'Tài xế đã nhận nhiệm vụ thu gom kiện hàng tại địa chỉ của Shop.',
    requestId: `PICK-REQ-${order.id.slice(-6)}`,
    statusType: 'pickup',
  });

  // Mốc 4: Shipper lấy hàng thành công
  milestones.push({
    id: `milestone-${order.id}-4`,
    stepNumber: 4,
    time: formatDisplayDate(order.pickupAt || addMinutes(55)),
    title: `${carrier}: Shipper lấy hàng thành công tại Shop`,
    carrier,
    carrierStatus: 'Lấy hàng thành công',
    carrierStatusCode: 'PICKED_SUCCESS',
    spfStatus: 'Đã lấy hàng',
    spfCode: 'SPF-0501',
    location: order.senderAddress || order.address || 'Địa chỉ kho Shop',
    actor: `Shipper ${carrier}`,
    note: `Tài xế đã nhận kiện hàng vật lý từ người gửi. Quét mã vạch ${waybill} thành công.`,
    requestId: `SCAN-PICK-${order.id.slice(-6)}`,
    statusType: 'pickup',
    payload: JSON.stringify(
      {
        tracking_code: waybill,
        action: 'PICKUP_SUCCESS',
        actual_weight: order.weight,
      },
      null,
      2,
    ),
  });

  // Mốc 5: Nhập kho bưu cục nguồn
  milestones.push({
    id: `milestone-${order.id}-5`,
    stepNumber: 5,
    time: formatDisplayDate(addMinutes(90)),
    title: `Nhập kho bưu cục nguồn (${carrier})`,
    carrier,
    carrierStatus: 'Đã nhập kho bưu cục lấy',
    carrierStatusCode: 'IN_ORIGIN_HUB',
    spfStatus: 'Đã nhập kho/bưu cục lấy',
    spfCode: 'SPF-0502',
    location: carrierFacilityCode || `Bưu cục nguồn ${carrier}`,
    actor: 'Nhân viên khai thác bưu cục',
    note: `Kiện hàng được cân đo đối chiếu: ${order.weight} gr. Đóng gói niêm phong chuẩn bị luân chuyển.`,
    requestId: `HUB-IN-${order.id.slice(-6)}`,
    statusType: 'transit',
  });

  // Nếu đơn đã qua mốc trung chuyển
  if (isDeliveryPhase || isReturn) {
    // Mốc 6: Trung chuyển chia chọn liên tỉnh
    milestones.push({
      id: `milestone-${order.id}-6`,
      stepNumber: 6,
      time: formatDisplayDate(addMinutes(180)),
      title: `Nhập trung tâm khai thác chia chọn (${carrier})`,
      carrier,
      carrierStatus: 'Nhập trung tâm khai thác',
      carrierStatusCode: 'SORTING_HUB_ARRIVED',
      spfStatus: 'Đang trung chuyển',
      spfCode: 'SPF-0701',
      location: carrierFacilityCode || `Trung tâm chia chọn liên tỉnh ${carrier}`,
      actor: 'Hệ thống phân loại tự động',
      note: 'Quét mã chia chọn tự động lên băng tải luồng phát hàng liên tỉnh.',
      requestId: `SORT-SCAN-${order.id.slice(-6)}`,
      statusType: 'transit',
    });

    // Mốc 7: Bưu cục phát nhận kiện
    milestones.push({
      id: `milestone-${order.id}-7`,
      stepNumber: 7,
      time: formatDisplayDate(addMinutes(450)),
      title: `Nhận hàng vào bưu cục phát (${carrier})`,
      carrier,
      carrierStatus: 'Nhập bưu cục phát',
      carrierStatusCode: 'DESTINATION_HUB_ARRIVED',
      spfStatus: 'Đã đến bưu cục giao',
      spfCode: 'SPF-0702',
      location: `Bưu cục phát ${order.region || 'Điểm giao'}`,
      actor: 'Điều phối viên giao hàng',
      note: 'Kiện hàng đã hạ tải tại bưu cục phát và được chia về tuyến giao cho shipper phụ trách.',
      requestId: `DEST-HUB-${order.id.slice(-6)}`,
      statusType: 'delivery',
    });

    // Mốc 8: Xuất kho đi giao
    milestones.push({
      id: `milestone-${order.id}-8`,
      stepNumber: 8,
      time: formatDisplayDate(addMinutes(520)),
      title: `${carrier}: Xuất hàng để đi giao`,
      carrier,
      carrierStatus: 'Đang đi giao hàng',
      carrierStatusCode: 'OUT_FOR_DELIVERY',
      spfStatus: 'Đang giao hàng',
      spfCode: 'SPF-0801',
      location: `Khu vực ${order.address}`,
      actor: order.shipperDeliveryName || `Shipper ${carrier}`,
      note: `Shipper xuất kho mang kiện hàng đi giao tới người nhận ${order.name}.`,
      requestId: `OUT-DEL-${order.id.slice(-6)}`,
      statusType: 'delivery',
      payload: JSON.stringify(
        {
          tracking_code: waybill,
          shipper_name: order.shipperDeliveryName || 'Nhân viên giao hàng',
          status: 'DELIVERING',
        },
        null,
        2,
      ),
    });
  }

  // Mốc Kết quả giao / Chuyển hoàn theo trạng thái đơn hàng hiện tại
  if (isDelivered) {
    milestones.push({
      id: `milestone-${order.id}-9`,
      stepNumber: milestones.length + 1,
      time: formatDisplayDate(order.deliveryAt || order.updatedAt || addMinutes(610)),
      title: `${carrier}: Giao hàng thành công`,
      carrier,
      carrierStatus: 'Giao hàng thành công',
      carrierStatusCode: 'DELIVERED_SUCCESS',
      spfStatus: 'Đã giao hàng',
      spfCode: 'SPF-0901',
      location: `${order.address}, ${order.region}`,
      actor: order.shipperDeliveryName || `Shipper ${carrier}`,
      note: `Người nhận ${order.name} đã nhận kiện và thanh toán tiền thu hộ COD.`,
      requestId: `DEL-DONE-${order.id.slice(-6)}`,
      statusType: 'success',
      payload: JSON.stringify(
        {
          tracking_code: waybill,
          status: 'DELIVERED',
          delivery_result: 'FULL',
          cod_collected: order.cod,
        },
        null,
        2,
      ),
    });
  } else if (isReturn) {
    milestones.push({
      id: `milestone-${order.id}-fail`,
      stepNumber: milestones.length + 1,
      time: formatDisplayDate(addMinutes(600)),
      title: `${carrier}: Giao hàng không thành công (Khách hẹn lại)`,
      carrier,
      carrierStatus: 'Giao hàng thất bại',
      carrierStatusCode: 'DELIVERY_FAILED',
      spfStatus: 'Giao hàng thất bại',
      spfCode: 'SPF-0802',
      location: `${order.address}`,
      actor: `Shipper ${carrier}`,
      note: 'Người nhận từ chối nhận hàng hoặc không nghe máy. NVC lập biên bản giao không thành công.',
      requestId: `FAIL-LOG-${order.id.slice(-6)}`,
      statusType: 'warn',
    });

    milestones.push({
      id: `milestone-${order.id}-ret-appr`,
      stepNumber: milestones.length + 1,
      time: formatDisplayDate(order.returnConfirmedAt || addMinutes(640)),
      title: 'Shop & SuperPlatform: Xác nhận chuyển hoàn',
      carrier: 'SuperPlatform',
      carrierStatus: 'Xác nhận chuyển hoàn',
      carrierStatusCode: 'RETURN_CONFIRMED',
      spfStatus: 'Đã xác nhận chuyển hoàn',
      spfCode: 'SPF-1002',
      location: 'Hệ thống đối soát SuperPlatform',
      actor: 'Shop & CSKH',
      note: 'Shop đồng ý cho chuyển hoàn về địa chỉ gửi ban đầu. Kích hoạt quy trình hoàn kiện.',
      requestId: `RET-CONFIRM-${order.id.slice(-6)}`,
      statusType: 'return',
    });

    milestones.push({
      id: `milestone-${order.id}-ret-in`,
      stepNumber: milestones.length + 1,
      time: formatDisplayDate(order.updatedAt || addMinutes(720)),
      title: `${carrier}: Đang vận chuyển hoàn về kho nguồn`,
      carrier,
      carrierStatus: stage.carrierStatusText || 'Đang chuyển hoàn',
      carrierStatusCode: stage.carrierStatusCode || 'RETURN_IN_TRANSIT',
      spfStatus: order.status,
      spfCode: order.spfCode,
      location: 'Trung tâm khai thác luân chuyển hoàn',
      actor: `Đội vận chuyển ${carrier}`,
      note: 'Kiện hàng đang trên xe luân chuyển hoàn trả lại cho bưu cục lấy ban đầu.',
      requestId: `RET-TRANSIT-${order.id.slice(-6)}`,
      statusType: 'return',
      payload: JSON.stringify(
        {
          tracking_code: waybill,
          status: 'RETURNING',
          reason: order.returnReason || 'Khách từ chối nhận hàng',
        },
        null,
        2,
      ),
    });
  } else if (isFailed) {
    milestones.push({
      id: `milestone-${order.id}-fail-final`,
      stepNumber: milestones.length + 1,
      time: formatDisplayDate(order.updatedAt || addMinutes(610)),
      title: `${carrier}: ${stage.carrierStatusText || 'Giao hàng không thành công'}`,
      carrier,
      carrierStatus: stage.carrierStatusText || 'Giao hàng thất bại',
      carrierStatusCode: stage.carrierStatusCode || 'DELIVERY_FAILED',
      spfStatus: order.status,
      spfCode: order.spfCode,
      location: `${order.address}`,
      actor: `Shipper ${carrier}`,
      note: order.incidentType || 'Kiện hàng giao không thành công, đang chờ điều phối giao lại.',
      requestId: `INCIDENT-${order.id.slice(-6)}`,
      statusType: 'warn',
    });
  }

  // Nếu stage có webhook events gốc, bổ sung các event chưa có
  if (stage.webhookEvents?.length) {
    stage.webhookEvents.forEach((ev: CarrierWebhookEvent, idx: number) => {
      const exists = milestones.find((m) => m.carrierStatusCode === ev.statusCode);
      if (!exists) {
        milestones.push({
          id: `webhook-${ev.id || idx}`,
          stepNumber: milestones.length + 1,
          time: formatDisplayDate(ev.eventAt || ev.receivedAt),
          title: `${carrier}: ${ev.statusText}`,
          carrier,
          carrierStatus: ev.statusText,
          carrierStatusCode: ev.statusCode,
          spfStatus: ev.mappedSpfStatus,
          spfCode: ev.mappedSpfCode,
          location: ev.location || carrierFacilityCode || `Bưu cục khai thác ${carrier}`,
          actor: `${carrier} Webhook Event`,
          note: ev.note || `Bản tin webhook từ NVC cập nhật lúc ${formatDisplayDate(ev.eventAt)}.`,
          requestId: ev.requestId,
          statusType: ev.processingStatus === 'failed' ? 'warn' : 'transit',
          payload: ev.payload,
        });
      }
    });
  }

  return milestones;
}

interface CarrierLifecycleDrawerProps {
  order: Order;
  stage: ShippingStageItem;
  onClose: () => void;
  onNavigateOrder?: (orderId: string) => void;
}

export function CarrierLifecycleDrawer({
  order,
  stage,
  onClose,
  onNavigateOrder,
}: CarrierLifecycleDrawerProps) {
  const notify = useToast();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedPayloads, setExpandedPayloads] = useState<Record<string, boolean>>({});
  const [isNewestFirst, setIsNewestFirst] = useState(false);

  const rawMilestones = useMemo(
    () => buildOrderCarrierTimeline(order, stage),
    [order, stage],
  );

  const milestones = useMemo(() => {
    if (isNewestFirst) {
      return [...rawMilestones].reverse();
    }
    return rawMilestones;
  }, [rawMilestones, isNewestFirst]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    notify(`Đã sao chép ${label}: ${text}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const togglePayload = (id: string) => {
    setExpandedPayloads((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div
        className="drawer-container carrier-lifecycle-drawer"
        style={{ width: 640, maxWidth: '95vw' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="drawer-header carrier-drawer-header">
          <div className="drawer-title-row">
            <div className="carrier-drawer-icon-box">
              <Route size={18} />
            </div>
            <div>
              <h3>Hành trình NVC & Trạng thái đơn hàng</h3>
              <div className="carrier-drawer-sub">
                Mã đơn: <strong>{order.id}</strong>
                <button
                  type="button"
                  className="carrier-drawer-copy-btn"
                  onClick={() => handleCopy(order.id, 'mã đơn hàng')}
                  title="Sao chép mã đơn hàng"
                >
                  {copiedKey === order.id ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                </button>
              </div>
            </div>
          </div>
          <button type="button" className="btn-close-drawer" onClick={onClose} title="Đóng">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body carrier-drawer-body">
          {/* Card thông tin tóm tắt */}
          <div className="carrier-overview-card">
            <div className="carrier-overview-row">
              <div className="carrier-overview-col">
                <span className="overview-label">Cửa hàng</span>
                <strong>{order.shopName || 'Shop Gia Dụng Việt'}</strong>
                <small>Ngày tạo: {formatDisplayDate(order.createdAt)}</small>
              </div>
              <div className="carrier-overview-col">
                <span className="overview-label">Nhà vận chuyển & Chặng</span>
                <div className="carrier-lockup-inline">
                  {renderCarrierLogo(stage.carrier)}
                  <div>
                    <strong>{stage.carrier}</strong>
                    <span className="carrier-stage-tag">{stage.title}</span>
                  </div>
                </div>
              </div>
              <div className="carrier-overview-col">
                <span className="overview-label">Mã vận đơn NVC</span>
                <div className="waybill-copy-lockup">
                  <code>{stage.tracking}</code>
                  <button
                    type="button"
                    className="carrier-drawer-copy-btn"
                    onClick={() => handleCopy(stage.tracking, 'mã vận đơn')}
                    title="Sao chép mã vận đơn"
                  >
                    {copiedKey === stage.tracking ? (
                      <Check size={12} className="text-success" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Đối chiếu trạng thái song song */}
            <div className="carrier-status-comparison-box">
              <div className="carrier-status-side nvc">
                <span className="side-title">Trạng thái NVC ({stage.carrier})</span>
                <strong className="status-name-val">
                  {stage.carrierStatusText || rawMilestones[rawMilestones.length - 1]?.carrierStatus || 'Đang xử lý'}
                </strong>
                <div className="status-code-line">
                  Mã NVC: <code>{stage.carrierStatusCode || rawMilestones[rawMilestones.length - 1]?.carrierStatusCode || 'PROCESSING'}</code>
                </div>
                <small>Cập nhật: {formatDisplayDate(stage.carrierUpdatedAt || order.updatedAt || order.createdAt)}</small>
              </div>

              <div className="status-map-arrow">
                <ArrowRight size={16} />
              </div>

              <div className="carrier-status-side spf">
                <span className="side-title">Trạng thái SuperPlatform</span>
                <strong className="status-name-val">{order.status}</strong>
                <div className="status-code-line">
                  Mã SPF: <code>{order.spfCode}</code>
                </div>
                <small>Chuẩn hoá toàn hệ thống</small>
              </div>
            </div>
          </div>

          {/* Thanh công cụ timeline */}
          <div className="timeline-toolbar-row">
            <div className="timeline-count-badge">
              <Clock size={14} />
              <span>
                <strong>{rawMilestones.length}</strong> mốc trạng thái từ lúc tạo mã đơn hàng
              </span>
            </div>
            <div className="timeline-actions">
              <button
                type="button"
                className="timeline-sort-btn"
                onClick={() => setIsNewestFirst((prev) => !prev)}
                title="Đổi thứ tự hiển thị"
              >
                <ArrowUpDown size={13} />
                {isNewestFirst ? 'Mới nhất trước' : 'Từ lúc tạo đơn'}
              </button>
              {onNavigateOrder && (
                <button
                  type="button"
                  className="timeline-view-order-btn"
                  onClick={() => onNavigateOrder(order.id)}
                  title="Mở toàn màn hình chi tiết đơn hàng"
                >
                  <Package size={13} /> Xem đơn hàng <ExternalLink size={11} />
                </button>
              )}
            </div>
          </div>

          {/* Dòng thời gian chi tiết */}
          <div className="carrier-lifecycle-timeline">
            {milestones.map((milestone, idx) => {
              const isPayloadExpanded = Boolean(expandedPayloads[milestone.id]);
              const isLast = idx === milestones.length - 1;

              return (
                <div
                  key={milestone.id}
                  className={`carrier-milestone-item status-${milestone.statusType}`}
                >
                  {/* Cột rail & icon */}
                  <div className="milestone-rail" aria-hidden="true">
                    <div className={`milestone-marker ${milestone.statusType}`}>
                      {milestone.statusType === 'created' && <Package size={13} />}
                      {milestone.statusType === 'gateway' && <Send size={13} />}
                      {milestone.statusType === 'pickup' && <CheckCircle2 size={13} />}
                      {milestone.statusType === 'transit' && <Truck size={13} />}
                      {milestone.statusType === 'delivery' && <Route size={13} />}
                      {milestone.statusType === 'success' && <CheckCircle2 size={13} />}
                      {milestone.statusType === 'warn' && <AlertTriangle size={13} />}
                      {milestone.statusType === 'return' && <RotateCcw size={13} />}
                    </div>
                    {!isLast && <div className="milestone-line" />}
                  </div>

                  {/* Nội dung mốc */}
                  <div className="milestone-content-card">
                    <div className="milestone-header">
                      <div className="milestone-title-group">
                        <span className="milestone-step-num">Mốc #{milestone.stepNumber}</span>
                        <h4 className="milestone-title">{milestone.title}</h4>
                      </div>
                      <span className="milestone-time">{milestone.time}</span>
                    </div>

                    {/* Khối so sánh 2 chiều NVC vs SuperPlatform */}
                    <div className="milestone-mapping-grid">
                      <div className="mapping-item nvc">
                        <span className="mapping-label">{milestone.carrier}</span>
                        <strong className="mapping-text">{milestone.carrierStatus}</strong>
                        <code>{milestone.carrierStatusCode}</code>
                      </div>
                      <div className="mapping-divider">→</div>
                      <div className="mapping-item spf">
                        <span className="mapping-label">SuperPlatform</span>
                        <strong className="mapping-text">{milestone.spfStatus}</strong>
                        <code>{milestone.spfCode}</code>
                      </div>
                    </div>

                    {/* Thông tin phụ: vị trí, actor, note */}
                    <div className="milestone-meta-list">
                      {milestone.location && (
                        <div className="milestone-meta-row">
                          <MapPin size={12} className="meta-icon" />
                          <span>{milestone.location}</span>
                        </div>
                      )}
                      {milestone.note && (
                        <div className="milestone-note-box">
                          <span>{milestone.note}</span>
                        </div>
                      )}
                      <div className="milestone-footer-row">
                        {milestone.requestId && (
                          <span className="milestone-req-id">
                            Mã bản tin: <code>{milestone.requestId}</code>
                          </span>
                        )}
                        <span className="milestone-processed-tag">
                          <CheckCircle2 size={11} /> Đã xử lý (HTTP 200)
                        </span>
                      </div>
                    </div>

                    {/* Webhook JSON Payload nếu có */}
                    {milestone.payload && (
                      <div className="milestone-payload-section">
                        <button
                          type="button"
                          className="payload-toggle-btn"
                          onClick={() => togglePayload(milestone.id)}
                          aria-expanded={isPayloadExpanded}
                        >
                          <span>Xem gói tin Webhook JSON</span>
                          {isPayloadExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                        {isPayloadExpanded && (
                          <pre className="payload-json-code">
                            <code>{milestone.payload}</code>
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
