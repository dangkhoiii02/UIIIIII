import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
export function RouteErrorPage() {
  const error = useRouteError();
  return (
    <div className="empty" role="alert">
      <h1>Không thể mở màn hình</h1>
      <p>{isRouteErrorResponse(error) ? error.statusText : 'Vui lòng tải lại trang để thử lại.'}</p>
      <a className="btn primary" href="/create">
        Về tạo đơn
      </a>
    </div>
  );
}
