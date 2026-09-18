import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { AsyncStatePanel } from '@/shared/ui/AsyncStatePanel';
export function RouteErrorPage() {
  const error = useRouteError();
  return (
    <div className="route-state-page">
      <AsyncStatePanel
        state="error"
        title="Không thể mở màn hình"
        description={
          isRouteErrorResponse(error)
            ? error.statusText || `Yêu cầu thất bại với mã ${error.status}.`
            : 'Ứng dụng gặp lỗi ngoài dự kiến. Dữ liệu đã nhập vẫn được giữ nếu trình duyệt còn phiên làm việc.'
        }
        actionLabel="Tải lại màn hình"
        onAction={() => window.location.reload()}
      />
    </div>
  );
}
