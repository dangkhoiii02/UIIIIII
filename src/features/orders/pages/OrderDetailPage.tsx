import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Copy,
  User,
  Package,
  Store,
  MapPin,
  Receipt,
  Star,
  QrCode,
  RotateCcw,
  MessageSquare,
  Pencil,
  DollarSign,
  FileEdit,
  XCircle,
  Printer,
  Info,
  Truck,
  Eye,
  EyeOff,
} from 'lucide-react';
import { money } from '@/shared/lib/format';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/toast-context';
import { useOrders } from '../model/orders-context';
import { SupportDialog } from '@/features/support';

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

function SvgBarcode({ code }: { code: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width="220" height="46" viewBox="0 0 220 46" style={{ display: 'block' }}>
        {[
          4, 7, 12, 16, 20, 22, 26, 31, 36, 39, 44, 47, 52, 57, 61, 64, 69, 74, 78,
          83, 86, 91, 95, 100, 104, 107, 112, 117, 122, 125, 130, 134, 139, 143, 146,
          151, 156, 160, 163, 168, 173, 178, 181, 186, 190, 195, 199, 204, 208, 212,
        ].map((x, i) => (
          <rect
            key={i}
            x={x}
            y="0"
            width={i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1.2}
            height="46"
            fill="#1e293b"
          />
        ))}
      </svg>
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, color: '#1e293b', marginTop: 5 }}>
        {code}
      </div>
    </div>
  );
}

function SvgQrCode() {
  return (
    <svg width="124" height="124" viewBox="0 0 120 120" style={{ display: 'block', margin: '0 auto 16px' }}>
      <rect width="120" height="120" fill="white" />
      {/* Top-left corner finder */}
      <rect x="6" y="6" width="32" height="32" fill="#0f172a" rx="4" />
      <rect x="12" y="12" width="20" height="20" fill="white" rx="2" />
      <rect x="17" y="17" width="10" height="10" fill="#0f172a" rx="1" />

      {/* Top-right corner finder */}
      <rect x="82" y="6" width="32" height="32" fill="#0f172a" rx="4" />
      <rect x="88" y="12" width="20" height="20" fill="white" rx="2" />
      <rect x="93" y="17" width="10" height="10" fill="#0f172a" rx="1" />

      {/* Bottom-left corner finder */}
      <rect x="6" y="82" width="32" height="32" fill="#0f172a" rx="4" />
      <rect x="12" y="88" width="20" height="20" fill="white" rx="2" />
      <rect x="17" y="93" width="10" height="10" fill="#0f172a" rx="1" />

      {/* Data pattern blocks */}
      <rect x="44" y="10" width="5" height="5" fill="#0f172a" />
      <rect x="52" y="10" width="12" height="5" fill="#0f172a" />
      <rect x="68" y="10" width="8" height="5" fill="#0f172a" />

      <rect x="44" y="20" width="8" height="5" fill="#0f172a" />
      <rect x="58" y="20" width="5" height="5" fill="#0f172a" />
      <rect x="68" y="20" width="9" height="5" fill="#0f172a" />

      <rect x="44" y="30" width="5" height="5" fill="#0f172a" />
      <rect x="54" y="30" width="10" height="5" fill="#0f172a" />
      <rect x="70" y="30" width="6" height="5" fill="#0f172a" />

      <rect x="10" y="44" width="24" height="5" fill="#0f172a" />
      <rect x="40" y="44" width="40" height="5" fill="#0f172a" />
      <rect x="86" y="44" width="24" height="5" fill="#0f172a" />

      <rect x="10" y="54" width="8" height="5" fill="#0f172a" />
      <rect x="24" y="54" width="12" height="5" fill="#0f172a" />
      <rect x="44" y="54" width="16" height="5" fill="#0f172a" />
      <rect x="68" y="54" width="14" height="5" fill="#0f172a" />
      <rect x="88" y="54" width="22" height="5" fill="#0f172a" />

      <rect x="10" y="64" width="18" height="5" fill="#0f172a" />
      <rect x="36" y="64" width="22" height="5" fill="#0f172a" />
      <rect x="66" y="64" width="18" height="5" fill="#0f172a" />
      <rect x="90" y="64" width="20" height="5" fill="#0f172a" />

      <rect x="44" y="76" width="6" height="6" fill="#0f172a" />
      <rect x="56" y="76" width="10" height="6" fill="#0f172a" />
      <rect x="72" y="76" width="18" height="6" fill="#0f172a" />
      <rect x="96" y="76" width="14" height="6" fill="#0f172a" />

      <rect x="44" y="88" width="14" height="6" fill="#0f172a" />
      <rect x="64" y="88" width="8" height="6" fill="#0f172a" />
      <rect x="78" y="88" width="12" height="6" fill="#0f172a" />
      <rect x="96" y="88" width="18" height="6" fill="#0f172a" />

      <rect x="44" y="100" width="20" height="6" fill="#0f172a" />
      <rect x="70" y="100" width="14" height="6" fill="#0f172a" />
      <rect x="90" y="100" width="20" height="6" fill="#0f172a" />
    </svg>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const notify = useToast();
  const { orders, cancelOrder, markPrinted } = useOrders();

  const [rating, setRating] = useState(0);
  const [showPhoneReceiver, setShowPhoneReceiver] = useState(false);
  const [showPhoneSender, setShowPhoneSender] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showEditCodModal, setShowEditCodModal] = useState(false);
  const [showEditInfoModal, setShowEditInfoModal] = useState(false);

  // Find order by ID or use fallback mock order matching screenshot
  const order = orders.find((o) => o.id === id) || {
    id: id || '826883962104',
    name: 'Lê Phước Thắng',
    phone: '033****429',
    address: '99/1 Hàm Nghi, Phường Bình Định, Thị xã An Nhơn',
    region: 'Tỉnh Bình Định',
    product: 'Mỹ phẩm',
    weight: 750,
    value: 200000,
    cod: 200000,
    length: 10,
    width: 10,
    height: 10,
    privateId: '',
    note: 'Khách không nhận vui lòng thu 30k phí giao hàng. Cảm ơn!',
    payer: 'sender' as const,
    inspection: 'view' as const,
    returnGoods: false,
    createdAt: '12/09/2026 • 11:26',
    status: 'Chờ Lấy Hàng' as const,
    printed: false,
    batchId: '',
    reconciliationId: '',
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(order.id);
    notify('Đã sao chép mã đơn hàng!');
  };

  return (
    <div className="order-detail-page-wrapper">
      <div className="order-detail-container">
        {/* Top Header / Title Bar */}
        <div className="order-detail-header">
          <div className="order-detail-header-left">
            <button
              type="button"
              className="order-back-btn"
              onClick={() => navigate('/orders')}
              title="Quay lại danh sách đơn hàng"
            >
              <ArrowLeft size={17} />
            </button>
            <div>
              <div className="order-detail-subtitle">Chi tiết đơn hàng</div>
              <h1 className="order-detail-title">
                {order.id}
                <button
                  type="button"
                  className="order-copy-btn"
                  onClick={handleCopyId}
                  title="Sao chép mã đơn"
                >
                  <Copy size={16} />
                </button>
              </h1>
            </div>
          </div>

          <div className="order-detail-header-right">
            <div className="order-header-date">
              {formatDisplayDate(order.createdAt)}
            </div>
            <span className="order-status-badge">
              {order.status}
            </span>
          </div>
        </div>

        {/* Main 2-Column Grid Layout */}
        <div className="order-detail-grid">
          {/* Left Column (Cards 1, 2, 3) */}
          <div className="order-col-left">
            {/* Card 1: Thông tin người nhận */}
            <div className="order-card">
              <div className="order-card-header">
                <div className="order-card-header-icon">
                  <User size={15} />
                </div>
                <h3 className="order-card-header-title">Thông tin người nhận</h3>
              </div>

              <div className="order-card-body">
                <div className="order-address-text">
                  {order.address}, {order.region}
                </div>

                <div className="order-contact-row">
                  <span className="order-contact-name">
                    {order.name} - {showPhoneReceiver ? '0331126429' : order.phone}
                  </span>
                  <button
                    type="button"
                    className="order-icon-badge-btn"
                    onClick={() => setShowPhoneReceiver(!showPhoneReceiver)}
                    title={showPhoneReceiver ? 'Ẩn số điện thoại' : 'Xem đầy đủ số điện thoại'}
                  >
                    {showPhoneReceiver ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Chi tiết hàng gửi */}
            <div className="order-card">
              <div className="order-card-header">
                <div className="order-card-header-icon">
                  <Package size={15} />
                </div>
                <h3 className="order-card-header-title">Chi tiết hàng gửi</h3>
              </div>

              <div className="order-card-body">
                <div className="order-info-group">
                  <span className="order-field-label">Tên sản phẩm</span>
                  <span className="order-field-val-bold">{order.product}</span>
                </div>

                <div className="order-card-divider" />

                <div className="order-info-group">
                  <span className="order-field-label">Ghi chú</span>
                  <span className="order-field-val-note">
                    {order.note || 'Khách không nhận vui lòng thu 30k phí giao hàng. Cảm ơn!'}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: Thông tin người gửi */}
            <div className="order-card">
              <div className="order-card-header">
                <div className="order-card-header-icon">
                  <Store size={15} />
                </div>
                <h3 className="order-card-header-title">Thông tin người gửi</h3>
              </div>

              <div className="order-card-body">
                <div className="order-address-text">
                  25 Hồ Mễ Trì, Phường Mễ Trì, Quận Nam Từ Liêm, Thành phố Hà Nội
                </div>

                <div className="order-contact-row">
                  <span className="order-contact-name">
                    Raspberry Pi VN | Raspberry Pi VN - {showPhoneSender ? '0928123688' : '092****688'}
                  </span>
                  <button
                    type="button"
                    className="order-icon-badge-btn"
                    onClick={() => setShowPhoneSender(!showPhoneSender)}
                    title={showPhoneSender ? 'Ẩn số điện thoại' : 'Xem đầy đủ số điện thoại'}
                  >
                    {showPhoneSender ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Cards 1, 2, 3, 4) */}
          <div className="order-col-right">
            {/* Card 1: Theo dõi đơn hàng */}
            <div className="order-card">
              <div className="order-card-header">
                <div className="order-card-header-icon">
                  <MapPin size={15} />
                </div>
                <h3 className="order-card-header-title">Theo dõi đơn hàng</h3>
              </div>

              <div className="order-card-body">
                <div className="order-tracking-timeline">
                  {/* Step 1: Active current */}
                  <div className="timeline-item">
                    <div className="timeline-indicator-col">
                      <div className="timeline-node-active">
                        <Truck size={14} color="white" />
                      </div>
                      <div className="timeline-line-active" />
                    </div>
                    <div className="timeline-box">
                      <div className="timeline-date">12/09/2026 • 11:26</div>
                      <div className="timeline-status-active">Chờ Lấy Hàng</div>
                      <div className="timeline-location">Quận Nam Từ Liêm, Thành phố Hà Nội</div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="timeline-item">
                    <div className="timeline-indicator-col">
                      <div className="timeline-node-ring" />
                    </div>
                    <div className="timeline-box">
                      <div className="timeline-date">12/09/2026 • 11:26</div>
                      <div className="timeline-status-done">Đã Tiếp Nhận</div>
                      <div className="timeline-location">Quận Nam Từ Liêm, Thành phố Hà Nội</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Phí và tiền thu hộ */}
            <div className="order-card">
              <div className="order-card-header">
                <div className="order-card-header-icon">
                  <Receipt size={15} />
                </div>
                <h3 className="order-card-header-title">Phí và tiền thu hộ</h3>
              </div>

              <div className="order-card-body">
                <div className="fee-table">
                  <div className="fee-row">
                    <span className="fee-label-with-icon">
                      Trị giá hàng <Info size={13} className="fee-info-icon" />
                    </span>
                    <span className="fee-val-strong">{money(order.value || 200000)}</span>
                  </div>

                  <div className="fee-row">
                    <span>Khối lượng</span>
                    <span className="fee-val-strong">{order.weight || 750} gr</span>
                  </div>

                  <div className="fee-divider" />

                  <div className="fee-row">
                    <span>Phí giao hàng (Người gửi trả)</span>
                    <span className="fee-val-red">30.000 đ</span>
                  </div>

                  <div className="fee-row">
                    <span>Phí bảo hiểm</span>
                    <span className="fee-val-red">0 đ</span>
                  </div>

                  <div className="fee-row">
                    <span>Phí trả hàng</span>
                    <span className="fee-val-red">0 đ</span>
                  </div>

                  <div className="fee-row">
                    <span>Phí hàng đổi</span>
                    <span className="fee-val-red">0 đ</span>
                  </div>

                  <div className="fee-row">
                    <span>Phí đổi địa chỉ</span>
                    <span className="fee-val-red">0 đ</span>
                  </div>

                  <div className="fee-row">
                    <span>Phí thu hộ</span>
                    <span className="fee-val-red">0 đ</span>
                  </div>

                  <div className="fee-divider" />

                  <div className="fee-row">
                    <span className="fee-label-with-icon">
                      Tổng phí vận chuyển <Info size={13} className="fee-info-icon" />
                    </span>
                    <span className="fee-val-green">30.000 đ</span>
                  </div>

                  <div className="fee-row">
                    <span>Tiền thu hộ</span>
                    <span className="fee-val-strong">{money(order.cod || 200000)}</span>
                  </div>

                  <div className="fee-row fee-row-total">
                    <span className="fee-label-with-icon">
                      Tiền thu người nhận <Info size={13} className="fee-info-icon" />
                    </span>
                    <span className="fee-val-red-big">{money(order.cod || 200000)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Đánh giá trải nghiệm */}
            <div className="order-card">
              <div className="order-card-header">
                <div className="order-card-header-icon">
                  <Star size={15} />
                </div>
                <h3 className="order-card-header-title">Đánh giá trải nghiệm</h3>
              </div>

              <div className="order-card-body" style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
                <div className="rating-stars-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="star-btn"
                      onClick={() => {
                        setRating(star);
                        notify(`Cảm ơn bạn đã đánh giá ${star} sao!`);
                      }}
                    >
                      <Star
                        size={22}
                        fill={star <= rating ? '#f59e0b' : 'none'}
                        color={star <= rating ? '#f59e0b' : '#cbd5e1'}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 4: Mã QR / Mã Vạch */}
            <div className="order-card">
              <div className="order-card-header">
                <div className="order-card-header-icon">
                  <QrCode size={15} />
                </div>
                <h3 className="order-card-header-title">Mã QR / Mã Vạch</h3>
              </div>

              <div className="order-card-body" style={{ textAlign: 'center', padding: '12px 0 8px' }}>
                <SvgQrCode />
                <SvgBarcode code={order.id} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Toolbar */}
      <div className="detail-bottom-toolbar">
        <button
          type="button"
          className="btn-toolbar-action"
          onClick={() => navigate(`/create?copy=${order.id}`)}
        >
          <RotateCcw size={15} color="#ef4444" />
          <span>Tạo lại đơn</span>
        </button>

        <button
          type="button"
          className="btn-toolbar-action"
          onClick={() => setShowSupportModal(true)}
        >
          <MessageSquare size={15} color="#ef4444" />
          <span>Gửi yêu cầu</span>
        </button>

        <button
          type="button"
          className="btn-toolbar-action"
          onClick={() => navigate(`/create?edit=${order.id}`)}
        >
          <Pencil size={15} color="#ef4444" />
          <span>Chỉnh sửa</span>
        </button>

        <button
          type="button"
          className="btn-toolbar-action"
          onClick={() => setShowEditCodModal(true)}
        >
          <DollarSign size={15} color="#ef4444" />
          <span>Sửa COD</span>
        </button>

        <button
          type="button"
          className="btn-toolbar-action"
          onClick={() => setShowEditInfoModal(true)}
        >
          <FileEdit size={15} color="#ef4444" />
          <span>Sửa thông tin</span>
        </button>

        <button
          type="button"
          className="btn-toolbar-action btn-cancel"
          onClick={() => setShowCancelModal(true)}
        >
          <XCircle size={15} color="#ef4444" />
          <span>Hủy đơn</span>
        </button>

        <button
          type="button"
          className="btn-blue-action"
          onClick={() => setShowPrintModal(true)}
        >
          <Printer size={15} />
          <span>In tem dán</span>
        </button>
      </div>

      {/* Support Dialog */}
      {showSupportModal && (
        <SupportDialog order={order} onClose={() => setShowSupportModal(false)} />
      )}

      {/* Cancel Order Dialog */}
      {showCancelModal && (
        <Modal
          title="Hủy đơn hàng"
          onClose={() => setShowCancelModal(false)}
          footer={
            <>
              <Button onClick={() => setShowCancelModal(false)}>Quay lại</Button>
              <Button
                variant="primary"
                onClick={() => {
                  cancelOrder(order.id);
                  setShowCancelModal(false);
                  notify(`Đã gửi yêu cầu hủy đơn hàng ${order.id}.`);
                }}
              >
                Xác nhận hủy đơn
              </Button>
            </>
          }
        >
          Bạn có chắc chắn muốn gửi yêu cầu hủy đơn hàng <b>{order.id}</b>?
        </Modal>
      )}

      {/* Print Template Modal */}
      {showPrintModal && (
        <Modal
          title={`In tem dán đơn hàng: ${order.id}`}
          onClose={() => setShowPrintModal(false)}
          footer={
            <>
              <Button onClick={() => setShowPrintModal(false)}>Đóng</Button>
              <Button
                variant="primary"
                onClick={() => {
                  window.print();
                  markPrinted([order.id]);
                  setShowPrintModal(false);
                }}
              >
                In tem ngay
              </Button>
            </>
          }
        >
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <p>Chuẩn bị in tem khổ <b>K46 (4 in x 6 in)</b> cho đơn hàng {order.id}</p>
          </div>
        </Modal>
      )}

      {/* Edit COD Modal */}
      {showEditCodModal && (
        <Modal
          title="Yêu cầu sửa tiền thu hộ (COD)"
          onClose={() => setShowEditCodModal(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowEditCodModal(false);
              notify('Đã gửi yêu cầu thay đổi tiền COD thành công!');
            }}
            style={{ display: 'grid', gap: 14 }}
          >
            <label className="field">
              <span>Tiền COD hiện tại</span>
              <input value={money(order.cod)} disabled />
            </label>
            <label className="field">
              <span>Tiền COD mới mong muốn (VNĐ) *</span>
              <input placeholder="Nhập số tiền COD mới..." required defaultValue={order.cod} />
            </label>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
              <Button type="button" onClick={() => setShowEditCodModal(false)}>Hủy</Button>
              <Button type="submit" variant="primary">Lưu yêu cầu</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Info Modal */}
      {showEditInfoModal && (
        <Modal
          title="Yêu cầu sửa thông tin đơn hàng"
          onClose={() => setShowEditInfoModal(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowEditInfoModal(false);
              notify('Đã gửi yêu cầu điều chỉnh thông tin đơn thành công!');
            }}
            style={{ display: 'grid', gap: 14 }}
          >
            <label className="field">
              <span>Tên người nhận</span>
              <input defaultValue={order.name} />
            </label>
            <label className="field">
              <span>Số điện thoại người nhận</span>
              <input defaultValue={order.phone} />
            </label>
            <label className="field">
              <span>Ghi chú giao hàng mới</span>
              <textarea rows={2} defaultValue={order.note} />
            </label>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
              <Button type="button" onClick={() => setShowEditInfoModal(false)}>Hủy</Button>
              <Button type="submit" variant="primary">Lưu thay đổi</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
