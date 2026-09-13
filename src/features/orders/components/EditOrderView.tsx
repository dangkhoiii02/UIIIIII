import { useState } from 'react';
import {
  ChevronLeft,
  Copy,
  UserRound,
  Phone,
  MapPin,
  Info,
  X,
  Banknote,
  DollarSign,
  FileText,
  Clipboard,
  Calculator,
  ChevronDown,
} from 'lucide-react';
import { useToast } from '@/shared/ui/toast-context';
import { money } from '@/shared/lib/format';
import type { Order, OrderInput } from '../model/types';
import { billableWeight } from '../model/order';

interface EditOrderViewProps {
  order: Order;
  onSave: (updated: OrderInput) => void;
  onBack: () => void;
}

const REGION_OPTIONS = [
  'Phường Bình Định / Thị xã An Nhơn / Tỉnh Bình Định',
  'Hà Nội · Nam Từ Liêm · Mễ Trì',
  'TP. Hồ Chí Minh · Tân Bình · Phường 13',
  'Bình Định · An Nhơn · Bình Định',
  'Đà Nẵng · Hải Châu · Hòa Cường Bắc',
];

export function EditOrderView({ order, onSave, onBack }: EditOrderViewProps) {
  const notify = useToast();
  const [formData, setFormData] = useState<OrderInput>({
    name: order.name,
    phone: order.phone,
    address: order.address,
    region: order.region || REGION_OPTIONS[0] || '',
    product: order.product,
    weight: order.weight,
    value: order.value,
    cod: order.cod,
    length: order.length,
    width: order.width,
    height: order.height,
    privateId: order.privateId,
    note: order.note,
    payer: order.payer || 'sender',
    inspection: order.inspection || 'view',
    returnGoods: order.returnGoods || false,
  });

  const update = (patch: Partial<OrderInput>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(order.id);
    notify(`Đã sao chép mã đơn ${order.id}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    notify('Đã cập nhật thông tin đơn hàng!');
    onBack();
  };

  const currentWeight = billableWeight(formData) || formData.weight || 750;
  const shippingFee = 30000;
  const isSenderPay = formData.payer === 'sender';

  return (
    <div className="edit-order-page">
      {/* Header */}
      <div className="edit-order-header">
        <button type="button" className="btn-back" onClick={onBack} title="Quay lại">
          <ChevronLeft size={20} />
        </button>
        <div className="edit-order-title-group">
          <span className="edit-order-sub">Sửa đơn hàng</span>
          <div className="edit-order-id-row">
            <h1 className="edit-order-id">{order.id}</h1>
            <button type="button" className="btn-icon-copy" onClick={handleCopyId} title="Sao chép mã đơn">
              <Copy size={16} />
            </button>
          </div>
        </div>
        <div className="edit-order-meta">
          <span className="edit-order-date">{order.createdAt || '12/09/2026 • 11:26'}</span>
          <span className="edit-order-status-badge">{order.status || 'Chờ Lấy Hàng'}</span>
        </div>
      </div>

      {/* Main Grid */}
      <form onSubmit={handleSubmit} className="edit-order-grid">
        {/* Left Column: Thông tin người nhận */}
        <div className="edit-card left-card">
          <div className="edit-card-header">
            <div className="edit-card-icon-circle pink">
              <UserRound size={18} color="#ed1045" />
            </div>
            <h2>Thông tin người nhận</h2>
          </div>

          <div className="edit-card-body">
            {/* Phone & Name Row */}
            <div className="input-grid-2">
              <div className="edit-field">
                <div className="edit-field-label">
                  <span>
                    Số điện thoại <span className="red">*</span>
                  </span>
                  <span className="secure-tag">An toàn</span>
                </div>
                <div className="styled-input-box">
                  <Phone size={16} className="input-icon-left" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => update({ phone: e.target.value })}
                    required
                  />
                  <Info size={14} className="input-icon-right muted" />
                  {formData.phone && (
                    <button
                      type="button"
                      className="btn-clear"
                      onClick={() => update({ phone: '' })}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="edit-field">
                <div className="edit-field-label">
                  <span>
                    Tên người nhận <span className="red">*</span>
                  </span>
                </div>
                <div className="styled-input-box">
                  <UserRound size={16} className="input-icon-left" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => update({ name: e.target.value })}
                    required
                  />
                  {formData.name && (
                    <button
                      type="button"
                      className="btn-clear"
                      onClick={() => update({ name: '' })}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Address Row */}
            <div className="edit-field">
              <div className="edit-field-label">
                <span>
                  Địa chỉ chi tiết <Info size={14} className="inline-info-icon" />{' '}
                  <span className="red">*</span>
                </span>
              </div>
              <div className="styled-input-box">
                <MapPin size={16} className="input-icon-left" />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => update({ address: e.target.value })}
                  required
                />
                {formData.address && (
                  <button
                    type="button"
                    className="btn-clear"
                    onClick={() => update({ address: '' })}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Region Select */}
            <div className="edit-field">
              <div className="edit-field-label">
                <span>
                  Khu vực <span className="red">*</span>
                </span>
              </div>
              <div className="styled-input-box select-box">
                <MapPin size={16} className="input-icon-left" />
                <select
                  value={formData.region}
                  onChange={(e) => update({ region: e.target.value })}
                  required
                >
                  {REGION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="input-icon-right muted" />
              </div>
            </div>

            {/* Value & COD Row */}
            <div className="input-grid-2">
              <div className="edit-field">
                <div className="edit-field-label">
                  <span>
                    Giá trị <Info size={14} className="inline-info-icon" />{' '}
                    <span className="red">*</span>
                  </span>
                </div>
                <div className="styled-input-box">
                  <Banknote size={16} className="input-icon-left" />
                  <input
                    type="number"
                    value={formData.value || ''}
                    onChange={(e) => update({ value: Number(e.target.value) })}
                    required
                  />
                  <span className="currency-unit">đ</span>
                  {formData.value > 0 && (
                    <button
                      type="button"
                      className="btn-clear"
                      onClick={() => update({ value: 0 })}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="edit-field">
                <div className="edit-field-label">
                  <span>
                    Thu hộ <span className="red">*</span>
                  </span>
                </div>
                <div className="styled-input-box">
                  <DollarSign size={16} className="input-icon-left" />
                  <input
                    type="number"
                    value={formData.cod || ''}
                    onChange={(e) => update({ cod: Number(e.target.value) })}
                    required
                  />
                  <span className="currency-unit">đ</span>
                  {formData.cod > 0 && (
                    <button
                      type="button"
                      className="btn-clear"
                      onClick={() => update({ cod: 0 })}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Note Textarea */}
            <div className="edit-field">
              <div className="edit-field-label">
                <span>Ghi chú khi giao</span>
              </div>
              <div className="styled-textarea-box">
                <FileText size={16} className="textarea-icon-left" />
                <textarea
                  value={formData.note}
                  onChange={(e) => update({ note: e.target.value })}
                  maxLength={120}
                  rows={3}
                />
                {formData.note && (
                  <button
                    type="button"
                    className="btn-clear textarea-clear"
                    onClick={() => update({ note: '' })}
                  >
                    <X size={14} />
                  </button>
                )}
                <button
                  type="button"
                  className="btn-template-icon"
                  title="Mẫu ghi chú"
                  onClick={() =>
                    update({
                      note: 'Khách không nhận vui lòng thu 30k phí giao hàng. Cảm ơn!',
                    })
                  }
                >
                  <Clipboard size={16} />
                </button>
              </div>
              <div className="char-count">{formData.note.length} / 120 ký tự</div>
            </div>
          </div>
        </div>

        {/* Right Column: Phí và tiền thu hộ */}
        <div className="edit-card right-card">
          <div className="edit-card-header">
            <div className="edit-card-icon-circle pink">
              <Calculator size={18} color="#ed1045" />
            </div>
            <h2>Phí và tiền thu hộ</h2>
          </div>

          <div className="edit-card-body">
            {/* Payer Option */}
            <div className="payer-option-section">
              <span className="option-label">Phương án trả phí</span>
              <div className="payer-radios">
                <label className="radio-item">
                  <input
                    type="radio"
                    name="payer"
                    checked={isSenderPay}
                    onChange={() => update({ payer: 'sender' })}
                  />
                  <span>Người gửi</span>
                </label>

                <label className="radio-item">
                  <input
                    type="radio"
                    name="payer"
                    checked={!isSenderPay}
                    onChange={() => update({ payer: 'recipient' })}
                  />
                  <span>
                    Người nhận <Info size={13} className="inline-info-icon" />
                  </span>
                </label>
              </div>
            </div>

            {/* Fee Details List */}
            <div className="fee-details-list">
              <div className="fee-line">
                <span>Giá trị hàng hóa</span>
                <strong>{money(formData.value || 0)}</strong>
              </div>

              <div className="fee-line">
                <span>
                  Khối lượng tính cước <Info size={13} className="inline-info-icon" />
                </span>
                <strong>{currentWeight} gr</strong>
              </div>

              <div className="fee-line">
                <span>Phí giao hàng ({isSenderPay ? 'Người gửi trả' : 'Người nhận trả'})</span>
                <strong>{money(shippingFee)}</strong>
              </div>

              <div className="fee-line">
                <span>Phí bảo hiểm</span>
                <strong>0 đ</strong>
              </div>

              <div className="fee-line">
                <span>Phí hàng đổi</span>
                <strong>0 đ</strong>
              </div>

              <div className="fee-line">
                <span>Phí thu hộ</span>
                <strong>0 đ</strong>
              </div>

              <div className="fee-divider-dashed" />

              <div className="fee-line total-ship">
                <span>
                  Tổng phí vận chuyển <Info size={13} className="inline-info-icon" />
                </span>
                <strong className="green-text">{money(shippingFee)}</strong>
              </div>

              <div className="fee-line">
                <span>Tiền thu hộ</span>
                <strong>{money(formData.cod || 0)}</strong>
              </div>

              <div className="fee-line recipient-total">
                <span>
                  Tiền thu người nhận <Info size={13} className="inline-info-icon" />
                </span>
                <strong className="red-text">
                  {money(isSenderPay ? formData.cod : (formData.cod || 0) + shippingFee)}
                </strong>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-update-order">
              Cập nhật
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
