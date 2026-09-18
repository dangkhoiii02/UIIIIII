import { useMemo, useState } from 'react';
import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Inbox,
  MessageSquareText,
  Search,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { useToast } from '@/shared/ui/toast-context';
import { useSupport } from '../model/support-context';

type RequestStatus = 'PENDING' | 'PROCESSING' | 'APPROVED' | 'REJECTED';
type QueueTab = 'all' | RequestStatus;

interface ReviewRequest {
  id: string;
  orderId: string;
  category: string;
  content: string;
  createdAt: string;
  requester: string;
  priority: 'Khẩn' | 'Cao' | 'Thường';
  sla: string;
  status: RequestStatus;
}

const SEED_REQUESTS: ReviewRequest[] = [
  {
    id: 'REQ-260915-018',
    orderId: '102948123427',
    category: 'Giao lại',
    content: 'Người nhận xác nhận có thể nhận hàng trong giờ hành chính ngày mai.',
    createdAt: '15/09/2026 09:18',
    requester: 'AB Shop',
    priority: 'Khẩn',
    sla: 'Còn 35 phút',
    status: 'PENDING',
  },
  {
    id: 'REQ-260915-014',
    orderId: '772831094812',
    category: 'Chuyển hoàn',
    content: 'Cửa hàng yêu cầu xác nhận chuyển hoàn sau khi người nhận từ chối.',
    createdAt: '15/09/2026 08:42',
    requester: 'AB Shop',
    priority: 'Cao',
    sla: 'Còn 1 giờ 20 phút',
    status: 'PROCESSING',
  },
  {
    id: 'REQ-260914-091',
    orderId: '826883962104',
    category: 'Đổi thông tin',
    content: 'Điều chỉnh ghi chú giao hàng trước khi nhà vận chuyển tới lấy.',
    createdAt: '14/09/2026 16:05',
    requester: 'AB Shop',
    priority: 'Thường',
    sla: 'Đã hoàn tất',
    status: 'APPROVED',
  },
];

const STATUS_LABEL: Record<RequestStatus, string> = {
  PENDING: 'Chờ duyệt',
  PROCESSING: 'Đang xử lý',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
};

export default function RequestsPage() {
  const { tickets } = useSupport();
  const { isInternal = false } = useOutletContext<{ isInternal?: boolean }>();
  const navigate = useNavigate();
  const notify = useToast();
  const [searchParams] = useSearchParams();
  const [requests, setRequests] = useState(SEED_REQUESTS);
  const [tab, setTab] = useState<QueueTab>('all');
  const [query, setQuery] = useState(searchParams.get('orderId') || '');
  const [selectedId, setSelectedId] = useState(
    SEED_REQUESTS.find((request) => request.orderId === searchParams.get('orderId'))?.id || '',
  );
  const [reviewNote, setReviewNote] = useState('');

  const liveRequests = useMemo<ReviewRequest[]>(
    () =>
      tickets.map((ticket) => ({
        ...ticket,
        requester: 'Shop hiện tại',
        priority: 'Thường',
        sla: 'Còn 4 giờ',
        status: 'PENDING',
      })),
    [tickets],
  );
  const allRequests = [...liveRequests, ...requests];
  const filtered = allRequests.filter((request) => {
    if (tab !== 'all' && request.status !== tab) return false;
    return [request.id, request.orderId, request.category, request.requester]
      .join(' ')
      .toLowerCase()
      .includes(query.toLowerCase());
  });
  const selected = filtered.find((request) => request.id === selectedId) || filtered[0];

  const updateStatus = (status: RequestStatus) => {
    if (!selected) return;
    setRequests((current) =>
      current.map((request) => (request.id === selected.id ? { ...request, status } : request)),
    );
    notify(
      `${STATUS_LABEL[status]} yêu cầu ${selected.id}${reviewNote ? ` · ${reviewNote}` : ''}.`,
    );
    setReviewNote('');
  };

  if (!isInternal) {
    return (
      <div className="internal-page">
        <div className="internal-page-heading">
          <div>
            <span className="internal-kicker">YÊU CẦU CỦA SHOP</span>
            <h1>Yêu cầu hỗ trợ</h1>
            <p>Theo dõi các yêu cầu đã gửi tới SuperPlatform.</p>
          </div>
        </div>
        <section className="internal-workspace-card">
          {allRequests.length ? (
            <div className="internal-table-wrap">
              <table className="internal-table">
                <thead>
                  <tr>
                    <th>Mã yêu cầu</th>
                    <th>Đơn hàng</th>
                    <th>Danh mục</th>
                    <th>Nội dung</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {allRequests.map((request) => (
                    <tr key={request.id}>
                      <td>
                        <strong>{request.id}</strong>
                      </td>
                      <td>
                        <button
                          className="internal-link"
                          onClick={() => navigate(`/orders/${request.orderId}`)}
                        >
                          {request.orderId}
                        </button>
                      </td>
                      <td>{request.category}</td>
                      <td>{request.content}</td>
                      <td>
                        <span className={`internal-status ${request.status.toLowerCase()}`}>
                          {STATUS_LABEL[request.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="internal-empty">
              <Inbox size={28} />
              <strong>Chưa có yêu cầu hỗ trợ</strong>
              <span>Bạn có thể tạo yêu cầu từ danh sách đơn hàng.</span>
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="internal-page">
      <div className="internal-page-heading">
        <div>
          <span className="internal-kicker">I03 · CSKH / XỬ LÝ NGOẠI LỆ</span>
          <h1>Trung tâm xử lý yêu cầu đơn hàng</h1>
          <p>Hàng đợi tập trung để tiếp nhận, xác minh, duyệt hoặc từ chối yêu cầu can thiệp.</p>
        </div>
        <span className="internal-live-badge">
          <span /> Đang theo dõi hạn xử lý
        </span>
      </div>

      <div className="internal-metric-grid four">
        <div className="internal-metric-card amber">
          <Clock3 size={19} />
          <span>Chờ duyệt</span>
          <strong>{allRequests.filter((item) => item.status === 'PENDING').length}</strong>
        </div>
        <div className="internal-metric-card">
          <MessageSquareText size={19} />
          <span>Đang xử lý</span>
          <strong>{allRequests.filter((item) => item.status === 'PROCESSING').length}</strong>
        </div>
        <div className="internal-metric-card green">
          <CheckCircle2 size={19} />
          <span>Đã duyệt</span>
          <strong>{allRequests.filter((item) => item.status === 'APPROVED').length}</strong>
        </div>
        <div className="internal-metric-card red">
          <AlertTriangle size={19} />
          <span>Sắp quá hạn</span>
          <strong>
            {
              allRequests.filter((item) => item.priority === 'Khẩn' && item.status === 'PENDING')
                .length
            }
          </strong>
        </div>
      </div>

      <section className="internal-workspace-card request-workspace">
        <div className="request-master-pane">
          <div className="internal-toolbar stacked">
            <div className="internal-tabs">
              {(
                [
                  ['all', 'Tất cả'],
                  ['PENDING', 'Chờ duyệt'],
                  ['PROCESSING', 'Đang xử lý'],
                  ['APPROVED', 'Đã duyệt'],
                ] as Array<[QueueTab, string]>
              ).map(([value, label]) => (
                <button
                  key={value}
                  className={tab === value ? 'active' : ''}
                  onClick={() => setTab(value)}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="internal-search full">
              <Search size={16} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Mã yêu cầu, đơn hàng hoặc cửa hàng"
              />
            </label>
          </div>
          <div className="request-queue-list">
            {filtered.map((request) => (
              <button
                key={request.id}
                className={selected?.id === request.id ? 'selected' : ''}
                onClick={() => setSelectedId(request.id)}
              >
                <div>
                  <span className={`priority-dot priority-${request.priority.toLowerCase()}`} />
                  <strong>{request.category}</strong>
                  <span className={`internal-status ${request.status.toLowerCase()}`}>
                    {STATUS_LABEL[request.status]}
                  </span>
                </div>
                <b>{request.orderId}</b>
                <p>{request.content}</p>
                <small>
                  {request.requester} · {request.createdAt} · {request.sla}
                </small>
              </button>
            ))}
          </div>
        </div>

        <div className="request-review-pane">
          {selected ? (
            <>
              <div className="review-heading">
                <div>
                  <span>{selected.id}</span>
                  <h3>
                    {selected.category} · Đơn hàng {selected.orderId}
                  </h3>
                </div>
                <span className={`internal-status ${selected.status.toLowerCase()}`}>
                  {STATUS_LABEL[selected.status]}
                </span>
              </div>
              <div className="review-facts">
                <div>
                  <span>Người yêu cầu</span>
                  <b>{selected.requester}</b>
                </div>
                <div>
                  <span>Độ ưu tiên</span>
                  <b>{selected.priority}</b>
                </div>
                <div>
                  <span>Hạn xử lý</span>
                  <b>{selected.sla}</b>
                </div>
                <div>
                  <span>Khởi tạo</span>
                  <b>{selected.createdAt}</b>
                </div>
              </div>
              <div className="review-content">
                <strong>Nội dung yêu cầu</strong>
                <p>{selected.content}</p>
              </div>
              <button
                className="review-order-link"
                onClick={() => navigate(`/orders/${selected.orderId}`)}
              >
                <ShieldCheck size={15} /> Mở đơn hàng để xác minh
              </button>
              <label className="review-note">
                Ghi chú xử lý
                <textarea
                  rows={3}
                  value={reviewNote}
                  onChange={(event) => setReviewNote(event.target.value)}
                  placeholder="Lý do duyệt/từ chối hoặc hướng xử lý"
                />
              </label>
              <div className="review-actions">
                <button onClick={() => updateStatus('REJECTED')}>
                  <XCircle size={15} /> Từ chối
                </button>
                <button onClick={() => updateStatus('PROCESSING')}>
                  <Clock3 size={15} /> Tiếp nhận
                </button>
                <button className="approve" onClick={() => updateStatus('APPROVED')}>
                  <CheckCircle2 size={15} /> Duyệt yêu cầu
                </button>
              </div>
            </>
          ) : (
            <div className="internal-empty">
              <Inbox size={28} />
              <span>Chọn một yêu cầu để xem xét</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
