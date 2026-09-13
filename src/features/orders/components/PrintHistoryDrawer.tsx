import { Printer, X, FileText, User, Calendar } from 'lucide-react';
import type { Order } from '../model/types';

interface PrintRecord {
  id: string;
  printedAt: string;
  printedBy: string;
  waybill: string;
  templateType: string;
  status: 'Thành công' | 'Thất bại';
}

export function PrintHistoryDrawer({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  const printRecords: PrintRecord[] = [
    {
      id: 'P101',
      printedAt: '12/09/2026 11:35',
      printedBy: 'S983262 (Shop)',
      waybill: order.id,
      templateType: 'Tem nhiệt K46 (100x50mm)',
      status: 'Thành công',
    },
    {
      id: 'P102',
      printedAt: '12/09/2026 14:02',
      printedBy: 'S983262 (Shop)',
      waybill: order.id,
      templateType: 'Tem nhiệt K46 (100x50mm)',
      status: 'Thành công',
    },
  ];

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-container" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-row">
            <Printer size={18} className="red-icon" />
            <h3>Lịch sử in nhãn — {order.id}</h3>
          </div>
          <button type="button" className="btn-close-drawer" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          <p className="drawer-desc">
            Danh sách tất cả các lần in hoặc in lại tem nhãn vận chuyển đã phát sinh cho đơn hàng này.
          </p>

          <div className="print-records-list">
            {printRecords.map((rec, idx) => (
              <div key={rec.id} className="print-record-card">
                <div className="record-badge-num">Lần {idx + 1}</div>
                <div className="record-details">
                  <div className="record-meta-line">
                    <span>
                      <Calendar size={13} /> {rec.printedAt}
                    </span>
                    <span className="tag-success">{rec.status}</span>
                  </div>
                  <div className="record-meta-line">
                    <span>
                      <User size={13} /> Người in: <b>{rec.printedBy}</b>
                    </span>
                  </div>
                  <div className="record-meta-line">
                    <span>
                      <FileText size={13} /> Khổ tem: <b>{rec.templateType}</b>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
