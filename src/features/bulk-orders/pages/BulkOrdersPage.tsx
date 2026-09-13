import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  Plus,
  Search,
  FileCheck,
  Layers,
  RotateCcw,
  Save,
  MapPin,
  Settings,
  BookOpen,
} from 'lucide-react';
import { useOrders } from '@/features/orders';
import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';
import { Field } from '@/shared/ui/Field';
import { HelpDialog } from '@/shared/ui/HelpDialog';
import { useToast } from '@/shared/ui/toast-context';
import { readPreference, writePreference } from '@/shared/lib/storage';
import {
  appendRows,
  decodeDraft,
  emptySheet,
  rowToOrder,
  validateRow,
  type AddressLevel,
  type SheetRow,
} from '../model/sheet';
import { SheetGrid } from '../components/SheetGrid';

export default function BulkOrdersPage({ level }: { level: AddressLevel }) {
  const [rows, setRows] = useState<SheetRow[]>(emptySheet);
  const [checked, setChecked] = useState(false);
  const [auto, setAuto] = useState(false);
  const [saved, setSaved] = useState('Không có bản lưu');
  const [help, setHelp] = useState(false);
  const [defaults, setDefaults] = useState(false);
  const [changePickup, setChangePickup] = useState(false);
  const [weight, setWeight] = useState(750);
  const [cod, setCod] = useState(0);

  const notify = useToast();
  const navigate = useNavigate();
  const { createOrders } = useOrders();
  const key = 'superplatform:sheet:' + level + ':v1';

  const save = (data: SheetRow[]) => {
    if (writePreference(key, JSON.stringify(data))) {
      setSaved(new Date().toLocaleTimeString('vi-VN'));
      notify('Đã lưu nháp bảng tính thành công!');
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

  const handleAddRows = () => {
    update(appendRows(rows, 5));
    notify('Đã thêm 5 dòng mới vào bảng tính.');
  };

  const handleCheckData = () => {
    setChecked(true);
    const validNum = rows.filter((row) => validateRow(row, level) === 'valid').length;
    const invalidNum = rows.filter((row) => validateRow(row, level) === 'invalid').length;
    if (invalidNum > 0) {
      notify(`Phát hiện ${invalidNum} dòng có dữ liệu không hợp lệ (màu đỏ). Vui lòng kiểm tra lại.`);
    } else if (validNum > 0) {
      notify(`Đã kiểm tra! Có ${validNum} dòng dữ liệu hợp lệ sẵn sàng tạo đơn.`);
    } else {
      notify('Vui lòng nhập dữ liệu người nhận và thông tin đơn hàng.');
    }
  };

  const handleFindError = () => {
    setChecked(true);
    const firstInvalidIdx = rows.findIndex((row) => validateRow(row, level) === 'invalid');
    if (firstInvalidIdx !== -1) {
      const el = document.getElementById(`row-${firstInvalidIdx + 1}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      notify(`Đã chuyển tới dòng lỗi đầu tiên (Dòng ${firstInvalidIdx + 1}).`);
    } else {
      notify('Không tìm thấy ô lỗi nào!');
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
      notify(`Đã tạo thành công ${validCount} đơn hàng mới!`);
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Không thể tạo đơn.');
    }
  };

  return (
    <div className="bulk-orders-container">
      <div className="title-row">
        <h1>Bảng tính {level} cấp</h1>
      </div>

      {/* Main Table Grid */}
      <SheetGrid rows={rows} level={level} checked={checked} onChange={update} />

      {/* Middle Action Bar */}
      <div className="sheet-action-bar">
        <Link className="btn-home-pill" to="/create">
          <Home size={16} className="red-icon" /> Về trang chủ
        </Link>

        <div className="sheet-center-actions">
          <button type="button" className="btn-add-row-pill" onClick={handleAddRows}>
            <Plus size={16} /> Thêm dòng
          </button>
          <button type="button" className="btn-find-error-pill" onClick={handleFindError}>
            <Search size={16} /> Tìm ô lỗi
          </button>
          <button type="button" className="btn-check-data-pill" onClick={handleCheckData}>
            <FileCheck size={16} /> Kiểm tra dữ liệu
          </button>
        </div>

        <button
          type="button"
          className="btn-create-bulk-pill"
          disabled={!checked || !validCount}
          onClick={handleCreateBulk}
        >
          <Layers size={16} /> Tạo nhiều đơn {validCount ? `(${validCount})` : ''}
        </button>
      </div>

      {/* Bottom Footer Section */}
      <div className="sheet-footer-section">
        {/* Left Draft Box */}
        <div className="footer-box left-draft-box">
          <div className="draft-radio-row">
            <span className="draft-label">Lưu nháp</span>
            <label className="radio-choice">
              <input type="radio" name="saveMode" checked={auto} onChange={() => setAuto(true)} />
              Tự động
            </label>
            <label className="radio-choice">
              <input type="radio" name="saveMode" checked={!auto} onChange={() => setAuto(false)} />
              Thủ công
            </label>
          </div>
          <p className="last-saved-text">Lưu gần nhất: {saved}</p>
          <div className="draft-btn-group">
            <button
              type="button"
              className="btn-draft-secondary"
              onClick={() => {
                const draft = decodeDraft(readPreference(key));
                if (!draft)
                  return notify('Không có bản nháp hợp lệ cho bảng tính ' + level + ' cấp.');
                setRows(draft);
                setChecked(false);
                notify('Đã khôi phục bản nháp thành công.');
              }}
            >
              <RotateCcw size={14} /> Khôi phục dữ liệu
            </button>
            <button type="button" className="btn-draft-primary" onClick={() => save(rows)}>
              <Save size={14} /> Lưu nháp
            </button>
          </div>
        </div>

        {/* Middle Pickup Address Box */}
        <div className="footer-box middle-pickup-box">
          <div className="pickup-box-header">
            <div className="pickup-title-row">
              <MapPin size={16} className="red-icon" />
              <strong>Địa chỉ lấy hàng</strong>
            </div>
            <button
              type="button"
              className="btn-link-change"
              onClick={() => setChangePickup(true)}
            >
              Thay đổi
            </button>
          </div>
          <p className="pickup-address-detail">
            25 Hồ Mễ Trì, Phường Mễ Trì, Quận Nam Từ Liêm, Thành phố Hà Nội
          </p>
          <p className="pickup-account-info">
            Raspberry Pi VN &nbsp; Raspberry Pi VN &nbsp; 092****688 👁
          </p>
        </div>

        {/* Right Tools Box */}
        <div className="footer-box right-tools-box">
          <button
            type="button"
            className="btn-tool-pill"
            onClick={() => setDefaults(true)}
          >
            <Settings size={15} /> Cấu hình mặc định
          </button>
          <button
            type="button"
            className="btn-tool-pill"
            onClick={() => setHelp(true)}
          >
            <BookOpen size={15} /> Hướng dẫn sử dụng
          </button>
        </div>
      </div>

      {/* Modals & Dialogs */}
      {help && <HelpDialog onClose={() => setHelp(false)} />}
      
      {changePickup && (
        <Modal
          title="Thay đổi địa chỉ lấy hàng"
          onClose={() => setChangePickup(false)}
          footer={<Button onClick={() => setChangePickup(false)}>Đóng</Button>}
        >
          <p>Địa chỉ kho hiện tại: <b>25 Hồ Mễ Trì, Phường Mễ Trì, Quận Nam Từ Liêm, Hà Nội</b></p>
          <p>Để thêm hoặc thay đổi kho lấy hàng, vui lòng liên hệ quản trị viên.</p>
        </Modal>
      )}

      {defaults && (
        <Modal
          title="Cấu hình mặc định"
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
              notify('Đã áp dụng cấu hình mặc định cho các ô trống.');
            }}
          >
            <Field
              label="Khối lượng mặc định (gr)"
              type="number"
              min={1}
              required
              value={weight}
              onChange={(e) => setWeight(e.target.valueAsNumber)}
            />
            <Field
              label="Thu hộ mặc định (đ)"
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
