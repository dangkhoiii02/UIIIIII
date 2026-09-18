import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Headphones,
  LockKeyhole,
  MapPin,
  Package,
  Phone,
  RotateCcw,
  Search,
  ShieldCheck,
  Truck,
  UserRound,
} from 'lucide-react';
import {
  getPublicSpfStatusName,
  getSpfLifecyclePhase,
  isSpfFailureStatus,
  useOrders,
  type Order,
} from '@/features/orders';

function waybillsOf(order: Order) {
  const shipping = order.shippingInfo;
  if (!shipping) return [];
  return [
    shipping.pickupTracking,
    shipping.deliveryTracking,
    shipping.returnTracking,
    shipping.refundTracking,
    ...(shipping.stages?.map((stage) => stage.tracking) || []),
  ].filter(Boolean) as string[];
}

function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 7) return '***';
  return `${digits.slice(0, 3)}****${digits.slice(-3)}`;
}

function maskName(name: string) {
  return name
    .split(/\s+/)
    .map((part, index, parts) =>
      index === 0 || index === parts.length - 1 ? part : `${part.charAt(0)}***`,
    )
    .join(' ');
}

function maskRegion(region: string) {
  const administrativeWords = new Set([
    'phường',
    'xã',
    'thị',
    'trấn',
    'quận',
    'huyện',
    'thành',
    'phố',
    'tỉnh',
    'tp.',
  ]);

  return region
    .split(/(\s+|,\s*)/)
    .map((token) => {
      const normalized = token.toLocaleLowerCase('vi-VN');
      if (!token.trim() || token.includes(',') || administrativeWords.has(normalized)) return token;
      if (/^\d+$/.test(token)) return '*'.repeat(token.length);
      return `${token.charAt(0)}${'*'.repeat(Math.min(Math.max(token.length - 1, 1), 3))}`;
    })
    .join('');
}

function statusTone(order: Order) {
  const phase = getSpfLifecyclePhase(order.spfCode);
  if (order.spfCode === 'SPF-0201' || order.spfCode === 'SPF-0102') return 'cancelled';
  if (order.spfCode === 'SPF-0901' || phase === 'returned') return 'success';
  if (phase === 'return' || isSpfFailureStatus(order.spfCode)) return 'warning';
  return 'active';
}

function deliveryProgress(order: Order) {
  const phase = getSpfLifecyclePhase(order.spfCode);
  const cancelled = order.spfCode === 'SPF-0201' || order.spfCode === 'SPF-0102';
  const picked = order.spfCode >= 'SPF-0501' && phase !== 'cancelled';
  const delivered = order.spfCode === 'SPF-0901';
  const returning = phase === 'return' || phase === 'returned' || order.spfCode === 'SPF-0902';

  return {
    created: cancelled ? 'stopped' : 'done',
    pickup: cancelled ? 'stopped' : picked ? 'done' : 'active',
    delivery:
      cancelled || returning ? 'stopped' : delivered ? 'done' : picked ? 'active' : 'pending',
  } as const;
}

function PlatformMark() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M24 4 43 14 24 24 5 14 24 4Z" />
      <path d="m5 23 19 10 19-10M5 32l19 10 19-10" />
    </svg>
  );
}

function carrierLogoOf(carrier: string) {
  const name = carrier.toLocaleLowerCase('vi-VN');
  if (name.includes('green sm') || name.includes('greensm')) {
    return { src: '/carriers/xanhsm.jpg', alt: 'Green SM Express' };
  }
  if (name.includes('grab')) {
    return { src: '/carriers/grab.jpg', alt: 'GrabExpress' };
  }
  if (name.includes('spx') || name.includes('shopee')) {
    return { src: '/carriers/spx_official.svg', alt: 'SPX Express' };
  }
  if (name.includes('j&t') || name.includes('jnt')) {
    return { src: '/carriers/jt_official.webp', alt: 'J&T Express' };
  }
  if (name.includes('ghn') || name.includes('nhanh')) {
    return { src: '/carriers/ghn.jpg', alt: 'Giao Hàng Nhanh' };
  }
  if (name.includes('best')) {
    return { src: '/carriers/BEST.jpg', alt: 'BEST Express' };
  }
  if (name.includes('ghtk') || name.includes('tiết kiệm')) {
    return { src: '/carriers/ghtk_emblem.svg', alt: 'Giao Hàng Tiết Kiệm' };
  }
  if (name.includes('viettel') || name.includes('vtp')) {
    return { src: '/carriers/viettel_emblem.png', alt: 'Viettel Post' };
  }
  if (name.includes('vietnam post') || name.includes('vietnampost') || name.includes('vnpost')) {
    return { src: '/carriers/vnp.jpg', alt: 'Vietnam Post' };
  }
  if (name.includes('super')) {
    return { src: '/carriers/supership.jpg', alt: 'SuperShip' };
  }
  return null;
}

function carrierStatusOf(order: Order) {
  const status = order.shippingInfo?.carrierStatusText
    ?.split(/\s+[–—-]\s+/)
    .at(-1)
    ?.trim();
  return status || order.status;
}

function activeCarrierOf(order: Order) {
  const shipping = order.shippingInfo;
  if (!shipping) return 'SuperPlatform';
  const activeStage = shipping.stages?.find((stage) => stage.status === 'active');
  if (activeStage?.carrier) return activeStage.carrier;
  if (shipping.currentStage === 'return') return shipping.returnCarrier || 'SuperShip';
  if (shipping.currentStage === 'refund') {
    return shipping.refundCarrier || shipping.returnCarrier || 'SuperShip';
  }
  if (shipping.currentStage === 'delivery') return shipping.deliveryCarrier || 'SuperShip';
  if (shipping.currentStage === 'pickup') return shipping.pickupCarrier || 'SuperShip';

  const phase = getSpfLifecyclePhase(order.spfCode);
  if (phase === 'returned')
    return shipping.returnCarrier || shipping.deliveryCarrier || 'SuperShip';
  if (phase === 'delivered')
    return shipping.deliveryCarrier || shipping.pickupCarrier || 'SuperShip';
  return shipping.pickupCarrier || shipping.deliveryCarrier || 'SuperPlatform';
}

export default function PublicTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const { orders } = useOrders();
  const [orderCode, setOrderCode] = useState(id || '');
  const [phoneSuffix, setPhoneSuffix] = useState('');
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    const code = orderCode.trim().toLowerCase();
    const suffix = phoneSuffix.replace(/\D/g, '');

    if (!code || suffix.length !== 4) {
      setErrorMessage('Vui lòng nhập mã đơn/mã vận đơn và đúng 4 số cuối SĐT người nhận.');
      return;
    }

    const order = orders.find(
      (item) =>
        item.id.toLowerCase() === code ||
        waybillsOf(item).some((waybill) => waybill.toLowerCase() === code),
    );
    if (!order) {
      setErrorMessage('Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đã nhập.');
      return;
    }
    if (!order.phone.replace(/\D/g, '').endsWith(suffix)) {
      setErrorMessage('4 số cuối điện thoại không khớp với thông tin người nhận.');
      return;
    }

    setMatchedOrder(order);
  };

  const reset = () => {
    setOrderCode('');
    setPhoneSuffix('');
    setMatchedOrder(null);
    setErrorMessage('');
  };

  const progress = matchedOrder ? deliveryProgress(matchedOrder) : null;
  const activeCarrier = matchedOrder ? activeCarrierOf(matchedOrder) : '';
  const carrierLogo = carrierLogoOf(activeCarrier);
  const carrierStatus = matchedOrder ? carrierStatusOf(matchedOrder) : '';
  const carrierStatusTone = matchedOrder ? statusTone(matchedOrder) : 'active';

  return (
    <div className="public-tracking-page">
      <header className="public-tracking-header">
        <Link to="/orders" className="public-brand" aria-label="SuperPlatform">
          <span className="public-brand-mark">
            <PlatformMark />
          </span>
          <span className="public-brand-copy">
            <strong>SuperPlatform</strong>
            <small>NỀN TẢNG QUẢN LÝ ĐƠN HÀNG</small>
          </span>
        </Link>
        <div className="public-header-actions">
          <span className="public-mode-chip">
            <ShieldCheck size={14} /> Tra cứu công khai
          </span>
          <Link to="/orders" className="btn-back-public">
            <ArrowLeft size={17} /> Về trang quản lý
          </Link>
        </div>
      </header>

      <main className="public-tracking-main">
        <section className="public-tracking-hero">
          <span className="public-kicker">
            <Package size={14} /> DÀNH CHO NGƯỜI NHẬN
          </span>
          <h1>Tra cứu hành trình đơn hàng</h1>
          <p>Theo dõi minh bạch, cập nhật xuyên suốt mọi chặng giao nhận.</p>
        </section>

        <div className="public-tracking-container">
          {!matchedOrder ? (
            <form onSubmit={handleSearch} className="public-card-form">
              <div className="public-form-heading">
                <span className="public-heading-icon">
                  <LockKeyhole size={20} />
                </span>
                <div>
                  <h2>Xác thực thông tin đơn hàng</h2>
                  <p>Thông tin người nhận được bảo vệ trong suốt quá trình tra cứu.</p>
                </div>
              </div>

              <div className="public-verification-grid">
                <label>
                  <span>Mã đơn hàng hoặc mã vận đơn</span>
                  <div className="public-search-input-group">
                    <Package size={19} className="search-icon-public" />
                    <input
                      type="text"
                      placeholder="Ví dụ: 826883962104"
                      value={orderCode}
                      onChange={(event) => setOrderCode(event.target.value)}
                      autoFocus
                    />
                  </div>
                </label>
                <label>
                  <span>4 số cuối điện thoại người nhận</span>
                  <div className="public-search-input-group">
                    <Phone size={19} className="search-icon-public" />
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="Ví dụ: 6429"
                      value={phoneSuffix}
                      onChange={(event) => setPhoneSuffix(event.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                </label>
              </div>
              {errorMessage && (
                <div className="public-error-banner">
                  <AlertCircle size={17} /> {errorMessage}
                </div>
              )}
              <button type="submit" className="btn-public-submit">
                <Search size={17} /> Tra cứu hành trình <ChevronRight size={17} />
              </button>
              <div className="public-privacy-note">
                <ShieldCheck size={15} />
                <span>
                  Chỉ hiển thị thông tin giao nhận cần thiết; không công khai cước phí, tiền thu hộ
                  hoặc ghi chú nội bộ.
                </span>
              </div>
            </form>
          ) : (
            <article className="public-result-card">
              <div className="result-top-bar">
                <div className="result-id-group">
                  <span className="result-package-icon">
                    <Package size={23} />
                  </span>
                  <div>
                    <span className="result-eyebrow">MÃ ĐƠN HÀNG</span>
                    <h2>{matchedOrder.id}</h2>
                    <span className="auth-verified-tag">
                      <ShieldCheck size={13} /> Đã xác thực người nhận
                    </span>
                  </div>
                </div>
                <span className={`public-status-badge ${statusTone(matchedOrder)}`}>
                  {getPublicSpfStatusName(matchedOrder.spfCode)}
                </span>
              </div>

              <div className="result-info-grid">
                <div className="info-block">
                  <span className="info-icon">
                    <UserRound size={17} />
                  </span>
                  <div>
                    <span className="info-label">Người nhận</span>
                    <span className="info-val">{maskName(matchedOrder.name)}</span>
                  </div>
                </div>
                <div className="info-block">
                  <span className="info-icon">
                    <Phone size={17} />
                  </span>
                  <div>
                    <span className="info-label">Số điện thoại</span>
                    <span className="info-val">{maskPhone(matchedOrder.phone)}</span>
                  </div>
                </div>
                <div className="info-block">
                  <span className="info-icon">
                    <MapPin size={17} />
                  </span>
                  <div>
                    <span className="info-label">Khu vực nhận</span>
                    <span className="info-val">{maskRegion(matchedOrder.region)}</span>
                  </div>
                </div>
              </div>

              <div className="public-carrier-summary">
                <span className={`carrier-summary-icon ${carrierLogo ? 'has-logo' : ''}`}>
                  {carrierLogo ? (
                    <img src={carrierLogo.src} alt={carrierLogo.alt} />
                  ) : (
                    <Truck size={20} />
                  )}
                </span>
                <div className="carrier-summary-copy">
                  <span>
                    {['delivered', 'returned'].includes(
                      getSpfLifecyclePhase(matchedOrder.spfCode),
                    ) || matchedOrder.spfCode === 'SPF-0201'
                      ? 'Nhà vận chuyển chặng cuối'
                      : 'Nhà vận chuyển đang phụ trách'}
                  </span>
                  <strong>{activeCarrier}</strong>
                </div>
                <span className={`carrier-status-chip ${carrierStatusTone}`}>{carrierStatus}</span>
              </div>

              <div className="public-timeline-section">
                <div className="public-section-heading">
                  <div>
                    <span>TIẾN TRÌNH GIAO NHẬN</span>
                    <h3>Hành trình vận chuyển</h3>
                  </div>
                  <small>
                    Cập nhật gần nhất: {matchedOrder.updatedAt || matchedOrder.createdAt}
                  </small>
                </div>
                <div className="public-timeline-list">
                  <div className={`public-timeline-step ${progress?.created}`}>
                    <div className="step-icon">
                      <CheckCircle2 size={17} />
                    </div>
                    <div className="step-text">
                      <strong>Khởi tạo đơn hàng</strong>
                      <span>Hệ thống đã tiếp nhận thông tin gửi kiện</span>
                      <small>{matchedOrder.createdAt}</small>
                    </div>
                  </div>
                  <div className={`public-timeline-step ${progress?.pickup}`}>
                    <div className="step-icon">
                      <Truck size={17} />
                    </div>
                    <div className="step-text">
                      <strong>Lấy và trung chuyển hàng</strong>
                      <span>
                        {progress?.pickup === 'done'
                          ? 'Kiện hàng đã được tiếp nhận để vận chuyển'
                          : progress?.pickup === 'stopped'
                            ? 'Quá trình lấy hàng đã dừng'
                            : 'Đang sắp xếp nhân viên lấy hàng'}
                      </span>
                    </div>
                  </div>
                  <div className={`public-timeline-step ${progress?.delivery}`}>
                    <div className="step-icon">
                      <MapPin size={17} />
                    </div>
                    <div className="step-text">
                      <strong>Giao tới người nhận</strong>
                      <span>
                        {matchedOrder.spfCode === 'SPF-0901'
                          ? 'Kiện hàng đã được giao thành công'
                          : isSpfFailureStatus(matchedOrder.spfCode)
                            ? 'Lần xử lý gần nhất chưa thành công'
                            : progress?.delivery === 'stopped'
                              ? 'Quá trình giao hàng đã dừng'
                              : 'Kiện hàng đang trong hành trình giao nhận'}
                      </span>
                      <small>Khu vực nhận: {maskRegion(matchedOrder.region)}</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="result-footer-row">
                <span className="public-help-note">
                  <Headphones size={16} /> Cần hỗ trợ? Liên hệ cửa hàng gửi hàng của bạn.
                </span>
                <button type="button" className="btn-public-back" onClick={reset}>
                  <RotateCcw size={16} /> Tra cứu đơn khác
                </button>
              </div>
            </article>
          )}
        </div>
      </main>

      <footer className="public-tracking-footer">
        <span>© 2026 SuperPlatform</span>
        <span>Thông tin được bảo vệ và chỉ dùng để tra cứu giao nhận.</span>
      </footer>
    </div>
  );
}
