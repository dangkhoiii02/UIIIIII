import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  FileSpreadsheet,
  Layers3,
  Plus,
  RefreshCw,
  Search,
  TriangleAlert,
  XCircle,
} from 'lucide-react';
import { dateTime, downloadCsv } from '@/shared/lib/format';
import {
  ORDER_BATCH_SEED,
  type BatchItemStatus,
  type BatchStatus,
  type OrderBatch,
} from '../model/batches';
import './order-batches.css';

const DEFAULT_BATCH = ORDER_BATCH_SEED[0]!;

const batchStatus: Record<BatchStatus, { label: string; className: string }> = {
  COMPLETED: { label: 'Hoàn tất', className: 'is-success' },
  PARTIAL: { label: 'Hoàn tất một phần', className: 'is-warning' },
  PROCESSING: { label: 'Đang xử lý', className: 'is-processing' },
  FAILED: { label: 'Thất bại', className: 'is-failed' },
};

const itemStatus: Record<BatchItemStatus, { label: string; className: string }> = {
  SUCCESS: { label: 'Thành công', className: 'is-success' },
  FAILED: { label: 'Thất bại', className: 'is-failed' },
  PROCESSING: { label: 'Đang xử lý', className: 'is-processing' },
};

function exportBatch(batch: OrderBatch) {
  downloadCsv(`${batch.id}-ket-qua.csv`, [
    [
      'Dòng',
      'Mã đơn Shop',
      'Mã đơn SuperPlatform',
      'Người nhận',
      'Số điện thoại',
      'Kết quả',
      'Mã lỗi',
      'Giải trình lỗi',
    ],
    ...batch.items
      .slice()
      .sort((a, b) => a.line - b.line)
      .map((item) => [
        item.line,
        item.clientOrderCode,
        item.orderId ?? '',
        item.receiverName,
        item.receiverPhone,
        itemStatus[item.status].label,
        item.errorCode ?? '',
        item.errorMessage ?? '',
      ]),
  ]);
}

export default function OrderBatchesPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<BatchStatus | 'ALL'>('ALL');
  const [itemFilter, setItemFilter] = useState<BatchItemStatus | 'ALL'>('ALL');
  const [selectedId, setSelectedId] = useState(DEFAULT_BATCH.id);

  const batches = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return ORDER_BATCH_SEED.filter(
      (batch) =>
        (status === 'ALL' || batch.status === status) &&
        (!keyword ||
          batch.id.toLowerCase().includes(keyword) ||
          batch.sourceFile.toLowerCase().includes(keyword)),
    );
  }, [query, status]);

  const selected =
    ORDER_BATCH_SEED.find((batch) => batch.id === selectedId) ?? batches[0] ?? DEFAULT_BATCH;
  const visibleItems = selected.items
    .filter((item) => itemFilter === 'ALL' || item.status === itemFilter)
    .slice()
    .sort((a, b) => a.line - b.line);
  const totals = ORDER_BATCH_SEED.reduce(
    (sum, batch) => ({
      success: sum.success + batch.success,
      failed: sum.failed + batch.failed,
      processing: sum.processing + batch.processing,
    }),
    { success: 0, failed: 0, processing: 0 },
  );
  const totalRows = totals.success + totals.failed + totals.processing;
  const successRate = Math.round((totals.success / totalRows) * 100);

  const retryFailedItems = () => {
    const failedItems = selected.items.filter((item) => item.status === 'FAILED');
    navigate(selected.addressLevel === 2 ? '/sheet2' : '/sheet3', {
      state: {
        retryBatch: {
          batchId: selected.id,
          sourceFile: selected.sourceFile,
          addressLevel: selected.addressLevel,
          items: failedItems,
        },
      },
    });
  };

  return (
    <div className="order-batches-page">
      <div className="batch-page-header">
        <div className="batch-title-area">
          <button
            type="button"
            className="btn-round-back"
            onClick={() => navigate(-1)}
            aria-label="Quay lại"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="batch-page-kicker">S04 · Theo dõi batch</div>
            <h1>Quản lý Đơn hàng loạt</h1>
            <p>Theo dõi lịch sử và kết quả độc lập của từng dòng trong mỗi lần tạo đơn.</p>
          </div>
        </div>
        <div className="batch-page-actions">
          <button className="batch-btn secondary" onClick={() => exportBatch(selected)}>
            <Download size={16} /> Tải kết quả
          </button>
          <button className="batch-btn primary" onClick={() => navigate('/sheet3')}>
            <Plus size={17} /> Tạo batch mới
          </button>
        </div>
      </div>

      <section className="batch-summary-grid" aria-label="Thống kê batch">
        <div className="batch-summary-card neutral">
          <span className="summary-icon">
            <Layers3 size={20} />
          </span>
          <div>
            <small>Tổng batch</small>
            <strong>{ORDER_BATCH_SEED.length}</strong>
            <span>{totalRows} dòng đã tiếp nhận</span>
          </div>
        </div>
        <div className="batch-summary-card success">
          <span className="summary-icon">
            <CheckCircle2 size={20} />
          </span>
          <div>
            <small>Dòng thành công</small>
            <strong>{totals.success}</strong>
            <span>{successRate}% tổng số dòng</span>
          </div>
        </div>
        <div className="batch-summary-card failed">
          <span className="summary-icon">
            <XCircle size={20} />
          </span>
          <div>
            <small>Dòng thất bại</small>
            <strong>{totals.failed}</strong>
            <span>Có giải trình chi tiết</span>
          </div>
        </div>
        <div className="batch-summary-card processing">
          <span className="summary-icon">
            <Clock3 size={20} />
          </span>
          <div>
            <small>Đang xử lý</small>
            <strong>{totals.processing}</strong>
            <span>Đang chờ kết quả</span>
          </div>
        </div>
      </section>

      <section className="batch-toolbar">
        <label className="batch-search">
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm theo mã batch hoặc tên file"
          />
        </label>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as BatchStatus | 'ALL')}
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="PROCESSING">Đang xử lý</option>
          <option value="COMPLETED">Hoàn tất</option>
          <option value="PARTIAL">Hoàn tất một phần</option>
          <option value="FAILED">Thất bại</option>
        </select>
      </section>

      <div className="batch-master-detail">
        <section className="batch-master card">
          <div className="batch-panel-title">
            <div>
              <strong>Lịch sử batch</strong>
              <span>{batches.length} kết quả</span>
            </div>
            <RefreshCw size={16} />
          </div>
          <div className="batch-list">
            {batches.map((batch) => {
              const state = batchStatus[batch.status];
              const percent = Math.round(((batch.success + batch.failed) / batch.total) * 100);
              return (
                <button
                  key={batch.id}
                  className={`batch-list-item ${selected.id === batch.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedId(batch.id);
                    setItemFilter('ALL');
                  }}
                >
                  <span className="batch-file-icon">
                    <FileSpreadsheet size={20} />
                  </span>
                  <span className="batch-list-content">
                    <span className="batch-list-top">
                      <b>{batch.id}</b>
                      <em className={state.className}>{state.label}</em>
                    </span>
                    <span className="batch-file-name">{batch.sourceFile}</span>
                    <span className="batch-list-meta">
                      {dateTime(batch.createdAt)} · Địa chỉ {batch.addressLevel} cấp
                    </span>
                    <span className="batch-progress">
                      <i style={{ width: `${percent}%` }} />
                    </span>
                    <span className="batch-counts">
                      <i className="success">{batch.success} thành công</i>
                      <i className="failed">{batch.failed} lỗi</i>
                      {!!batch.processing && <i className="processing">{batch.processing} xử lý</i>}
                    </span>
                  </span>
                  <ChevronRight size={18} className="batch-chevron" />
                </button>
              );
            })}
            {!batches.length && <div className="batch-empty">Không tìm thấy batch phù hợp.</div>}
          </div>
        </section>

        <section className="batch-detail card">
          <div className="batch-detail-header">
            <div className="batch-detail-heading">
              <span className="batch-detail-file-icon">
                <FileSpreadsheet size={20} />
              </span>
              <div>
                <div className="batch-detail-title-row">
                  <h2>{selected.id}</h2>
                  <span className={`batch-state-pill ${batchStatus[selected.status].className}`}>
                    {batchStatus[selected.status].label}
                  </span>
                </div>
                <p>
                  {selected.sourceFile} · {selected.createdBy} · {dateTime(selected.createdAt)}
                </p>
              </div>
            </div>
            <button className="batch-btn secondary compact" onClick={() => exportBatch(selected)}>
              <Download size={15} /> Xuất CSV
            </button>
          </div>

          <div className="batch-result-tabs" role="group" aria-label="Lọc kết quả từng dòng">
            {(
              [
                ['ALL', `Tất cả (${selected.total})`],
                ['SUCCESS', `Thành công (${selected.success})`],
                ['FAILED', `Thất bại (${selected.failed})`],
                ['PROCESSING', `Đang xử lý (${selected.processing})`],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                className={itemFilter === value ? 'active' : ''}
                onClick={() => setItemFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="batch-items-table-wrap">
            <table className="batch-items-table">
              <thead>
                <tr>
                  <th>Dòng</th>
                  <th>Mã đơn của Shop</th>
                  <th>Người nhận</th>
                  <th>Kết quả</th>
                  <th>Mã đơn / Giải trình lỗi</th>
                </tr>
              </thead>
              <tbody>
                {visibleItems.map((item) => {
                  const state = itemStatus[item.status];
                  return (
                    <tr key={`${selected.id}-${item.line}`}>
                      <td>
                        <b>{item.line}</b>
                      </td>
                      <td>{item.clientOrderCode}</td>
                      <td>
                        <strong>{item.receiverName}</strong>
                        <span>{item.receiverPhone}</span>
                      </td>
                      <td>
                        <span className={`batch-item-state ${state.className}`}>{state.label}</span>
                      </td>
                      <td>
                        {item.orderId ? (
                          <button
                            className="batch-order-link"
                            onClick={() => navigate(`/orders/${item.orderId}`)}
                          >
                            {item.orderId} <ChevronRight size={14} />
                          </button>
                        ) : item.errorMessage ? (
                          <div className="batch-error-detail">
                            <b>
                              <TriangleAlert size={14} /> {item.errorCode}
                            </b>
                            <span>{item.errorMessage}</span>
                          </div>
                        ) : (
                          <span className="batch-processing-text">Đang chờ kết quả xử lý…</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {selected.failed > 0 && (
            <div className="batch-detail-footer">
              <span>Các dòng lỗi không ảnh hưởng đến Order đã tạo thành công.</span>
              <button
                className="batch-btn retry"
                onClick={retryFailedItems}
              >
                <RefreshCw size={15} /> Xử lý lại dòng lỗi
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
