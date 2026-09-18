import { Printer, X, FileText, User, Calendar } from 'lucide-react';
import type { Order } from '../model/types';

export function PrintHistoryDrawer({ order, onClose }: { order: Order; onClose: () => void }) {
  const printRecords = [...(order.printHistory || [])].reverse();

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
            Đơn hàng đã được in <b>{printRecords.length} lần</b>. Dưới đây là người in, thời gian và
            mẫu nhãn của từng lần.
          </p>

          <div className="print-records-list">
            {printRecords.length === 0 && (
              <div className="activity-empty-state">Đơn hàng chưa được in nhãn.</div>
            )}
            {printRecords.map((rec, idx) => (
              <div key={rec.id} className="print-record-card">
                <div className="record-badge-num">Lần {printRecords.length - idx}</div>
                <div className="record-details">
                  <div className="record-meta-line">
                    <span>
                      <Calendar size={13} /> {new Date(rec.printedAt).toLocaleString('vi-VN')}
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
                  <div className="record-meta-line">
                    <span>
                      Mã vận đơn: <b>{rec.waybill}</b>
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
