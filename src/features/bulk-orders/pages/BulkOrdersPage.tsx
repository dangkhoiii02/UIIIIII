import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Plus,
  Search,
  FileCheck,
  RotateCcw,
  Save,
  MapPin,
  Settings,
  X,
  Truck,
  Download,
  Upload,
  Eye,
  EyeOff,
  LayoutGrid,
  Info,
  TriangleAlert,
} from 'lucide-react';
import { useOrders } from '@/features/orders';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { Field } from '@/shared/ui/Field';
import { HelpDialog } from '@/shared/ui/HelpDialog';
import { useToast } from '@/shared/ui/toast-context';
import { readPreference, writePreference } from '@/shared/lib/storage';
import {
  appendRows,
  decodeDraft,
  emptySheet,
  generateTemplateCsv,
  parseImportedSpreadsheet,
  rowToOrder,
  validateRow,
  type AddressLevel,
  type SheetRow,
} from '../model/sheet';
import type { RetryBatchPayload } from '../model/batches';
import { SheetGrid } from '../components/SheetGrid';

interface BulkOrdersLocationState {
  retryBatch?: RetryBatchPayload;
}

function retryRows(payload: RetryBatchPayload | undefined): SheetRow[] | null {
  if (!payload?.items.length) return null;

  return payload.items.map((item) => ({
    privateId: item.clientOrderCode,
    name: item.receiverName,
    phone: item.receiverPhone,
    address: '',
    province: '',
    district: '',
    ward: '',
    product: '',
    weight: '',
    cod: '',
    value: '',
    note: '',
    ...item.sourceData,
    _sourceLine: String(item.line),
    _errorCode: item.errorCode ?? 'ORDER_ROW_FAILED',
    _errorMessage: item.errorMessage ?? 'Dòng dữ liệu chưa thể tạo đơn hàng.',
  }));
}

export default function BulkOrdersPage({ level }: { level: AddressLevel }) {
  const location = useLocation();
  const retryBatch = (location.state as BulkOrdersLocationState | null)?.retryBatch;
  const initialRetryRows = retryRows(retryBatch);
  const [rows, setRows] = useState<SheetRow[]>(() => initialRetryRows ?? emptySheet());
  const [checked, setChecked] = useState(Boolean(initialRetryRows));
  const [auto, setAuto] = useState(false);
  const [savedTime, setSavedTime] = useState('14/09/2026 - 12:08:24');
  const [showGuide, setShowGuide] = useState(true);
  const [help, setHelp] = useState(false);
  const [defaults, setDefaults] = useState(false);
  const [changePickup, setChangePickup] = useState(false);
  const [changeCarrier, setChangeCarrier] = useState(false);
  const [shippingCarrier, setShippingCarrier] = useState('SPX Express');
  const [showPickupPhone, setShowPickupPhone] = useState(false);
  const [weight, setWeight] = useState(750);
  const [cod, setCod] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const notify = useToast();
  const navigate = useNavigate();
  const { createOrders } = useOrders();
  const key = 'superplatform:sheet:' + level + ':v1';

  const formatNow = () => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
  };

  const save = (data: SheetRow[]) => {
    if (writePreference(key, JSON.stringify(data))) {
      setSavedTime(formatNow());
      notify('Đã lưu nháp dữ liệu bảng tính thành công!');
    } else {
      notify('Không thể lưu nháp trên trình duyệt này.');
    }
  };

  const update = (data: SheetRow[]) => {
    setRows(data);
    setChecked(false);
    if (auto) save(data);
  };

  const validRows = checked ? rows.filter((row) => validateRow(row, level) === 'valid') : [];
  const validCount = validRows.length;
  const invalidRows = checked ? rows.filter((row) => validateRow(row, level) === 'invalid') : [];
  const invalidCount = invalidRows.length;

  const handleAddRows = () => {
    update(appendRows(rows, 5));
    notify('Đã thêm 5 dòng mới vào bảng tính.');
  };

  const handleCheckData = () => {
    setChecked(true);
    const validNum = rows.filter((row) => validateRow(row, level) === 'valid').length;
    const invalidNum = rows.filter((row) => validateRow(row, level) === 'invalid').length;
    if (invalidNum > 0) {
      notify(`Phát hiện ${invalidNum} dòng có dữ liệu không hợp lệ (tô màu đỏ). Vui lòng kiểm tra lại.`);
    } else if (validNum > 0) {
      notify(`Đã kiểm tra! Có ${validNum} dòng dữ liệu hợp lệ (tô màu xanh) sẵn sàng tạo đơn.`);
    } else {
      notify('Vui lòng nhập dữ liệu người nhận và thông tin đơn hàng trước khi kiểm tra.');
    }
  };

  const handleFindError = () => {
    setChecked(true);
    const firstInvalidIdx = rows.findIndex((row) => validateRow(row, level) === 'invalid');
    if (firstInvalidIdx !== -1) {
      const el = document.getElementById(`row-${firstInvalidIdx + 1}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      notify(`Đã chuyển tới ô lỗi đầu tiên (Dòng ${firstInvalidIdx + 1}).`);
    } else {
      notify('Không tìm thấy ô lỗi nào trong bảng tính!');
    }
  };

  const handleCreateBulk = () => {
    if (!validCount) {
      handleCheckData();
      return;
    }
    try {
      createOrders(validRows.map((row) => rowToOrder(row, level)));
      navigate('/orders');
      notify(`Đã tạo thành công ${validCount} đơn hàng mới trên hệ thống SuperPlatform!`);
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Không thể tạo đơn hàng.');
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = generateTemplateCsv(level);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Mau_Tao_Don_Hang_${level}_Cap_SuperPlatform.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    notify(`Đã tải file mẫu Excel (${level} cấp) thành công!`);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = (event.target?.result as string) || '';
        const imported = parseImportedSpreadsheet(text, level);
        if (imported.length === 0) {
          notify('Không tìm thấy dữ liệu hợp lệ trong file tải lên.');
          return;
        }

        const nonBlank = rows.filter((r) => Object.values(r).some((v) => v?.trim()));
        const merged = [...imported, ...nonBlank];
        const targetLen = Math.max(35, merged.length + 5);
        const padded = [
          ...merged,
          ...Array.from({ length: targetLen - merged.length }, () => ({})),
        ];
        update(padded);
        notify(`Đã nhập thành công ${imported.length} dòng đơn hàng từ file!`);
      } catch {
        notify('Không thể đọc file. Vui lòng kiểm tra lại định dạng file CSV/Excel UTF-8.');
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  return (
    <div className="bulk-orders-container">
      {/* Top Header & Toolbar with Screenshot 1 Quick Pills & Excel buttons */}
      <div className="sheet-top-header">
        <div className="sheet-top-title-wrap">
          <h1 className="sheet-page-heading">Bảng tính {level} cấp</h1>
          <span className="sheet-sub-badge">Chuẩn hóa địa chỉ {level} cấp SuperPlatform</span>
        </div>

        <div className="sheet-top-toolbar">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            accept=".xlsx,.xls,.csv,.tsv,.txt"
            onChange={handleImportFile}
            style={{ display: 'none' }}
          />

          <button
            type="button"
            className="btn-pill-action btn-excel-download"
            onClick={handleDownloadTemplate}
            title="Tải file mẫu Excel chuẩn để nhập dữ liệu"
          >
            <Download size={15} /> Tải mẫu Excel
          </button>

          <button
            type="button"
            className="btn-pill-action btn-excel-import"
            onClick={() => fileInputRef.current?.click()}
            title="Nhập file Excel / CSV đơn hàng vào bảng tính"
          >
            <Upload size={15} /> Nhập file Excel
          </button>

          {/* Screenshot 1 Pills */}
          <button
            type="button"
            className="btn-pill-action btn-pill-add"
            onClick={handleAddRows}
            title="Thêm 5 dòng mới"
          >
            <Plus size={15} /> Thêm dòng
          </button>

          <button
            type="button"
            className="btn-pill-action btn-pill-find"
            onClick={handleFindError}
            title="Tìm ô chưa điền hoặc điền sai"
          >
            <Search size={15} /> Tìm ô lỗi
          </button>

          <button
            type="button"
            className="btn-pill-action btn-pill-check"
            onClick={handleCheckData}
            title="Kiểm tra hợp lệ toàn bộ dữ liệu bảng tính"
          >
            <FileCheck size={15} /> Kiểm tra dữ liệu
          </button>
        </div>
      </div>

      {/* Collapsible "Hướng Dẫn Sử Dụng" Banner at Top matching Screenshot 2 */}
      {showGuide && (
        <div className="sheet-guide-banner">
          <div className="guide-banner-header">
            <h2 className="guide-banner-title">Hướng Dẫn Sử Dụng</h2>
            <button
              type="button"
              className="btn-close-guide"
              onClick={() => setShowGuide(false)}
              title="Đóng hướng dẫn sử dụng"
            >
              <X size={18} />
            </button>
          </div>

          <div className="guide-banner-body">
            <p className="guide-step">
              <strong>Bước 1:</strong> Nhập vào các thông tin cần thiết ở các trường bắt buộc như:{' '}
              <strong>
                Tên Người Nhận, SĐT Người Nhận, Địa Chỉ Chi Tiết, Sản Phẩm, Khối Lượng
              </strong>{' '}
              <em>(gram)</em>, <strong>Thu Hộ</strong> <em>(đồng)</em>, <strong>Giá Trị</strong>{' '}
              <em>(đồng)</em>.<br />
              <strong>Tick/Chọn</strong> vào ô <strong>Đổi Lấy Hàng Về</strong> (nếu có nhu cầu) và
              ghi chú thêm vào ô <strong>Ghi Chú</strong> thông tin lấy hàng, lưu ý giao hàng (nếu
              có).<br />
              <span className="guide-note-muted">
                Lưu ý: Các trường có dấu hoa thị [*] là các trường bắt buộc điền.
              </span>
            </p>

            <p className="guide-step">
              <strong>Bước 2:</strong> Tại cột <strong>Tỉnh/Thành Phố, Phường/Xã/Đặc Khu</strong>{' '}
              <span className="text-superplatform">SuperPlatform</span> sẽ có gợi ý khi điền trường{' '}
              <strong>Địa Chỉ Chi Tiết</strong>. Nếu chưa có, quý khách hàng vui lòng chọn lại thông
              tin chính xác theo danh sách gợi ý để đơn hàng được vận chuyển đúng tuyến.<br />
              <span className="guide-warn-text">
                Lưu ý: Vui lòng kiểm tra lại dữ liệu một lần nữa để đảm bảo thông tin gợi ý tự động là
                chính xác, trong một vài trường hợp dữ liệu nhận diện tự động bị sai lệch so với thực
                tế.
              </span>
              <br />
              <span className="guide-info-bullet">
                - Các Tỉnh/Thành Phố, Phường/Xã/Đặc Khu được nhận diện tự động bởi hệ thống và có
                thể mắc sai sót.
              </span>
              <br />
              <span className="guide-info-bullet">
                - Các ô được tô nền xanh dương nhạt là các ô có thể có sai sót do được chuyển đổi từ
                Địa Chỉ 3 Cấp sang Địa Chỉ 2 Cấp (trường hợp một Phường/Xã/Thị Trấn - Cũ được tách
                ra thành nhiều Phường/Xã/Đặc Khu - Mới).
              </span>
            </p>

            <p className="guide-step">
              <strong>Bước 3:</strong> Chọn <strong>Kiểm Tra Dữ Liệu</strong> hệ thống xác thực dữ
              liệu, các dòng hợp lệ sẽ hiển thị với màu nền xanh. Nhấn{' '}
              <strong>Tạo Nhiều Đơn Hàng</strong> để tiến hành tạo đơn và vui lòng chờ giây lát để hệ
              thống xử lý dữ liệu.
            </p>
          </div>
        </div>
      )}

      {/* Main Table Grid with smooth up/down scrollable container */}
      {retryBatch && initialRetryRows && (
        <div className="sheet-retry-notice" role="status">
          <span className="sheet-retry-notice-icon">
            <TriangleAlert size={19} />
          </span>
          <div>
            <strong>{initialRetryRows.length} dòng cần sửa từ {retryBatch.batchId}</strong>
            <span>
              {retryBatch.sourceFile} · Bảng đang chỉ hiển thị các dòng thất bại. Sửa dữ liệu rồi
              kiểm tra lại trước khi tạo đơn.
            </span>
          </div>
          <button type="button" onClick={() => navigate('/order-batches')}>
            Quay lại lịch sử batch
          </button>
        </div>
      )}
      <div className="sheet-table-scroll-wrapper">
        <SheetGrid rows={rows} level={level} checked={checked} onChange={update} />
      </div>

      {/* Pinned Bottom Control Section matching Screenshot 3 (Fixed when scrolling up or down) */}
      <div className="sheet-docked-control-panel">
        <div className="sheet-docked-status-bar">
          <div className="status-bar-left">
            <div className="draft-mode-selector">
              <span className="draft-selector-label">Lưu nháp:</span>
              <label className="radio-label">
                <input
                  type="radio"
                  name="saveMode"
                  checked={auto}
                  onChange={() => {
                    setAuto(true);
                    save(rows);
                  }}
                />
                <span>Tự động</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="saveMode"
                  checked={!auto}
                  onChange={() => setAuto(false)}
                />
                <span>Thủ công</span>
              </label>
            </div>
            <div className="last-saved-timestamp">{savedTime}</div>
          </div>

          <div className="status-bar-right">
            <button
              type="button"
              className="btn-find-errors-docked"
              onClick={handleFindError}
            >
              <Eye size={16} /> Tìm Ô Chưa Điền/Điền Sai [{invalidCount}]
            </button>

            <button
              type="button"
              className="btn-check-data-docked"
              onClick={handleCheckData}
            >
              ✓ Kiểm Tra Dữ Liệu
            </button>

            <button
              type="button"
              className={`btn-create-orders-docked ${validCount > 0 ? 'active' : 'disabled'}`}
              disabled={!checked || validCount === 0}
              onClick={handleCreateBulk}
            >
              <LayoutGrid size={16} /> Tạo Nhiều Đơn Hàng [{validCount}]
            </button>
          </div>
        </div>

        {/* 3-Card Bottom Section matching Screenshot 2 & 3 */}
        <div className="sheet-bottom-section-grid">
          {/* Card 1: 2x3 Grid of Action Buttons */}
          <div className="bottom-card action-grid-card">
            <div className="action-buttons-2x3-grid">
              {/* Row 1: Solid Buttons */}
              <button
                type="button"
                className="btn-grid-action btn-grid-save"
                onClick={() => save(rows)}
              >
                <Save size={15} /> Lưu Nháp Dữ Liệu
              </button>

              <button
                type="button"
                className="btn-grid-action btn-grid-restore"
                onClick={() => {
                  const draft = decodeDraft(readPreference(key));
                  if (!draft)
                    return notify('Không tìm thấy bản nháp hợp lệ cho bảng tính ' + level + ' cấp.');
                  setRows(draft);
                  setChecked(false);
                  notify('Đã khôi phục dữ liệu bản nháp thành công!');
                }}
              >
                <RotateCcw size={15} /> Khôi Phục Dữ Liệu
              </button>

              <button
                type="button"
                className="btn-grid-action btn-grid-add"
                onClick={handleAddRows}
              >
                <Plus size={15} /> Thêm Dòng Bảng Tính
              </button>

              {/* Row 2: Red Outlined Buttons */}
              <button
                type="button"
                className="btn-grid-action btn-grid-outline"
                onClick={() => setShowGuide(!showGuide)}
              >
                <Info size={15} /> Ẩn/Hiện Hướng Dẫn
              </button>

              <button
                type="button"
                className="btn-grid-action btn-grid-outline"
                onClick={() => navigate('/create')}
              >
                <Home size={15} /> Quay Về Trang Chủ
              </button>

              <button
                type="button"
                className="btn-grid-action btn-grid-outline"
                onClick={() => setDefaults(true)}
              >
                <Settings size={15} /> Cấu Hình Mặc Định
              </button>
            </div>
          </div>

          {/* Card 2: Phương thức vận chuyển matching Screenshot 2 & 3 */}
          <div className="bottom-card shipping-method-card">
            <div className="card-header-row">
              <div className="card-title-icon-lockup">
                <Truck size={17} className="blue-truck-icon" />
                <strong className="card-title-text">Phương thức vận chuyển</strong>
              </div>
              <button
                type="button"
                className="btn-change-red-link"
                onClick={() => setChangeCarrier(true)}
              >
                Thay đổi
              </button>
            </div>

            <div className="carrier-content-body">
              <span className="carrier-sub-label">Một nhà vận chuyển mặc định</span>
              <span className="carrier-name-highlight">{shippingCarrier}</span>
            </div>
          </div>

          {/* Card 3: Địa chỉ lấy hàng matching Screenshot 2 & 3 */}
          <div className="bottom-card pickup-address-card">
            <div className="card-header-row">
              <div className="card-title-icon-lockup">
                <MapPin size={17} className="red-store-icon" />
                <strong className="card-title-text">Địa chỉ lấy hàng</strong>
              </div>
              <button
                type="button"
                className="btn-change-red-link"
                onClick={() => setChangePickup(true)}
              >
                Thay đổi
              </button>
            </div>

            <div className="pickup-content-body">
              <p className="pickup-street-text">
                231/15 Dương Bá Trạc, Phường 01, Quận 8, Thành phố Hồ Chí Minh
              </p>
              <div className="pickup-contact-code-row">
                <span className="pickup-code-bold">
                  S275518 - AB - {showPickupPhone ? '0399888077' : '039****077'}
                </span>
                <button
                  type="button"
                  className="btn-eye-toggle"
                  onClick={() => setShowPickupPhone(!showPickupPhone)}
                  title={showPickupPhone ? 'Ẩn số điện thoại' : 'Xem số điện thoại đầy đủ'}
                >
                  {showPickupPhone ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals & Dialogs */}
      {help && <HelpDialog onClose={() => setHelp(false)} />}

      {changeCarrier && (
        <Modal
          title="Chọn nhà vận chuyển mặc định"
          onClose={() => setChangeCarrier(false)}
          footer={
            <Button variant="primary" onClick={() => setChangeCarrier(false)}>
              Xác nhận
            </Button>
          }
        >
          <p className="text-sm text-slate-600 mb-3">
            Chọn đơn vị vận chuyển mặc định sẽ thực hiện giao hàng cho các đơn trong bảng tính:
          </p>
          <div className="carrier-select-radio-list">
            {['SPX Express', 'BEST Express', 'SuperShip', 'Giao Hàng Nhanh (GHN)', 'Viettel Post'].map(
              (c) => (
                <label key={c} className="carrier-radio-item">
                  <input
                    type="radio"
                    name="carrierSelect"
                    checked={shippingCarrier === c}
                    onChange={() => {
                      setShippingCarrier(c);
                      notify(`Đã đặt ${c} làm nhà vận chuyển mặc định.`);
                    }}
                  />
                  <span>{c}</span>
                </label>
              ),
            )}
          </div>
        </Modal>
      )}

      {changePickup && (
        <Modal
          title="Thay đổi địa chỉ lấy hàng"
          onClose={() => setChangePickup(false)}
          footer={<Button onClick={() => setChangePickup(false)}>Đóng</Button>}
        >
          <p>
            Kho lấy hàng hiện tại: <b>231/15 Dương Bá Trạc, Phường 01, Quận 8, TP.HCM</b>
          </p>
          <p>Mã shop: <b>S275518 (AB)</b> · SĐT liên hệ: <b>0399888077</b></p>
          <p className="text-xs text-slate-500 mt-2">
            Để thêm kho mới hoặc đổi tuyến bàn giao, vui lòng cập nhật trong phần Cài Đặt Kho hoặc
            liên hệ CSKH SuperPlatform.
          </p>
        </Modal>
      )}

      {defaults && (
        <Modal
          title="Cấu hình mặc định bảng tính"
          onClose={() => setDefaults(false)}
          footer={
            <>
              <Button onClick={() => setDefaults(false)}>Đóng</Button>
              <Button form="defaults-form" type="submit" variant="primary">
                Áp dụng
              </Button>
            </>
          }
        >
          <form
            id="defaults-form"
            onSubmit={(e) => {
              e.preventDefault();
              update(
                rows.map((row) => ({
                  ...row,
                  weight: row.weight || String(weight),
                  cod: row.cod || String(cod),
                })),
              );
              setDefaults(false);
              notify('Đã áp dụng cấu hình mặc định (khối lượng, thu hộ) cho các ô trống.');
            }}
          >
            <Field
              label="Khối lượng mặc định (gram)"
              type="number"
              min={1}
              required
              value={weight}
              onChange={(e) => setWeight(e.target.valueAsNumber)}
            />
            <Field
              label="Thu hộ COD mặc định (đồng)"
              type="number"
              min={0}
              required
              value={cod}
              onChange={(e) => setCod(e.target.valueAsNumber)}
            />
          </form>
        </Modal>
      )}
    </div>
  );
}
