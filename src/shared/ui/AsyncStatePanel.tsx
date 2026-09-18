import {
  AlertTriangle,
  Ban,
  FileQuestion,
  Inbox,
  LoaderCircle,
  RefreshCw,
  RotateCw,
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
    title: 'Chưa có dữ liệu',
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

