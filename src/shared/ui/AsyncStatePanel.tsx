import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  FileQuestion,
  Inbox,
  LoaderCircle,
  MapPin,
  Package,
  RefreshCw,
  RotateCw,
  SearchX,
  Sparkles,
} from 'lucide-react';
import { Button } from './Button';

export type AsyncViewState =
  | 'loading'
  | 'empty'
  | 'error'
  | 'not-found'
  | 'forbidden'
  | 'processing'
  | 'stale';

const CONTENT: Record<
  AsyncViewState,
  { title: string; description: string; Icon: typeof Inbox }
> = {
  loading: {
    title: 'Đang tải dữ liệu',
    description: 'Hệ thống đang lấy thông tin mới nhất. Vui lòng chờ trong giây lát.',
    Icon: LoaderCircle,
  },
  empty: {
    title: 'Chưa có Order phù hợp',
    description: 'Không có đơn hàng phù hợp với điều kiện đang chọn.',
    Icon: Inbox,
  },
  error: {
    title: 'Không thể tải dữ liệu',
    description: 'Kết nối tới hệ thống đang gián đoạn. Dữ liệu của bạn vẫn được giữ nguyên.',
    Icon: AlertTriangle,
  },
  'not-found': {
    title: 'Không tìm thấy Order',
    description: 'Order không tồn tại, đã bị xóa hoặc mã truy cập không chính xác.',
    Icon: FileQuestion,
  },
  forbidden: {
    title: 'Bạn không có quyền truy cập',
    description: 'Order nằm ngoài phạm vi dữ liệu hoặc tài khoản chưa được cấp quyền phù hợp.',
    Icon: Ban,
  },
  processing: {
    title: 'Dữ liệu đang được xử lý',
    description: 'Thao tác đã được ghi nhận. Không đóng trang hoặc gửi lại yêu cầu.',
    Icon: LoaderCircle,
  },
  stale: {
    title: 'Order vừa được cập nhật',
    description: 'Dữ liệu trên màn hình không còn là phiên bản mới nhất. Hãy tải lại trước khi thao tác.',
    Icon: RefreshCw,
  },
};

export function AsyncStatePanel({
  state,
  title,
  description,
  actionLabel,
  onAction,
  compact = false,
}: {
  state: AsyncViewState;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}) {
  const content = CONTENT[state];
  const { Icon } = content;
  const animated = state === 'loading' || state === 'processing';

  if (state === 'not-found' && !compact) {
    return (
      <section className="async-state-panel state-not-found async-not-found" role="alert">
        <div className="async-not-found-copy">
          <span className="async-not-found-eyebrow">
            <Sparkles size={14} aria-hidden="true" />
            TRA CỨU ĐƠN HÀNG
          </span>
          <div className="async-not-found-code" aria-hidden="true">
            404
          </div>
          <strong>{title || content.title}</strong>
          <p>{description || content.description}</p>
          {onAction && (
            <Button className="async-not-found-action" onClick={onAction} variant="primary">
              <ArrowLeft size={16} />
              {actionLabel || 'Về danh sách Order'}
            </Button>
          )}
          <span className="async-not-found-tip">
            Bạn có thể kiểm tra lại mã đơn, mã vận đơn hoặc tìm kiếm từ danh sách.
          </span>
        </div>

        <div className="async-not-found-visual" aria-hidden="true">
          <div className="async-tech-line tech-line-one" />
          <div className="async-tech-line tech-line-two" />
          <span className="async-orbit orbit-one" />
          <span className="async-orbit orbit-two" />

          <div className="async-phone">
            <div className="async-phone-speaker" />
            <div className="async-phone-screen">
              <div className="async-phone-brand">
                <span><Package size={15} /></span>
                SuperPlatform
              </div>
              <div className="async-phone-search">
                <SearchX size={15} />
                Không có kết quả
              </div>
              <div className="async-phone-order-card">
                <span className="async-phone-order-icon"><Package size={20} /></span>
                <div>
                  <b>Order chưa được tìm thấy</b>
                  <i>Kiểm tra lại mã tra cứu</i>
                </div>
              </div>
              <div className="async-phone-route">
                <MapPin size={14} />
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="async-phone-home" />
          </div>

          <img
            className="async-brand-robot async-not-found-robot"
            src="/images/superplatform-robot-v1.png"
            alt=""
          />

          <span className="async-float-card float-package"><Package size={18} /></span>
          <span className="async-float-card float-pin"><MapPin size={18} /></span>
        </div>
      </section>
    );
  }

  if (state === 'empty' && !compact) {
    return (
      <section className="async-state-panel state-empty async-empty" role="status">
        <div className="async-empty-copy">
          <span className="async-empty-eyebrow">
            <SearchX size={14} aria-hidden="true" />
            KẾT QUẢ ĐƠN HÀNG
          </span>
          <strong>{title || content.title}</strong>
          <p>{description || content.description}</p>
          {onAction && (
            <Button className="async-empty-action" onClick={onAction} variant="primary">
              <RotateCw size={15} />
              {actionLabel || 'Xóa bộ lọc'}
            </Button>
          )}
          <span className="async-empty-tip">
            Thử kiểm tra lại từ khóa hoặc bỏ bớt điều kiện lọc để xem nhiều Order hơn.
          </span>
        </div>

        <div className="async-empty-visual" aria-hidden="true">
          <span className="async-empty-halo" />
          <span className="async-empty-dot dot-one" />
          <span className="async-empty-dot dot-two" />
          <span className="async-empty-dot dot-three" />
          <img
            className="async-brand-robot async-empty-robot"
            src="/images/superplatform-robot-v1.png"
            alt=""
            loading="lazy"
          />
          <div className="async-empty-result-card">
            <span><SearchX size={17} /></span>
            <div>
              <b>Không tìm thấy Order</b>
              <i>Hãy thử điều kiện khác</i>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`async-state-panel state-${state}${compact ? ' is-compact' : ''}`}
      role={animated ? 'status' : 'alert'}
      aria-live="polite"
    >
      <span className={`async-state-icon${animated ? ' is-spinning' : ''}`}>
        <Icon size={compact ? 22 : 30} aria-hidden="true" />
      </span>
      <div className="async-state-copy">
        <strong>{title || content.title}</strong>
        <p>{description || content.description}</p>
      </div>
      {onAction && (
        <Button onClick={onAction} variant={state === 'error' ? 'primary' : undefined}>
          <RotateCw size={14} />
          {actionLabel || 'Thử lại'}
        </Button>
      )}
    </section>
  );
}
