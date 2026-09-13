import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Printer,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Pencil,
  Trash2,
  Star,
  ShieldCheck,
  QrCode,
  Barcode,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';
import { useToast } from '@/shared/ui/toast-context';
import { initialPrintTemplates, type PrintTemplate } from '../model/types';

export default function PrintTemplatesPage() {
  const notify = useToast();
  const outletCtx = useOutletContext<{ isInternal?: boolean }>();
  const isInternal = outletCtx?.isInternal ?? false;

  const [templates, setTemplates] = useState<PrintTemplate[]>(initialPrintTemplates);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [modalMode, setModalMode] = useState<'add' | 'edit'>();
  const [editingTemplate, setEditingTemplate] = useState<Partial<PrintTemplate>>({});
  const [previewTemplate, setPreviewTemplate] = useState<PrintTemplate | null>(null);

  const filtered = templates.filter((t) => {
    const matchSearch =
      t.code.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.printerType.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
        ? t.isActive
        : !t.isActive;
    return matchSearch && matchStatus;
  });

  const handleToggleActive = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t)),
    );
    notify('Đã cập nhật trạng thái hoạt động của tem in.');
  };

  const handleSetDefault = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => ({ ...t, isDefault: t.id === id })),
    );
    notify('Đã thiết lập mẫu tem mặc định hệ thống thành công.');
  };

  const handleDelete = (id: string, code: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa mẫu tem ${code}?`)) {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      notify(`Đã xóa mẫu tem ${code}.`);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate.code || !editingTemplate.name) {
      notify('Vui lòng nhập đầy đủ Mã tem và Tên tem!');
      return;
    }

    if (modalMode === 'add') {
      const newTmpl: PrintTemplate = {
        id: 'tmpl-' + Date.now(),
        code: editingTemplate.code.toUpperCase(),
        name: editingTemplate.name,
        dimensions: editingTemplate.dimensions || '100 mm x 150 mm',
        widthMm: editingTemplate.widthMm || 100,
        heightMm: editingTemplate.heightMm || 150,
        orientation: editingTemplate.orientation || 'portrait',
        printerType: editingTemplate.printerType || 'Máy in tem nhiệt',
        description: editingTemplate.description || '',
        isDefault: !!editingTemplate.isDefault,
        isActive: editingTemplate.isActive !== undefined ? editingTemplate.isActive : true,
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
      };
      if (newTmpl.isDefault) {
        setTemplates((prev) =>
          prev.map((t) => ({ ...t, isDefault: false })).concat(newTmpl),
        );
      } else {
        setTemplates((prev) => [...prev, newTmpl]);
      }
      notify(`Đã tạo mẫu tem in ${newTmpl.code} thành công.`);
    } else if (modalMode === 'edit' && editingTemplate.id) {
      setTemplates((prev) =>
        prev.map((t) => {
          if (t.id === editingTemplate.id) {
            return { ...t, ...editingTemplate } as PrintTemplate;
          }
          if (editingTemplate.isDefault) return { ...t, isDefault: false };
          return t;
        }),
      );
      notify(`Đã cập nhật mẫu tem in ${editingTemplate.code}.`);
    }

    setModalMode(undefined);
    setEditingTemplate({});
  };

  return (
    <div className="print-templates-page">
      {/* Page Title */}
      <div className="title-row" style={{ marginBottom: 20 }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 12, margin: 0 }}>
            Quản lý mẫu tem in
            <span
              style={{
                fontSize: 12,
                background: '#ffe5ec',
                color: '#ed003a',
                padding: '4px 12px',
                borderRadius: 20,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <ShieldCheck size={14} /> {isInternal ? 'NỘI BỘ — CSKH / OPS / ADMIN' : 'CHẾ ĐỘ NỘI BỘ'}
            </span>
          </h1>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 13.5 }}>
            Quản lý cấu hình danh sách khổ tem in, kích thước giấy, định dạng barcode và loại máy in tương thích.
          </p>
        </div>

        <Button
          variant="primary"
          style={{ borderRadius: 9999, padding: '10px 22px' }}
          onClick={() => {
            setEditingTemplate({
              code: '',
              name: '',
              dimensions: '100 mm x 150 mm',
              widthMm: 100,
              heightMm: 150,
              orientation: 'portrait',
              printerType: 'Máy in tem nhiệt',
              description: '',
              isDefault: false,
              isActive: true,
            });
            setModalMode('add');
          }}
        >
          <Plus size={16} /> Thêm mẫu tem in mới
        </Button>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div className="card body" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#eff6ff',
              color: '#3b82f6',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Printer size={22} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1e293b' }}>
              {templates.length}
            </div>
            <div style={{ fontSize: 12.5, color: '#64748b' }}>Tổng số mẫu tem hệ thống</div>
          </div>
        </div>

        <div className="card body" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#f0fdf4',
              color: '#16a34a',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <CheckCircle size={22} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#16a34a' }}>
              {templates.filter((t) => t.isActive).length}
            </div>
            <div style={{ fontSize: 12.5, color: '#64748b' }}>Mẫu tem đang hoạt động</div>
          </div>
        </div>

        <div className="card body" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#fff7ed',
              color: '#ea580c',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Star size={22} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#ea580c' }}>
              {templates.find((t) => t.isDefault)?.code || 'K46'} (Default)
            </div>
            <div style={{ fontSize: 12.5, color: '#64748b' }}>Mẫu tem mặc định hệ thống</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="card body" style={{ marginBottom: 20, padding: '14px 18px' }}>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: '#f1f5f9',
              borderRadius: 30,
              padding: '0 16px',
              flex: '1 1 300px',
            }}
          >
            <Search size={18} style={{ color: '#64748b' }} />
            <input
              placeholder="Tìm kiếm mã tem, kích thước, tên máy in..."
              style={{
                border: 'none',
                background: 'transparent',
                height: 38,
                width: '100%',
                outline: 'none',
                fontSize: 13.5,
              }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#64748b' }}>Trạng thái:</span>
            {(['all', 'active', 'inactive'] as const).map((st) => (
              <button
                key={st}
                type="button"
                className={`tab ${statusFilter === st ? 'active' : ''}`}
                style={{ padding: '6px 14px', fontSize: 12.5 }}
                onClick={() => setStatusFilter(st)}
              >
                {st === 'all'
                  ? 'Tất cả'
                  : st === 'active'
                  ? 'Đang dùng'
                  : 'Tạm dừng'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Table */}
      <section className="card body">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Mã Tem</th>
                <th>Tên Mẫu & Kích Thước</th>
                <th>Máy In Tương Thích</th>
                <th>Mô Tả / Ứng Dụng</th>
                <th>Mặc Định System</th>
                <th>Trạng Thái</th>
                <th style={{ textAlign: 'right' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td>
                    <span
                      style={{
                        background: '#e2e8f0',
                        color: '#1e293b',
                        padding: '4px 10px',
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: 13,
                        display: 'inline-block',
                      }}
                    >
                      {t.code}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{t.name}</div>
                    <small style={{ color: '#64748b' }}>
                      {t.dimensions} ({t.orientation === 'portrait' ? 'Dạng đứng' : 'Dạng ngang'})
                    </small>
                  </td>
                  <td>
                    <span style={{ fontSize: 12.5, color: '#334155' }}>{t.printerType}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: 12.5, color: '#64748b' }}>{t.description}</span>
                  </td>
                  <td>
                    {t.isDefault ? (
                      <span
                        style={{
                          background: '#ffedd5',
                          color: '#c2410c',
                          padding: '3px 10px',
                          borderRadius: 20,
                          fontSize: 11.5,
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <Star size={12} fill="#c2410c" /> Mặc định
                      </span>
                    ) : (
                      <button
                        type="button"
                        style={{
                          background: 'none',
                          border: '1px dashed #cbd5e1',
                          color: '#64748b',
                          padding: '3px 8px',
                          borderRadius: 14,
                          fontSize: 11,
                          cursor: 'pointer',
                        }}
                        onClick={() => handleSetDefault(t.id)}
                      >
                        Đặt mặc định
                      </button>
                    )}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <button
                      type="button"
                      style={{
                        background: t.isActive ? '#dcfce7' : '#f1f5f9',
                        color: t.isActive ? '#15803d' : '#64748b',
                        border: 'none',
                        padding: '6px 14px',
                        borderRadius: 20,
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        whiteSpace: 'nowrap',
                      }}
                      onClick={() => handleToggleActive(t.id)}
                    >
                      {t.isActive ? (
                        <>
                          <CheckCircle size={14} /> Đang dùng
                        </>
                      ) : (
                        <>
                          <XCircle size={14} /> Tạm dừng
                        </>
                      )}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
                      <button
                        type="button"
                        title="Xem trước mẫu tem"
                        className="btn-soft-grey"
                        style={{
                          width: 34,
                          height: 34,
                          padding: 0,
                          borderRadius: '50%',
                          display: 'grid',
                          placeItems: 'center',
                        }}
                        onClick={() => setPreviewTemplate(t)}
                      >
                        <Eye size={15} />
                      </button>

                      <button
                        type="button"
                        title="Chỉnh sửa mẫu tem"
                        className="btn-soft-grey"
                        style={{
                          width: 34,
                          height: 34,
                          padding: 0,
                          borderRadius: '50%',
                          display: 'grid',
                          placeItems: 'center',
                        }}
                        onClick={() => {
                          setEditingTemplate({ ...t });
                          setModalMode('edit');
                        }}
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        title="Xóa mẫu tem"
                        className="btn-soft-grey"
                        style={{
                          width: 34,
                          height: 34,
                          padding: 0,
                          borderRadius: '50%',
                          display: 'grid',
                          placeItems: 'center',
                          color: '#ef4444',
                        }}
                        onClick={() => handleDelete(t.id, t.code)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 30, color: '#64748b' }}>
                    Không tìm thấy mẫu tem in phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal Add / Edit Template */}
      {modalMode && (
        <Modal
          title={modalMode === 'add' ? 'Thêm mẫu tem in mới' : `Chỉnh sửa mẫu tem ${editingTemplate.code}`}
          onClose={() => {
            setModalMode(undefined);
            setEditingTemplate({});
          }}
        >
          <form onSubmit={handleSaveForm} style={{ display: 'grid', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <label className="field">
                <span>Mã tem (Short Code) *</span>
                <input
                  placeholder="Ví dụ: K46, A7, SPE..."
                  value={editingTemplate.code || ''}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, code: e.target.value })}
                  required
                />
              </label>

              <label className="field">
                <span>Kích thước (Dimensions)</span>
                <input
                  placeholder="Ví dụ: 4 in x 6 in (100x150mm)"
                  value={editingTemplate.dimensions || ''}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, dimensions: e.target.value })}
                />
              </label>
            </div>

            <label className="field">
              <span>Tên mẫu tem đầy đủ *</span>
              <input
                placeholder="Ví dụ: K46 (4 in x 6 in)"
                value={editingTemplate.name || ''}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                required
              />
            </label>

            <label className="field">
              <span>Loại máy in tương thích</span>
              <input
                placeholder="Ví dụ: Máy in nhiệt Xprinter, Zebra..."
                value={editingTemplate.printerType || ''}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, printerType: e.target.value })}
              />
            </label>

            <label className="field">
              <span>Mô tả & Ứng dụng nghiệp vụ</span>
              <textarea
                rows={2}
                placeholder="Mô tả chi tiết trường hợp sử dụng mẫu tem này..."
                value={editingTemplate.description || ''}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
              />
            </label>

            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <label className="choice">
                <input
                  type="checkbox"
                  checked={!!editingTemplate.isDefault}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, isDefault: e.target.checked })}
                />
                <span>Đặt làm mẫu tem mặc định hệ thống</span>
              </label>

              <label className="choice">
                <input
                  type="checkbox"
                  checked={editingTemplate.isActive !== false}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, isActive: e.target.checked })}
                />
                <span>Kích hoạt hoạt động</span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
              <Button type="button" onClick={() => setModalMode(undefined)}>
                Hủy bỏ
              </Button>
              <Button type="submit" variant="primary">
                {modalMode === 'add' ? 'Tạo mẫu tem' : 'Lưu thay đổi'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Preview Printable Label */}
      {previewTemplate && (
        <Modal
          title={`Mô phỏng mẫu tem in: ${previewTemplate.name}`}
          onClose={() => setPreviewTemplate(null)}
        >
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div
              style={{
                width: 320,
                margin: '0 auto',
                border: '2px solid #000',
                borderRadius: 8,
                padding: 14,
                background: '#fff',
                fontFamily: 'monospace, sans-serif',
                textAlign: 'left',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              }}
            >
              {/* Top Barcode Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '2px solid #000',
                  paddingBottom: 8,
                  marginBottom: 10,
                }}
              >
                <div>
                  <strong style={{ fontSize: 16, color: '#ed003a' }}>SUPERPLATFORM</strong>
                  <div style={{ fontSize: 10, color: '#555' }}>NVC: SuperShip Express</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      background: '#000',
                      color: '#fff',
                      padding: '2px 8px',
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    {previewTemplate.code}
                  </span>
                </div>
              </div>

              {/* Waybill Barcode */}
              <div style={{ textAlign: 'center', margin: '12px 0', borderBottom: '1px dashed #ccc', paddingBottom: 10 }}>
                <Barcode size={36} style={{ margin: '0 auto' }} />
                <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: 1 }}>826883962104</div>
              </div>

              {/* Sender & Recipient Info */}
              <div style={{ fontSize: 11, lineHeight: 1.5, marginBottom: 10 }}>
                <div>
                  <b>Từ:</b> S983262 - SUPERSHIP TEST (SĐT: 0901234567)
                </div>
                <div>
                  <b>Đến:</b> Nguyễn Văn A (SĐT: 0987****321)
                </div>
                <div>
                  <b>Địa chỉ:</b> 123 Đường Nguyễn Trãi, Q.5, TP. Hồ Chí Minh
                </div>
              </div>

              {/* Product & COD Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                  background: '#f8fafc',
                  padding: 8,
                  borderRadius: 4,
                  fontSize: 11,
                  marginBottom: 10,
                }}
              >
                <div>
                  <div>Sản phẩm: <b>Tai nghe Bluetooth x 1</b></div>
                  <div>Trọng lượng: <b>350g</b></div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10, color: '#666' }}>THU HỘ COD</div>
                  <strong style={{ fontSize: 14, color: '#ed003a' }}>450.000 đ</strong>
                </div>
              </div>

              {/* Bottom QR & Note */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid #000',
                  paddingTop: 8,
                }}
              >
                <div style={{ fontSize: 9.5, color: '#555' }}>
                  Ghi chú: Cho xem hàng, không thử.
                  <br />
                  Tem in mẫu khổ <b>{previewTemplate.dimensions}</b>
                </div>
                <QrCode size={34} />
              </div>
            </div>

            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 10 }}>
              <Button onClick={() => setPreviewTemplate(null)}>Đóng</Button>
              <Button
                variant="primary"
                onClick={() => {
                  notify(`Đã gửi lệnh in thử mẫu tem ${previewTemplate.code} đến máy in.`);
                  setPreviewTemplate(null);
                }}
              >
                In thử tem mẫu ({previewTemplate.code})
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
