import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package,
  Search,
  CheckCircle2,
  Truck,
  MapPin,
  ArrowLeft,
  ShieldCheck,
  Phone,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import { useOrders } from '@/features/orders';

export default function PublicTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const { orders } = useOrders();

  const [orderCode, setOrderCode] = useState(id || '');
  const [phoneInput, setPhoneInput] = useState('');
  
  const [step, setStep] = useState<'search' | 'auth' | 'result'>('search');
  const [matchedOrder, setMatchedOrder] = useState<typeof orders[0] | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle Step 1: Search Order Code
  const handleStep1Search = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const code = orderCode.trim();
    if (!code) {
      setErrorMessage('Vui lòng nhập mã đơn hàng cần tra cứu.');
      return;
    }

    const found = orders.find((o) => o.id.toLocaleLowerCase() === code.toLocaleLowerCase());

    if (!found) {
      setErrorMessage(`Không tìm thấy mã đơn hàng "${code}". Vui lòng kiểm tra lại.`);
      setMatchedOrder(null);
      setStep('search');
    } else {
      setMatchedOrder(found);
      setStep('auth');
    }
  };

  // Handle Step 2: Verify Phone Number
  const handleStep2Verify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!matchedOrder) return;

    const inputPhoneClean = phoneInput.trim().replace(/\D/g, '');
    const actualPhoneClean = matchedOrder.phone.trim().replace(/\D/g, '');

    if (!inputPhoneClean) {
      setErrorMessage('Vui lòng nhập số điện thoại người nhận để xác thực.');
      return;
    }

    if (inputPhoneClean !== actualPhoneClean) {
      setErrorMessage('Số điện thoại không khớp với thông tin người nhận của đơn hàng này.');
      return;
    }

    // Auth Success -> Move to Result
    setStep('result');
  };

  const handleReset = () => {
    setOrderCode('');
    setPhoneInput('');
    setMatchedOrder(null);
    setErrorMessage('');
    setStep('search');
  };

  return (
    <div className="public-tracking-page">
      {/* Header */}
      <div className="public-tracking-header">
        <Link to="/orders" className="btn-back-public">
          <ArrowLeft size={18} /> Quay lại ứng dụng
        </Link>
        <div className="public-logo">
          <span className="mark">S</span>
          <strong>SuperPlatform Tracking</strong>
        </div>
      </div>

      {/* Hero Header */}
      <div className="public-tracking-hero">
        <h1>Tra cứu hành trình đơn hàng</h1>
        <p>Hệ thống tra cứu 2 bước bảo mật: Nhập đúng mã đơn hàng và Xác thực số điện thoại người nhận.</p>
      </div>

      {/* Search Container */}
      <div className="public-tracking-container">
        {/* STEP 1: Search Form */}
        {step === 'search' && (
          <form onSubmit={handleStep1Search} className="public-card-form">
            <div className="form-step-badge">Bước 1 / 2: Nhập mã đơn hàng</div>
            <div className="public-search-input-group">
              <Search size={20} className="search-icon-public" />
              <input
                type="text"
                placeholder="Nhập chính xác mã đơn (Ví dụ: 826883962104)"
                value={orderCode}
                onChange={(e) => setOrderCode(e.target.value)}
                autoFocus
              />
            </div>

            {errorMessage && (
              <div className="public-error-banner">
                <AlertCircle size={16} /> {errorMessage}
              </div>
            )}

            <button type="submit" className="btn-public-submit">
              Tra cứu mã đơn
            </button>
          </form>
        )}

        {/* STEP 2: Phone Authentication Form */}
        {step === 'auth' && matchedOrder && (
          <form onSubmit={handleStep2Verify} className="public-card-form">
            <div className="form-step-badge green">
              <ShieldCheck size={14} /> Bước 2 / 2: Xác thực Người nhận
            </div>

            <div className="order-found-preview">
              <Package size={18} className="red-icon" />
              <span>Mã đơn hàng: <strong>{matchedOrder.id}</strong> (Đã tìm thấy)</span>
            </div>

            <div className="auth-prompt-text">
              Để bảo vệ thông tin cá nhân, vui lòng nhập <strong>Số điện thoại người nhận</strong> để mở khóa hành trình:
            </div>

            <div className="public-search-input-group">
              <Phone size={20} className="search-icon-public" />
              <input
                type="tel"
                placeholder="Nhập số điện thoại người nhận (Ví dụ: 0333126429)"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                autoFocus
              />
            </div>

            {errorMessage && (
              <div className="public-error-banner">
                <AlertCircle size={16} /> {errorMessage}
              </div>
            )}

            <div className="public-btn-row">
              <button type="button" className="btn-public-back" onClick={handleReset}>
                <RotateCcw size={15} /> Nhập mã khác
              </button>
              <button type="submit" className="btn-public-submit flex-1">
                Xác thực & Xem hành trình
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Authentic Result */}
        {step === 'result' && matchedOrder && (
          <div className="public-result-card">
            <div className="result-top-bar">
              <div className="result-id-group">
                <Package size={22} className="red-icon" />
                <div>
                  <h2>Mã kiện hàng: {matchedOrder.id}</h2>
                  <span className="auth-verified-tag">
                    <ShieldCheck size={12} /> Đã xác thực số điện thoại
                  </span>
                </div>
              </div>
              <span className="public-status-badge">{matchedOrder.status}</span>
            </div>

            <div className="result-info-grid">
              <div className="info-block">
                <span className="info-label">Người nhận</span>
                <span className="info-val">{matchedOrder.name}</span>
              </div>
              <div className="info-block">
                <span className="info-label">Số điện thoại</span>
                <span className="info-val">{matchedOrder.phone}</span>
              </div>
              <div className="info-block">
                <span className="info-label">Khu vực nhận</span>
                <span className="info-val">{matchedOrder.region}</span>
              </div>
            </div>

            <div className="public-timeline-section">
              <h3>Hành trình vận chuyển thực tế</h3>
              <div className="public-timeline-list">
                <div className="public-timeline-step done">
                  <div className="step-icon">
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="step-text">
                    <strong>Khởi tạo đơn hàng</strong>
                    <span>Hệ thống ghi nhận nhu cầu gửi kiện</span>
                    <small>{matchedOrder.createdAt || '12/09/2026 11:26'}</small>
                  </div>
                </div>

                <div
                  className={`public-timeline-step ${
                    matchedOrder.status !== 'Chờ Lấy Hàng' ? 'done' : 'active'
                  }`}
                >
                  <div className="step-icon">
                    <Truck size={16} />
                  </div>
                  <div className="step-text">
                    <strong>Lấy hàng tại điểm gửi</strong>
                    <span>
                      {matchedOrder.status !== 'Chờ Lấy Hàng'
                        ? 'Đã lấy hàng thành công tại kho gửi'
                        : 'Đang phân công Shipper lấy hàng'}
                    </span>
                    <small>Kho Hồ Mễ Trì, Nam Từ Liêm, Hà Nội</small>
                  </div>
                </div>

                <div
                  className={`public-timeline-step ${
                    matchedOrder.status === 'Đã giao hàng'
                      ? 'done'
                      : matchedOrder.status === 'Đang giao hàng'
                      ? 'active'
                      : 'pending'
                  }`}
                >
                  <div className="step-icon">
                    <MapPin size={16} />
                  </div>
                  <div className="step-text">
                    <strong>Giao hàng tới Người nhận</strong>
                    <span>
                      {matchedOrder.status === 'Đã giao hàng'
                        ? 'Đã ký nhận giao hàng thành công'
                        : matchedOrder.status === 'Hoãn giao hàng'
                        ? 'Hoãn giao hàng theo yêu cầu người nhận'
                        : 'Shipper đang trên đường giao kiện'}
                    </span>
                    <small>{matchedOrder.address}</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="result-footer-row">
              <button type="button" className="btn-public-back" onClick={handleReset}>
                <RotateCcw size={15} /> Tra cứu đơn khác
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
