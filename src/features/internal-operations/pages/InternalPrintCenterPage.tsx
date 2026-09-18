import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Clock3, Eye, FileClock, History, Search, UserRound } from 'lucide-react';
import { useOrders } from '@/features/orders';

export default function InternalPrintCenterPage() {
  const { orders } = useOrders();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('orderId') || '');
  const records = useMemo(
    () =>
      orders
        .flatMap((order) =>
          (order.printHistory || []).map((record, index) => ({
            ...record,
            order,
            printNumber: index + 1,
          })),
        )
        .sort((a, b) => new Date(b.printedAt).getTime() - new Date(a.printedAt).getTime()),
    [orders],
  );
  const filtered = records.filter((record) =>
    [record.order.id, record.order.name, record.waybill, record.printedBy, record.templateType]
      .join(' ')
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  const printedOrders = new Set(records.map((record) => record.order.id)).size;
  const internalPrints = records.filter((record) => record.actorType === 'internal').length;

  return (
    <div className="internal-page">
      <div className="internal-page-heading">
        <div>
          <span className="internal-kicker">I06–I07 · NHẬT KÝ NỘI BỘ</span>
          <h1>Lịch sử in nhãn</h1>
          <p>
            Tra cứu ai đã in, thời điểm in và tổng số lần in của từng đơn hàng. Trang này chỉ xem
            lịch sử, không thực hiện in nhãn.
          </p>
        </div>
      </div>

      <section className="internal-print-history-summary">
        <div>
          <span>Tổng lượt in</span>
          <strong>{records.length}</strong>
          <small>Tất cả nguồn</small>
        </div>
        <div>
          <span>Đơn đã in</span>
          <strong>{printedOrders}</strong>
          <small>Đơn hàng khác nhau</small>
        </div>
        <div>
          <span>Nhân viên nội bộ in</span>
          <strong>{internalPrints}</strong>
          <small>Có truy vết người thực hiện</small>
        </div>
      </section>

      <section className="internal-workspace-card audit-section">
        <div className="internal-section-title print-history-title">
          <div>
            <History size={17} />
            <strong>Nhật ký in nhãn</strong>
          </div>
          <span>{filtered.length} bản ghi</span>
        </div>
        <label className="internal-search full print-history-search">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm mã đơn, mã vận đơn, người in hoặc mẫu nhãn"
          />
        </label>
        <div className="internal-table-wrap">
          <table className="internal-table internal-print-history-table">
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Đơn hàng</th>
                <th>Lần in</th>
                <th>Mã vận đơn</th>
                <th>Người in</th>
                <th>Mẫu nhãn</th>
                <th>Kết quả</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => (
                <tr key={record.id}>
                  <td>
                    <Clock3 size={13} /> {new Date(record.printedAt).toLocaleString('vi-VN')}
                  </td>
                  <td>
                    <strong>{record.order.id}</strong>
                    <small>{record.order.name}</small>
                  </td>
                  <td>
                    <b>Lần {record.printNumber}</b>
                  </td>
                  <td>
                    <code>{record.waybill}</code>
                  </td>
                  <td>
                    <span className="print-actor-cell">
                      <UserRound size={13} />
                      <span>
                        <b>{record.printedBy}</b>
                        <small>{record.actorType === 'internal' ? 'Nội bộ' : 'Cửa hàng'}</small>
                      </span>
                    </span>
                  </td>
                  <td>{record.templateType}</td>
                  <td>
                    <span className="internal-status done">
                      <FileClock size={12} /> {record.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="internal-icon-btn"
                      onClick={() => navigate(`/orders/${record.order.id}`)}
                      title="Xem chi tiết đơn hàng"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <div className="activity-empty-state">
                      Không tìm thấy lịch sử in nhãn phù hợp.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
