import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  FileText,
  MapPin,
  Phone,
  Search,
  Store,
  Truck,
  UserRound,
} from 'lucide-react';
import { Field } from '@/shared/ui/Field';
import { CustomSelect, type SelectOption } from '@/shared/ui/CustomSelect';
import { emptyFilters, type ActorRole, type OrderFilters as Filters } from '../model/types';
import { isGroupAllowed, type FilterGroupKey } from '../model/order-filter-matrix';
import { SPF_STATUS_CATALOG } from '../model/spf-status-catalog';

const STATUS_OPTIONS: SelectOption[] = [
  { value: '', label: 'Tất cả trạng thái' },
  ...SPF_STATUS_CATALOG.map((item) => ({
    value: item.name,
    label: `${item.code} · ${item.name}`,
  })),
];

const STATUS_GROUP_OPTIONS: SelectOption[] = [
  { value: '', label: 'Tất cả nhóm trạng thái' },
  { value: 'waiting', label: 'Chờ xử lý / lấy hàng' },
  { value: 'shipping', label: 'Đang vận chuyển' },
  { value: 'return', label: 'Hoàn / trả hàng' },
  { value: 'completed', label: 'Đã kết thúc' },
];

const CARRIER_OPTIONS: SelectOption[] = [
  { value: '', label: 'Tất cả nhà vận chuyển' },
  { value: 'supership', label: 'SuperShip' },
  { value: 'ghn', label: 'Giao Hàng Nhanh (GHN)' },
  { value: 'best', label: 'BEST Express' },
  { value: 'ghtk', label: 'Giao Hàng Tiết Kiệm' },
  { value: 'vtp', label: 'Viettel Post' },
];

const SOURCE_OPTIONS: SelectOption[] = [
  { value: '', label: 'Tất cả nguồn tạo' },
  { value: 'web', label: 'Trang web' },
  { value: 'app', label: 'Ứng dụng' },
  { value: 'api', label: 'Kết nối API' },
  { value: 'import', label: 'Nhập từ bảng tính' },
  { value: 'marketplace', label: 'Sàn thương mại điện tử' },
  { value: 'partner', label: 'Đối tác / hệ thống nguồn' },
];

const SERVICE_OPTIONS: SelectOption[] = [
  { value: '', label: 'Tất cả dịch vụ' },
  { value: 'standard', label: 'Tiêu chuẩn' },
  { value: 'express', label: 'Nhanh' },
  { value: 'economy', label: 'Tiết kiệm' },
];

const DISPATCH_OPTIONS: SelectOption[] = [
  { value: '', label: 'Tất cả phương thức gửi' },
  { value: 'pickup', label: 'Nhà vận chuyển đến lấy hàng' },
  { value: 'dropoff', label: 'Cửa hàng gửi tại điểm tiếp nhận' },
];

const TIME_FIELD_OPTIONS: SelectOption[] = [
  { value: 'createdAt', label: 'Ngày tạo đơn' },
  { value: 'updatedAt', label: 'Ngày cập nhật' },
  { value: 'pickupAt', label: 'Ngày lấy hàng' },
  { value: 'deliveryAt', label: 'Ngày giao hàng' },
  { value: 'returnConfirmedAt', label: 'Ngày xác nhận hoàn' },
  { value: 'returnedAt', label: 'Ngày trả hàng' },
];

const TIME_PRESETS: SelectOption[] = [
  { value: '', label: 'Tất cả thời gian' },
  { value: '1', label: 'Hôm nay' },
  { value: '7', label: '7 ngày gần nhất' },
  { value: '30', label: '30 ngày gần nhất' },
];

const DELIVERY_RESULT_OPTIONS: SelectOption[] = [
  { value: '', label: 'Tất cả kết quả giao' },
  { value: 'NONE', label: 'Chưa giao thành công' },
  { value: 'PARTIAL', label: 'Giao một phần' },
  { value: 'FULL', label: 'Giao toàn bộ' },
];

const BUSINESS_TYPE_OPTIONS: SelectOption[] = [
  { value: '', label: 'Tất cả loại nghiệp vụ' },
  { value: 'STANDARD', label: 'Giao thông thường' },
  { value: 'PARTIAL', label: 'Giao một phần' },
  { value: 'EXCHANGE', label: 'Đổi trả' },
  { value: 'RETURN', label: 'Có phát sinh hoàn' },
];


const COD_PAYMENT_OPTIONS: SelectOption[] = [
  { value: '', label: 'Tất cả trạng thái tiền thu hộ' },
  { value: 'UNPAID', label: 'Tiền thu hộ chưa thanh toán' },
  { value: 'PROCESSING', label: 'Tiền thu hộ đang xử lý' },
  { value: 'PAID', label: 'Tiền thu hộ đã thanh toán' },
];

const PRICE_ACCOUNT_OPTIONS: SelectOption[] = [
  { value: '', label: 'Tất cả tài khoản giá' },
  { value: 'shared', label: 'Hợp đồng chung SuperPlatform' },
  { value: 'private', label: 'Hợp đồng riêng của Shop' },
];

const ADDRESS_FORMAT_OPTIONS: SelectOption[] = [
  { value: '', label: 'Tất cả định dạng địa chỉ' },
  { value: '2-level', label: 'Địa chỉ 2 cấp' },
  { value: '3-level', label: 'Địa chỉ 3 cấp' },
];

const PICKUP_PROGRESS_OPTIONS: SelectOption[] = [
  { value: '', label: 'Tất cả tiến trình lấy' },
  { value: 'unpicked', label: 'Chưa lấy hàng' },
  { value: 'picked', label: 'Đã lấy hàng' },
  { value: 'pickupFailed', label: 'Lấy hàng thất bại' },
];

const HANDOVER_PROGRESS_OPTIONS: SelectOption[] = [
  { value: '', label: 'Tất cả tiến trình bàn giao' },
  { value: 'handoverDone', label: 'Đã bàn giao' },
  { value: 'handoverFailed', label: 'Bàn giao thất bại' },
];

const DELIVERY_PROGRESS_OPTIONS: SelectOption[] = [
  { value: '', label: 'Tất cả tiến trình giao' },
  { value: 'delivered', label: 'Đã giao hàng' },
  { value: 'deliveryFailed', label: 'Giao hàng thất bại' },
];

const CANCEL_PROGRESS_OPTIONS: SelectOption[] = [
  { value: '', label: 'Tất cả trạng thái hủy' },
  { value: 'hasCancelRequest', label: 'Có yêu cầu hủy' },
  { value: 'cancelCarrierFailed', label: 'Hủy tại NVC lỗi' },
];

const PRINT_STATUS_OPTIONS: SelectOption[] = [
  { value: '', label: 'Tất cả trạng thái in' },
  { value: 'unprinted', label: 'Chưa in nhãn' },
  { value: 'printed', label: 'Đã in nhãn' },
];

const SPECIAL_BIZ_OPTIONS: SelectOption[] = [
  { value: '', label: 'Tất cả nghiệp vụ đặc biệt' },
  { value: 'hasReturn', label: 'Có phát sinh hoàn' },
  { value: 'hasPartialDelivery', label: 'Giao một phần' },
  { value: 'hasExchange', label: 'Có đổi / lấy hàng về' },
];

const CARRIER_STATUS_PICKUP_OPTIONS: SelectOption[] = [
  { value: '', label: 'Tất cả trạng thái NVC lấy' },
  { value: 'Chờ lấy', label: 'Chờ lấy hàng' },
  { value: 'Đang lấy', label: 'Đang lấy hàng' },
  { value: 'thất bại', label: 'Lấy hàng thất bại' },
  { value: 'Đã lấy', label: 'Đã lấy hàng' },
  { value: 'nhập kho', label: 'Đã nhập kho bưu cục lấy' },
];

const CARRIER_STATUS_DELIVERY_OPTIONS: SelectOption[] = [
  { value: '', label: 'Tất cả trạng thái NVC giao' },
  { value: 'trung chuyển', label: 'Đang trung chuyển' },
  { value: 'bưu cục giao', label: 'Đã đến kho / bưu cục giao' },
  { value: 'Đang giao', label: 'Đang giao hàng' },
  { value: 'giao thất bại', label: 'Giao hàng thất bại' },
  { value: 'Đã giao', label: 'Đã giao hàng thành công' },
];

const CARRIER_STATUS_RETURN_OPTIONS: SelectOption[] = [
  { value: '', label: 'Tất cả trạng thái NVC hoàn' },
  { value: 'xác nhận', label: 'Chờ / đã xác nhận hoàn' },
  { value: 'lấy hàng hoàn', label: 'Đang lấy hàng hoàn' },
  { value: 'chuyển hoàn', label: 'Đang chuyển hoàn' },
  { value: 'thất bại', label: 'Xử lý hoàn thất bại' },
];

const CARRIER_STATUS_FINAL_RETURN_OPTIONS: SelectOption[] = [
  { value: '', label: 'Tất cả trạng thái NVC trả cuối' },
  { value: 'kho trả', label: 'Đã đến kho trả cuối' },
  { value: 'Đang trả', label: 'Đang trả hàng' },
  { value: 'trả thất bại', label: 'Trả hàng thất bại' },
  { value: 'Đã trả', label: 'Đã trả hàng thành công' },
];

function FilterCheck({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="filter-choice-label">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

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
  const [collapsed, setCollapsed] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  // Màn hình Nội bộ hiện là giao diện tổng hợp, nên mặc định dùng tập quyền Admin.
  // Khi hệ thống truyền vai trò cụ thể, ma trận USECASE bên dưới sẽ tự giới hạn từng nhóm.
  const role: ActorRole = isInternal ? (draft.role === 'shop' ? 'admin' : draft.role) : 'shop';
  const can = (group: FilterGroupKey) => isGroupAllowed(role, group);
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    const nextRole: ActorRole = isInternal ? (draft.role === 'shop' ? 'admin' : draft.role) : 'shop';
    if (nextRole !== draft.role) {
      const updated = { ...draft, role: nextRole };
      setDraft(updated);
      onApply(updated);
    }
    // The mode switch is the only trigger; draft is intentionally preserved.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInternal]);

  const activeCount = useMemo(
    () =>
      Object.entries(draft).filter(([key, value]) => {
        if (['role', 'sort', 'timeField'].includes(key)) return false;
        return typeof value === 'boolean' ? value : value !== '';
      }).length,
    [draft],
  );

  const reset = () => {
    const value = { ...emptyFilters, role };
    setDraft(value);
    onApply(value);
  };

  return (
    <section className="card body order-filters-section">
      <div className="filter-card-header" onClick={() => setCollapsed((value) => !value)}>
        <div className="filter-card-title-wrap">
          <h2 className="filter-card-title">BỘ LỌC & TRA CỨU ĐƠN HÀNG</h2>
          {activeCount > 0 && <span className="filter-active-count">{activeCount} điều kiện</span>}
        </div>

        <button
          type="button"
          className="filter-collapse-btn"
          aria-label={collapsed ? 'Mở bộ lọc' : 'Thu gọn bộ lọc'}
        >
          {collapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
      </div>

      {!collapsed && (
        <form
          className="filters-form-wrapper"
          onSubmit={(event) => {
            event.preventDefault();
            onApply({ ...draft, role });
          }}
        >
          <div className="filters-basic-grid">
            <Field
              className="filter-span-2"
              label={isInternal ? 'Tra cứu toàn hệ thống' : 'Tra cứu nhanh'}
              placeholder={
                isInternal
                  ? 'Mã đơn hàng, mã đơn nguồn, mọi mã vận đơn, cửa hàng, người gửi hoặc người nhận'
                  : 'Mã đơn hàng, mã đơn cửa hàng, mã vận đơn, tên hoặc SĐT người nhận'
              }
              icon={Search}
              value={draft.query}
              onChange={(event) => set('query', event.target.value)}
            />
            {isInternal && (
              <Field
                label="Cửa hàng (mã, tên hoặc SĐT)"
                placeholder="S275518, AB Shop..."
                icon={Store}
                value={draft.shopId}
                onChange={(event) => set('shopId', event.target.value)}
              />
            )}
            <CustomSelect
              label="Trạng thái đơn hàng"
              icon={CheckSquare}
              value={draft.status}
              onChange={(value) => set('status', value)}
              options={STATUS_OPTIONS}
            />
            {isInternal && (
              <CustomSelect
                label="Nhóm trạng thái"
                value={draft.statusGroup}
                onChange={(value) => set('statusGroup', value)}
                options={STATUS_GROUP_OPTIONS}
              />
            )}
            <CustomSelect
              label="Nhà vận chuyển tham gia"
              icon={Truck}
              value={draft.carrierAny}
              onChange={(value) => set('carrierAny', value)}
              options={CARRIER_OPTIONS}
            />
            <CustomSelect
              label="Nguồn tạo"
              value={draft.sourceChannel}
              onChange={(value) => set('sourceChannel', value)}
              options={SOURCE_OPTIONS}
            />
            <CustomSelect
              label="Dịch vụ"
              value={draft.serviceType}
              onChange={(value) => set('serviceType', value)}
              options={SERVICE_OPTIONS}
            />
            <CustomSelect
              label="Phương thức gửi"
              value={draft.dispatchMethod}
              onChange={(value) => set('dispatchMethod', value)}
              options={DISPATCH_OPTIONS}
            />
            <Field
              label="Khu vực nhận"
              placeholder="Tỉnh/Thành, Quận/Huyện"
              icon={MapPin}
              value={draft.recipientRegion}
              onChange={(event) => set('recipientRegion', event.target.value)}
            />
            <CustomSelect
              label="Lọc theo mốc"
              icon={Calendar}
              value={draft.timeField}
              onChange={(value) => set('timeField', value)}
              options={TIME_FIELD_OPTIONS}
            />
            <CustomSelect
              label="Khoảng thời gian"
              value={draft.days}
              onChange={(value) => set('days', value)}
              options={TIME_PRESETS}
            />
          </div>

          <div className="filter-quick-flags">
            <strong>{isInternal ? 'Cần theo dõi nhanh' : 'Quản lý nhanh'}</strong>
            <div className="filter-quick-checks">
              {!isInternal ? (
                <>
                  <FilterCheck
                    checked={draft.unpicked}
                    label="Chưa lấy hàng"
                    onChange={(value) => set('unpicked', value)}
                  />
                  <FilterCheck
                    checked={draft.deliveryFailed}
                    label="Giao thất bại"
                    onChange={(value) => set('deliveryFailed', value)}
                  />
                  <FilterCheck
                    checked={draft.hasReturn}
                    label="Có hoàn hàng"
                    onChange={(value) => set('hasReturn', value)}
                  />
                  <FilterCheck
                    checked={draft.unprinted}
                    label="Chưa in nhãn"
                    onChange={(value) => set('unprinted', value)}
                  />
                </>
              ) : (
                <>
                  {can('sync') && (
                    <FilterCheck
                      checked={draft.syncError}
                      label="Đồng bộ lỗi"
                      onChange={(value) => set('syncError', value)}
                    />
                  )}
                  {can('external_routing') && (
                    <FilterCheck
                      checked={draft.isExternalRouted}
                      label="Có chuyển ngoài"
                      onChange={(value) => set('isExternalRouted', value)}
                    />
                  )}
                  {can('label') && (
                    <FilterCheck
                      checked={draft.unprinted}
                      label="Chưa in nhãn"
                      onChange={(value) => set('unprinted', value)}
                    />
                  )}
                </>
              )}
            </div>
          </div>

          <div className="advanced-filter-toggle-bar">
            <button
              type="button"
              className="btn-toggle-advanced"
              onClick={() => setAdvanced((value) => !value)}
            >
              {advanced ? 'Ẩn bộ lọc nâng cao' : 'Hiện bộ lọc nâng cao'}
              {advanced ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>

          {advanced && (
            <div className="advanced-filters-panel">
              <div className="filter-group-card">
                <h4>
                  <FileText size={15} /> Định danh & đối tượng
                </h4>
                <div className="filter-grid-3">
                  <Field
                    label="Mã đơn hàng SuperPlatform"
                    placeholder="Nhập mã đơn hàng"
                    value={draft.id}
                    onChange={(event) => set('id', event.target.value)}
                  />
                  <Field
                    label="Mã đơn cửa hàng / mã đơn nguồn"
                    placeholder="Nhập mã đơn riêng"
                    value={draft.privateId}
                    onChange={(event) => set('privateId', event.target.value)}
                  />
                  <Field
                    label="Mã vận đơn bất kỳ"
                    placeholder="Mã Lấy, Giao hoặc Hoàn"
                    value={draft.carrierWaybill}
                    onChange={(event) => set('carrierWaybill', event.target.value)}
                  />
                  <Field
                    label="Tên người nhận"
                    placeholder="Nguyễn Văn A"
                    icon={UserRound}
                    value={draft.recipientName}
                    onChange={(event) => set('recipientName', event.target.value)}
                  />
                  <Field
                    label="SĐT người nhận"
                    placeholder="09xxxxxxxx"
                    icon={Phone}
                    value={draft.phone}
                    onChange={(event) => set('phone', event.target.value)}
                  />
                  <Field
                    label="Địa chỉ chi tiết"
                    placeholder="Số nhà, tên đường"
                    value={draft.recipientAddress}
                    onChange={(event) => set('recipientAddress', event.target.value)}
                  />
                  <CustomSelect
                    label="Định dạng địa chỉ nhận"
                    value={draft.addressFormat}
                    onChange={(value) => set('addressFormat', value)}
                    options={ADDRESS_FORMAT_OPTIONS}
                  />
                  {isInternal && (
                    <>
                      <Field
                        label="Mã khách hàng nguồn"
                        placeholder="Mã khách hàng nguồn"
                        value={draft.clientCode}
                        onChange={(event) => set('clientCode', event.target.value)}
                      />
                      <Field
                        label="Mã lô / tệp nhập"
                        placeholder="Chỉ dùng cho nội bộ"
                        value={draft.batchId}
                        onChange={(event) => set('batchId', event.target.value)}
                      />
                      {can('sender_warehouse') && (
                        <Field
                          label="Kho gửi"
                          placeholder="Mã kho hoặc điểm gửi"
                          value={draft.warehouseId}
                          onChange={(event) => set('warehouseId', event.target.value)}
                        />
                      )}
                      {can('sender_warehouse') && (
                        <Field
                          label="Địa chỉ gửi"
                          placeholder="Số nhà, tên đường, khu vực"
                          value={draft.senderAddress}
                          onChange={(event) => set('senderAddress', event.target.value)}
                        />
                      )}
                      <Field
                        type="number"
                        min={1}
                        label="Ở trạng thái hiện tại từ (giờ)"
                        placeholder="VD: 24"
                        value={draft.statusAgeHours}
                        onChange={(event) => set('statusAgeHours', event.target.value)}
                      />
                    </>
                  )}
                </div>
              </div>

              {isInternal && can('carrier_status') && (
                <div className="filter-group-card">
                  <h4>
                    <Truck size={15} /> Nhà vận chuyển theo từng chặng
                  </h4>
                  <p className="filter-group-hint">
                    Lọc độc lập theo NVC và trạng thái NVC ở từng chặng; không thay thế trạng thái
                    Order SuperPlatform.
                  </p>
                  <div className="filter-grid-3">
                    <CustomSelect
                      label="Nhà vận chuyển lấy hàng"
                      value={draft.carrierPickup}
                      onChange={(value) => set('carrierPickup', value)}
                      options={CARRIER_OPTIONS}
                    />
                    <CustomSelect
                      label="Nhà vận chuyển giao hàng"
                      value={draft.carrierDelivery}
                      onChange={(value) => set('carrierDelivery', value)}
                      options={CARRIER_OPTIONS}
                    />
                    <CustomSelect
                      label="Nhà vận chuyển xử lý hoàn"
                      value={draft.carrierReturn}
                      onChange={(value) => set('carrierReturn', value)}
                      options={CARRIER_OPTIONS}
                    />
                    <CustomSelect
                      label="Nhà vận chuyển trả cuối"
                      value={draft.carrierFinalReturn}
                      onChange={(value) => set('carrierFinalReturn', value)}
                      options={CARRIER_OPTIONS}
                    />
                    <CustomSelect
                      label="Trạng thái NVC lấy"
                      value={draft.carrierStatusPickup}
                      onChange={(value) => set('carrierStatusPickup', value)}
                      options={CARRIER_STATUS_PICKUP_OPTIONS}
                    />
                    <CustomSelect
                      label="Trạng thái NVC giao"
                      value={draft.carrierStatusDelivery}
                      onChange={(value) => set('carrierStatusDelivery', value)}
                      options={CARRIER_STATUS_DELIVERY_OPTIONS}
                    />
                    <CustomSelect
                      label="Trạng thái NVC hoàn"
                      value={draft.carrierStatusReturn}
                      onChange={(value) => set('carrierStatusReturn', value)}
                      options={CARRIER_STATUS_RETURN_OPTIONS}
                    />
                    <CustomSelect
                      label="Trạng thái NVC trả cuối"
                      value={draft.carrierStatusFinalReturn}
                      onChange={(value) => set('carrierStatusFinalReturn', value)}
                      options={CARRIER_STATUS_FINAL_RETURN_OPTIONS}
                    />
                    {can('shipper') && (
                      <>
                        <Field
                          label="SĐT nhân viên lấy hàng"
                          placeholder="Nhập số điện thoại"
                          value={draft.shipperPickupPhone}
                          onChange={(event) => set('shipperPickupPhone', event.target.value)}
                        />
                        <Field
                          label="SĐT nhân viên giao hàng"
                          placeholder="Nhập số điện thoại"
                          value={draft.shipperDeliveryPhone}
                          onChange={(event) => set('shipperDeliveryPhone', event.target.value)}
                        />
                        <Field
                          label="SĐT nhân viên lấy hoàn"
                          placeholder="Nhập số điện thoại"
                          value={draft.shipperReturnPhone}
                          onChange={(event) => set('shipperReturnPhone', event.target.value)}
                        />
                        <Field
                          label="SĐT nhân viên trả cuối"
                          placeholder="Nhập số điện thoại"
                          value={draft.shipperFinalReturnPhone}
                          onChange={(event) => set('shipperFinalReturnPhone', event.target.value)}
                        />
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="filter-group-card">
                <h4>
                  <CheckSquare size={15} /> Kết quả & loại nghiệp vụ
                </h4>
                <div className="filter-grid-3">
                  {can('delivery') && (
                    <CustomSelect
                      label="Kết quả giao hàng"
                      value={draft.deliveryResult}
                      onChange={(value) => set('deliveryResult', value)}
                      options={DELIVERY_RESULT_OPTIONS}
                    />
                  )}
                  <CustomSelect
                    label="Loại nghiệp vụ"
                    value={draft.businessType}
                    onChange={(value) => set('businessType', value)}
                    options={BUSINESS_TYPE_OPTIONS}
                  />
                  {can('return') && (
                    <Field
                      label="Lý do hoàn"
                      placeholder="Từ chối, không liên lạc được..."
                      value={draft.returnReason}
                      onChange={(event) => set('returnReason', event.target.value)}
                    />
                  )}
                  {can('cod') && (
                    <CustomSelect
                      label="Thanh toán tiền thu hộ cho cửa hàng"
                      value={draft.codPaymentStatus}
                      onChange={(value) => set('codPaymentStatus', value)}
                      options={COD_PAYMENT_OPTIONS}
                    />
                  )}
                  {isInternal && can('price_account') && (
                    <CustomSelect
                      label="Tài khoản giá"
                      value={draft.priceAccountType}
                      onChange={(value) => set('priceAccountType', value)}
                      options={PRICE_ACCOUNT_OPTIONS}
                    />
                  )}
                </div>
              </div>

              {isInternal &&
                (can('pickup') || can('handover') || can('delivery') || can('cancel')) && (
                  <div className="filter-group-card">
                    <h4>
                      <CheckSquare size={15} /> Tiến trình vận hành
                    </h4>
                    <p className="filter-group-hint">
                      Lọc theo các trạng thái tiến trình lấy hàng, bàn giao, giao hàng, hủy đơn và in nhãn dạng danh sách chọn.
                    </p>
                    <div className="filter-grid-3">
                      {can('pickup') && (
                        <CustomSelect
                          label="Tiến trình lấy hàng"
                          value={
                            draft.pickupFailed
                              ? 'pickupFailed'
                              : draft.picked
                                ? 'picked'
                                : draft.unpicked
                                  ? 'unpicked'
                                  : ''
                          }
                          onChange={(value) =>
                            setDraft((prev) => ({
                              ...prev,
                              picked: value === 'picked',
                              unpicked: value === 'unpicked',
                              pickupFailed: value === 'pickupFailed',
                            }))
                          }
                          options={PICKUP_PROGRESS_OPTIONS}
                        />
                      )}
                      {can('handover') && (
                        <CustomSelect
                          label="Tiến trình bàn giao"
                          value={
                            draft.handoverFailed
                              ? 'handoverFailed'
                              : draft.handoverDone
                                ? 'handoverDone'
                                : ''
                          }
                          onChange={(value) =>
                            setDraft((prev) => ({
                              ...prev,
                              handoverDone: value === 'handoverDone',
                              handoverFailed: value === 'handoverFailed',
                            }))
                          }
                          options={HANDOVER_PROGRESS_OPTIONS}
                        />
                      )}
                      {can('delivery') && (
                        <CustomSelect
                          label="Tiến trình giao hàng"
                          value={
                            draft.deliveryFailed
                              ? 'deliveryFailed'
                              : draft.delivered
                                ? 'delivered'
                                : ''
                          }
                          onChange={(value) =>
                            setDraft((prev) => ({
                              ...prev,
                              delivered: value === 'delivered',
                              deliveryFailed: value === 'deliveryFailed',
                            }))
                          }
                          options={DELIVERY_PROGRESS_OPTIONS}
                        />
                      )}
                      {can('cancel') && (
                        <CustomSelect
                          label="Trạng thái hủy đơn"
                          value={
                            draft.cancelCarrierFailed
                              ? 'cancelCarrierFailed'
                              : draft.hasCancelRequest
                                ? 'hasCancelRequest'
                                : ''
                          }
                          onChange={(value) =>
                            setDraft((prev) => ({
                              ...prev,
                              hasCancelRequest: value === 'hasCancelRequest',
                              cancelCarrierFailed: value === 'cancelCarrierFailed',
                            }))
                          }
                          options={CANCEL_PROGRESS_OPTIONS}
                        />
                      )}
                      {can('label') && (
                        <CustomSelect
                          label="Trạng thái in nhãn"
                          value={
                            draft.unprinted
                              ? 'unprinted'
                              : draft.printed
                                ? 'printed'
                                : ''
                          }
                          onChange={(value) =>
                            setDraft((prev) => ({
                              ...prev,
                              printed: value === 'printed',
                              unprinted: value === 'unprinted',
                            }))
                          }
                          options={PRINT_STATUS_OPTIONS}
                        />
                      )}
                      {(can('return') || can('partial_delivery') || can('exchange')) && (
                        <CustomSelect
                          label="Nghiệp vụ đặc biệt"
                          value={
                            draft.hasReturn
                              ? 'hasReturn'
                              : draft.hasPartialDelivery
                                ? 'hasPartialDelivery'
                                : draft.hasExchange
                                  ? 'hasExchange'
                                  : ''
                          }
                          onChange={(value) =>
                            setDraft((prev) => ({
                              ...prev,
                              hasReturn: value === 'hasReturn',
                              hasPartialDelivery: value === 'hasPartialDelivery',
                              hasExchange: value === 'hasExchange',
                            }))
                          }
                          options={SPECIAL_BIZ_OPTIONS}
                        />
                      )}
                    </div>
                  </div>
                )}

              {(can('cod') || can('label') || can('claim')) && (
                <div className="filter-group-card">
                  <h4>
                    <CircleDollarSign size={15} /> Tiền thu hộ & đối soát liên quan
                  </h4>
                  <div className="filter-grid-3">
                    {can('cod') && (
                      <Field
                        type="number"
                        min={0}
                        label="Tiền thu hộ từ"
                        placeholder="0"
                        value={draft.codMin}
                        onChange={(event) =>
                          set('codMin', event.target.value === '' ? '' : event.target.valueAsNumber)
                        }
                      />
                    )}
                    {can('cod') && (
                      <Field
                        type="number"
                        min={0}
                        label="Tiền thu hộ đến"
                        placeholder="Không giới hạn"
                        value={draft.codMax}
                        onChange={(event) =>
                          set('codMax', event.target.value === '' ? '' : event.target.valueAsNumber)
                        }
                      />
                    )}
                    <div className="filter-inline-checks">
                      {can('cod') && (
                        <>
                          <FilterCheck
                            checked={draft.hasCod}
                            label="Có tiền thu hộ"
                            onChange={(value) => set('hasCod', value)}
                          />
                          <FilterCheck
                            checked={draft.codChanged}
                            label="Tiền thu hộ đã điều chỉnh"
                            onChange={(value) => set('codChanged', value)}
                          />
                        </>
                      )}
                      {can('claim') && (
                        <FilterCheck
                          checked={draft.hasCompensation}
                          label="Có bồi thường"
                          onChange={(value) => set('hasCompensation', value)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="filters-actions-footer refined">
            <div className="filter-sort-control">
              <span>Sắp xếp:</span>
              <label>
                <input
                  type="radio"
                  name="sortOrder"
                  checked={draft.sort === 'new'}
                  onChange={() => set('sort', 'new')}
                />{' '}
                Mới nhất
              </label>
              <label>
                <input
                  type="radio"
                  name="sortOrder"
                  checked={draft.sort === 'old'}
                  onChange={() => set('sort', 'old')}
                />{' '}
                Cũ nhất
              </label>
            </div>
            <div className="filters-buttons-col">
              <button type="button" className="btn-filter-reset" onClick={reset}>
                ĐẶT LẠI
              </button>
              <button type="submit" className="btn-filter-search">
                <Search size={16} /> TÌM KIẾM
              </button>
            </div>
          </div>
        </form>
      )}
    </section>
  );
}
