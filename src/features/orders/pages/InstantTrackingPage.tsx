import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bike,
  CheckCircle2,
  Clock3,
  LocateFixed,
  MapPin,
  Navigation,
  PackageCheck,
  Phone,
  Radio,
  RefreshCw,
  Route,
  ShieldCheck,
} from 'lucide-react';
import { useToast } from '@/shared/ui/toast-context';
import { useOrders } from '../model/orders-context';
import { formatInstantDistance, formatInstantEta } from '../model/instant-tracking';

function formatTime(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function carrierLogo(carrier: string) {
  const normalized = carrier.toLocaleLowerCase('vi');
  if (normalized.includes('green')) return '/carriers/xanhsm.jpg';
  if (normalized.includes('grab')) return '/carriers/grab.jpg';
  return '/carriers/supership.jpg';
}

export default function InstantTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const notify = useToast();
  const { orders } = useOrders();
  const order = orders.find((item) => item.id === id);
  const tracking = order?.instantTracking;
  const carrier = order?.selectedCarrier || order?.shippingInfo?.deliveryCarrier || 'Nhà vận chuyển';
  const events = useMemo(
    () =>
      [
        ...(order?.shippingInfo?.stages?.length
          ? order.shippingInfo.stages.flatMap((stage) => stage.webhookEvents || [])
          : order?.shippingInfo?.stages?.find((stage) => stage.key === 'delivery')?.webhookEvents || []),
      ].sort((a, b) => new Date(b.eventAt).getTime() - new Date(a.eventAt).getTime()),
    [order],
  );

  if (!order || order.serviceType !== 'instant' || !tracking) {
    return (
      <div className="instant-tracking-page">
        <div className="instant-tracking-empty">
          <Route size={30} />
          <h1>Không có dữ liệu theo dõi hỏa tốc</h1>
          <p>Trang này chỉ dùng cho đơn giao nội thành bằng Green SM hoặc GrabExpress.</p>
          <button type="button" onClick={() => navigate(order ? `/orders/${order.id}` : '/orders')}>
            <ArrowLeft size={16} /> Quay lại
          </button>
        </div>
      </div>
    );
  }

  const isDelivered = tracking.state === 'DELIVERED';
  const isDriverNotFound = tracking.state === 'DRIVER_NOT_FOUND';
  const progress = Math.max(0, Math.min(100, tracking.progressPercent));
  const driverX = 90 + (progress / 100) * 540;
  const driverY = 310 - (progress / 100) * 205;

  return (
    <div className="instant-tracking-page">
      <header className="order-detail-header instant-tracking-header">
        <div className="order-detail-header-left">
          <button
            type="button"
            className="order-back-btn"
            onClick={() => navigate(`/orders/${order.id}`)}
            title="Quay lại chi tiết đơn hàng"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="order-detail-title">Theo Dõi Giao Hỏa Tốc</h1>
            <p>{carrier} · Mã đơn {order.shippingInfo?.deliveryTracking}</p>
          </div>
        </div>
        <div className="order-detail-header-right">
          <div className={`instant-live-state ${isDelivered ? 'completed' : ''}`}>
            {isDelivered ? <CheckCircle2 size={16} /> : <Radio size={16} />}
            {isDelivered
              ? 'Đã hoàn tất'
              : isDriverNotFound
                ? 'Phân bổ tài xế thất bại'
                : 'Đang cập nhật trực tiếp'}
          </div>
          <span className="order-header-created-date">Mã đơn: {order.id}</span>
        </div>
      </header>

      <section className="order-card instant-summary-card">
        <div className="order-card-header">
          <div className="card-header-icon-box green">
            {isDelivered ? <PackageCheck size={16} /> : <Navigation size={16} />}
          </div>
          <div>
            <h2 className="order-card-header-title">Tình trạng chuyến giao</h2>
            <span className="order-card-header-sub instant-summary-source">
              <i /> Dữ liệu cập nhật trực tiếp từ {carrier}
            </span>
          </div>
          <button
            type="button"
            className="instant-refresh-button"
            onClick={() => notify(`Đã cập nhật trạng thái mới nhất từ ${carrier}.`)}
          >
            <RefreshCw size={13} /> Làm mới
          </button>
        </div>
        <div className="order-card-body instant-summary-grid">
          <div className="instant-summary-item primary">
            <div className="instant-summary-label">
              {isDelivered ? <PackageCheck size={13} /> : <Navigation size={13} />}
              <span>TRẠNG THÁI HIỆN TẠI</span>
            </div>
            <strong>{tracking.statusLabel}</strong>
            <small>Cập nhật {formatTime(tracking.updatedAt)}</small>
          </div>
          <div className="instant-summary-item">
            <div className="instant-summary-label">
              <Route size={13} />
              <span>QUÃNG ĐƯỜNG CÒN LẠI</span>
            </div>
            <strong>
              {isDelivered
                ? 'Đã đến nơi'
                : isDriverNotFound
                  ? 'Chưa bắt đầu'
                  : formatInstantDistance(tracking.remainingDistanceKm)}
            </strong>
            <small>{progress}% hành trình</small>
            <div className="instant-summary-progress" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="instant-summary-item">
            <div className="instant-summary-label">
              <Clock3 size={13} />
              <span>
                {isDelivered ? 'HOÀN THÀNH LÚC' : isDriverNotFound ? 'PHÂN BỔ TÀI XẾ' : 'DỰ KIẾN TỚI'}
              </span>
            </div>
            <strong>
              {isDriverNotFound ? 'Không thành công' : formatTime(tracking.estimatedArrivalAt).split(' ')[0]}
            </strong>
            <small>
              {isDelivered
                ? 'Đã bàn giao'
                : isDriverNotFound
                  ? 'Có thể thử lại hoặc đổi NVC'
                  : formatInstantEta(tracking.etaMinutes)
                    ? `Khoảng ${formatInstantEta(tracking.etaMinutes)} nữa`
                    : ''}
            </small>
          </div>
        </div>
      </section>

      <div className="instant-tracking-layout">
        <section className="order-card instant-map-card">
          <div className="order-card-header instant-map-heading">
            <div className="card-header-icon-box green">
              <Route size={16} />
            </div>
            <div>
              <h2 className="order-card-header-title">Vị trí và hành trình tài xế</h2>
              <span className="order-card-header-sub">Từ điểm lấy hàng đến người nhận</span>
            </div>
            <span className="instant-map-source">
              <ShieldCheck size={14} /> Dữ liệu từ {carrier}
            </span>
          </div>

          <div className="instant-map-canvas">
            <div className="instant-map-road road-one" />
            <div className="instant-map-road road-two" />
            <div className="instant-map-road road-three" />
            <svg className="instant-map-route" viewBox="0 0 720 390" aria-hidden="true">
              <path className="instant-route-shadow" d="M90 310 C235 310 310 165 430 150 C520 138 565 112 630 105" />
              <path className="instant-route-base" d="M90 310 C235 310 310 165 430 150 C520 138 565 112 630 105" />
              <path
                className="instant-route-progress"
                pathLength="100"
                strokeDasharray={`${progress} ${100 - progress}`}
                d="M90 310 C235 310 310 165 430 150 C520 138 565 112 630 105"
              />
              <circle className="instant-map-origin" cx="90" cy="310" r="8" />
              <circle className="instant-map-destination" cx="630" cy="105" r="8" />
              <g className={isDelivered ? 'instant-driver-marker delivered' : 'instant-driver-marker'}>
                <circle className="instant-driver-pulse" cx={driverX} cy={driverY} r="19" />
                <circle className="instant-driver-dot" cx={driverX} cy={driverY} r="11" />
                <foreignObject x={driverX - 7} y={driverY - 7} width="14" height="14">
                  <div className="instant-bike-svg-icon"><Bike size={13} /></div>
                </foreignObject>
              </g>
            </svg>

            <div className="instant-map-label pickup">
              <span>Điểm lấy</span>
              <strong>Shop</strong>
            </div>
            <div className="instant-map-label destination">
              <span>Điểm giao</span>
              <strong>Người nhận</strong>
            </div>
            <div
              className={`instant-driver-location ${isDelivered ? 'delivered' : ''}`}
              style={{ left: `${12 + progress * 0.72}%`, top: `${74 - progress * 0.4}%` }}
            >
              <strong>{isDelivered ? 'Đã đến điểm giao' : 'Tài xế đang ở đây'}</strong>
              <span>{tracking.currentAddress}</span>
            </div>
          </div>

          <div className="instant-route-progress-panel">
            <div className="instant-progress-copy">
              <strong>{progress}% hành trình</strong>
              <span>
                {isDelivered
                  ? 'Đã hoàn thành'
                  : formatInstantDistance(tracking.remainingDistanceKm)
                    ? `Còn ${formatInstantDistance(tracking.remainingDistanceKm)}`
                    : ''}
              </span>
            </div>
            <div className="instant-progress-track">
              <span style={{ width: `${progress}%` }} />
            </div>
            <div className="instant-route-endpoints">
              <span><MapPin size={14} /> {tracking.pickupAddress}</span>
              <span><Navigation size={14} /> {tracking.deliveryAddress}</span>
            </div>
          </div>
        </section>

        <div className="instant-tracking-aside">
          <section className="order-card instant-driver-card">
            <div className="order-card-header">
              <div className="card-header-icon-box blue"><Bike size={16} /></div>
              <div>
                <h2 className="order-card-header-title">Tài xế phụ trách</h2>
                <span className="order-card-header-sub">Thông tin chuyến giao hiện tại</span>
              </div>
              <img src={carrierLogo(carrier)} alt={carrier} />
            </div>
            <div className="order-card-body">
              <div className="instant-driver-identity">
                <div className="instant-driver-avatar">
                  {(order.shipperDeliveryName || 'TX').split(/\s+/).slice(-2).map((word) => word[0]).join('')}
                </div>
                <div>
                  <strong>{order.shipperDeliveryName}</strong>
                  <span>{order.shipperDeliveryCode} · {carrier}</span>
                </div>
              </div>
              <div className="instant-driver-details">
                <span><Bike size={15} /><small>Phương tiện</small><strong>{tracking.vehicleType}</strong></span>
                <span><ShieldCheck size={15} /><small>Biển số</small><strong>{tracking.vehiclePlate}</strong></span>
                <span><LocateFixed size={15} /><small>Độ chính xác</small><strong>±{tracking.locationAccuracyMeters} m</strong></span>
                <span><Phone size={15} /><small>Số điện thoại</small><strong>{order.shipperDeliveryPhone || 'Chưa có dữ liệu'}</strong></span>
              </div>
            </div>
          </section>

          <section className="order-card instant-events-card">
            <div className="order-card-header instant-events-heading">
              <div className="card-header-icon-box blue"><Clock3 size={16} /></div>
              <div>
                <h2 className="order-card-header-title">Diễn biến chuyến giao</h2>
                <span className="order-card-header-sub">Cập nhật từ {carrier}</span>
              </div>
            </div>
            <div className="order-card-body instant-events-list">
              {events.map((event, index) => (
                <div key={event.id} className={`instant-event-row ${index === 0 ? 'latest' : ''}`}>
                  <div className="instant-event-rail">
                    <span>{index === 0 ? <Navigation size={11} /> : <CheckCircle2 size={11} />}</span>
                    {index < events.length - 1 && <i />}
                  </div>
                  <div className="instant-event-main">
                    <strong>{event.statusText}</strong>
                    <span>{event.location || 'Không có vị trí'}</span>
                    <time>{formatTime(event.eventAt)}</time>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
