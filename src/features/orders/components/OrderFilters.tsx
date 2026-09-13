import { useState, useEffect } from 'react';
import { Field } from '@/shared/ui/Field';
import { Button } from '@/shared/ui/Button';
import { CustomSelect } from '@/shared/ui/CustomSelect';
import { emptyFilters, type ActorRole, type OrderFilters as Filters } from '../model/types';
import { isGroupAllowed, ROLE_LABELS } from '../model/order-filter-matrix';
import { RotateCcw, Search, Calendar } from 'lucide-react';

const INTERNAL_ROLES: ActorRole[] = ['cskh', 'ops', 'sales', 'finance', 'admin'];

const SHOP_OPTIONS = [
  { value: '', label: 'Tất cả các Shop' },
  { value: 'S983262', label: 'S983262 - SUPERSHIP TEST' },
  { value: 'S102948', label: 'S102948 - RASPBERRY PI VN' },
  { value: 'S551029', label: 'S551029 - MỸ PHẨM CHÍNH HÃNG' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'Chờ Lấy Hàng', label: 'Chờ Lấy Hàng' },
  { value: 'Đang giao hàng', label: 'Đang giao hàng' },
  { value: 'Hoãn giao hàng', label: 'Hoãn giao hàng' },
  { value: 'Đã giao hàng', label: 'Đã giao hàng' },
  { value: 'Đang chuyển hoàn', label: 'Đang chuyển hoàn' },
  { value: 'Đã trả hàng', label: 'Đã trả hàng' },
  { value: 'Đã hủy', label: 'Đã hủy' },
];

const CARRIER_OPTIONS = [
  { value: '', label: 'Tất cả NVC' },
  { value: 'supership', label: 'SuperShip Express' },
  { value: 'ghtk', label: 'Giao Hàng Tiết Kiệm' },
  { value: 'ghn', label: 'Giao Hàng Nhanh' },
  { value: 'vtp', label: 'Viettel Post' },
];

const PRICE_ACCOUNT_OPTIONS = [
  { value: '', label: 'Tất cả loại tài khoản' },
  { value: 'shared', label: 'Hợp đồng Chung (SuperPlatform)' },
  { value: 'private', label: 'Hợp đồng Riêng (Shop tự ký)' },
];

const TIME_PRESETS = [
  { value: '7', label: '7 ngày trước (08/09/2026 - 14/09/2026)' },
  { value: '1', label: 'Hôm nay (14/09/2026)' },
  { value: 'yesterday', label: 'Hôm qua (13/09/2026)' },
  { value: 'dayBeforeYesterday', label: 'Hôm kia (12/09/2026)' },
  { value: '30', label: '30 ngày trước (16/08/2026 - 14/09/2026)' },
  { value: '', label: 'Tất cả thời gian' },
];

export function OrderFilters({
  initial,
  isInternal = false,
  onApply,
}: {
  initial: Filters;
  isInternal?: boolean;
  onApply: (filters: Filters) => void;
}) {
  const [draft, setDraft] = useState<Filters>(initial);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');

  // Synchronize filter role when switching header mode
  useEffect(() => {
    if (!isInternal) {
      if (draft.role !== 'shop') {
        const updated = { ...draft, role: 'shop' as ActorRole };
        setDraft(updated);
        onApply(updated);
      }
    } else {
      if (draft.role === 'shop') {
        const updated = { ...draft, role: 'cskh' as ActorRole };
        setDraft(updated);
        onApply(updated);
      }
    }
  }, [isInternal]);

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const role = isInternal ? (draft.role === 'shop' ? 'cskh' : draft.role) : 'shop';

  const handleRoleChange = (newRole: ActorRole) => {
    const updated = { ...emptyFilters, role: newRole };
    setDraft(updated);
    onApply(updated);
  };

  return (
    <section className="card body order-filters-section">
      {/* Top Header */}
      <div className="role-selector-header">
        <div className="role-title-group">
          <h2>Bộ lọc đơn hàng</h2>
        </div>

        {/* Display Internal Role Tabs ONLY when in Internal Mode */}
        {isInternal && (
          <div className="role-buttons-grid">
            {INTERNAL_ROLES.map((rKey) => (
              <button
                key={rKey}
                type="button"
                className={`btn-role-tab ${role === rKey ? 'active' : ''}`}
                onClick={() => handleRoleChange(rKey)}
              >
                {ROLE_LABELS[rKey].label}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        className="filters-form-wrapper"
        onSubmit={(e) => {
          e.preventDefault();
          onApply(draft);
        }}
      >
        {/* Basic Row */}
        <div className="filters-main-grid">
          {/* Identity Group */}
          {isGroupAllowed(role, 'identity') && (
            <div>
              <Field
                label="Mã Đơn SuperPlatform"
                placeholder="Ví dụ: 826883962104..."
                value={draft.id}
                onChange={(e) => set('id', e.target.value)}
              />
              <Field
                label="SĐT Người Nhận"
                placeholder="Số điện thoại"
                value={draft.phone}
                onChange={(e) => set('phone', e.target.value)}
              />
              <Field
                label="Mã đơn của Shop"
                placeholder="Mã đơn riêng"
                value={draft.privateId}
                onChange={(e) => set('privateId', e.target.value)}
              />
            </div>
          )}

          {/* Shop Select & Source Channel (Only for Internal Roles) */}
          {isGroupAllowed(role, 'shop_select') ? (
            <div>
              <CustomSelect
                label="Shop quản lý (Nội bộ)"
                value={draft.shopId}
                onChange={(val) => set('shopId', val)}
                options={SHOP_OPTIONS}
              />
              <Field
                label="Mã Tải Đơn Hàng Loạt"
                placeholder="Mã file import"
                value={draft.batchId}
                onChange={(e) => set('batchId', e.target.value)}
              />
              <Field
                label="Mã Vận Đơn NVC"
                placeholder="Mã vận đơn NVC"
                value={draft.carrierWaybill}
                onChange={(e) => set('carrierWaybill', e.target.value)}
              />
            </div>
          ) : (
            <div>
              <Field
                label="Mã Tải Đơn Hàng Loạt"
                placeholder="Mã file import"
                value={draft.batchId}
                onChange={(e) => set('batchId', e.target.value)}
              />
              <Field
                label="Mã Đối Soát"
                placeholder="Mã đối soát"
                value={draft.reconciliationId}
                onChange={(e) => set('reconciliationId', e.target.value)}
              />
            </div>
          )}

          {/* Status & Time */}
          <div>
            {isGroupAllowed(role, 'order_status') && (
              <CustomSelect
                label="Trạng thái Order SPF"
                value={draft.status}
                onChange={(val) => set('status', val)}
                options={STATUS_OPTIONS}
              />
            )}

            {isGroupAllowed(role, 'time') && (
              <CustomSelect
                label="Thời gian"
                icon={Calendar}
                value={draft.days || '7'}
                onChange={(val) => set('days', val)}
                options={TIME_PRESETS}
              />
            )}
          </div>
        </div>

        {/* Collapsible Advanced Filters Row */}
        <div className="advanced-filter-toggle-bar">
          <button
            type="button"
            className="btn-toggle-advanced"
            onClick={() => setActiveTab(activeTab === 'basic' ? 'advanced' : 'basic')}
          >
            {activeTab === 'basic'
              ? '▶ Hiện bộ lọc nâng cao chuyên sâu'
              : '▼ An toàn bộ lọc nâng cao'}
          </button>
        </div>

        {activeTab === 'advanced' && (
          <div className="advanced-filters-panel">
            {/* Recipient & Location Group */}
            {isGroupAllowed(role, 'recipient') && (
              <div className="filter-group-card">
                <h4>Người Nhận & Địa Chỉ</h4>
                <div className="group-fields-row">
                  <Field
                    label="Tên Người Nhận"
                    placeholder="Tên người nhận"
                    value={draft.recipientName}
                    onChange={(e) => set('recipientName', e.target.value)}
                  />
                  <Field
                    label="Khu Vực Giao"
                    placeholder="Tỉnh/Thành, Quận/Huyện"
                    value={draft.recipientRegion}
                    onChange={(e) => set('recipientRegion', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Carrier & Routing (Ops & Admin) */}
            {isGroupAllowed(role, 'carrier') && (
              <div className="filter-group-card">
                <h4>Nhà Vận Chuyển & Chặng</h4>
                <div className="group-fields-row">
                  <CustomSelect
                    label="NVC Giao"
                    value={draft.carrierDelivery}
                    onChange={(val) => set('carrierDelivery', val)}
                    options={CARRIER_OPTIONS}
                  />

                  {isGroupAllowed(role, 'external_routing') && (
                    <label className="choice-box-inline">
                      <input
                        type="checkbox"
                        checked={draft.isExternalRouted}
                        onChange={(e) => set('isExternalRouted', e.target.checked)}
                      />
                      <span>Đơn Chuyển Ngoài (NVC chặng Giao tạo muộn)</span>
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* Price Account & COD (Finance & Admin) */}
            {isGroupAllowed(role, 'price_account') && (
              <div className="filter-group-card">
                <h4>Tài Khoản Giá & Hợp Đồng (Kế toán / Kinh doanh)</h4>
                <div className="group-fields-row">
                  <CustomSelect
                    label="Loại Tài Khoản Giá"
                    value={draft.priceAccountType}
                    onChange={(val) => set('priceAccountType', val)}
                    options={PRICE_ACCOUNT_OPTIONS}
                  />
                </div>
              </div>
            )}

            {/* Ops Anomaly (Ops & Admin) */}
            {isGroupAllowed(role, 'ops_anomaly') && (
              <div className="filter-group-card alert-bg">
                <h4>Bất Thường Vận Hành (Vận hành / CSKH)</h4>
                <div className="group-checkboxes-grid">
                  <label className="choice">
                    <input
                      type="checkbox"
                      checked={draft.hasOpsAnomaly}
                      onChange={(e) => set('hasOpsAnomaly', e.target.checked)}
                    />
                    <span>Không cập nhật &gt; 24 giờ</span>
                  </label>

                  <label className="choice">
                    <input
                      type="checkbox"
                      checked={draft.anomalyStatusMismatch}
                      onChange={(e) => set('anomalyStatusMismatch', e.target.checked)}
                    />
                    <span>NVC báo giao thành công nhưng SPF chưa đổi</span>
                  </label>

                  <label className="choice">
                    <input
                      type="checkbox"
                      checked={draft.anomalyBusinessError}
                      onChange={(e) => set('anomalyBusinessError', e.target.checked)}
                    />
                    <span>Đơn có lỗi nghiệp vụ / Lấy thất bại</span>
                  </label>
                </div>
              </div>
            )}

            {/* Standard Checkbox Flags */}
            <div className="filter-group-card">
              <div className="option-line">
                <span>Lấy hàng</span>
                <label className="choice">
                  <input
                    type="checkbox"
                    checked={draft.picked}
                    onChange={(e) => set('picked', e.target.checked)}
                  />
                  Đã lấy
                </label>
                <label className="choice">
                  <input
                    type="checkbox"
                    checked={draft.unpicked}
                    onChange={(e) => set('unpicked', e.target.checked)}
                  />
                  Chưa lấy
                </label>
              </div>

              <div className="option-line">
                <span>Người trả phí</span>
                <label className="choice">
                  <input
                    type="checkbox"
                    checked={draft.sender}
                    onChange={(e) => set('sender', e.target.checked)}
                  />
                  Người gửi
                </label>
                <label className="choice">
                  <input
                    type="checkbox"
                    checked={draft.recipient}
                    onChange={(e) => set('recipient', e.target.checked)}
                  />
                  Người nhận
                </label>
              </div>

              <div className="option-line">
                <span>In đơn</span>
                <label className="choice">
                  <input
                    type="checkbox"
                    checked={draft.unprinted}
                    onChange={(e) => set('unprinted', e.target.checked)}
                  />
                  Chưa in
                </label>
                <label className="choice">
                  <input
                    type="checkbox"
                    checked={draft.printed}
                    onChange={(e) => set('printed', e.target.checked)}
                  />
                  Đã in
                </label>
              </div>

              <div className="option-line">
                <span>Sắp xếp</span>
                {(['new', 'old'] as const).map((s) => (
                  <label className="choice" key={s}>
                    <input
                      type="radio"
                      name="sortOrder"
                      checked={draft.sort === s}
                      onChange={() => set('sort', s)}
                    />
                    {s === 'new' ? 'Mới nhất' : 'Cũ nhất'}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="filters-actions-footer">
          <Button
            type="button"
            className="btn-soft-grey"
            onClick={() => {
              const reset: Filters = { ...emptyFilters, role: role as ActorRole };
              setDraft(reset);
              onApply(reset);
            }}
          >
            <RotateCcw size={15} /> Đặt lại
          </Button>

          <Button type="submit" variant="primary" style={{ borderRadius: 9999, padding: '10px 24px' }}>
            <Search size={15} /> Tìm kiếm
          </Button>
        </div>
      </form>
    </section>
  );
}
