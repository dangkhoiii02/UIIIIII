import { Link, useLocation } from 'react-router-dom';
import { Card } from '@/shared/ui/Card';
import { navigation } from '../config/navigation';
export function PlaceholderPage() {
  const { pathname } = useLocation();
  const title = navigation.find((item) => item.path === pathname)?.label;
  return (
    <>
      <h1>{title ?? 'Không tìm thấy trang'}</h1>
      <Card title={title ?? 'Trang không tồn tại'}>
        <div className="empty">
          <p>
            {title
              ? 'Phần giao diện này sẽ được thiết kế ở bước tiếp theo.'
              : 'Đường dẫn này không tồn tại.'}
          </p>
          <Link className="btn primary" to="/create">
            Tạo đơn hàng
          </Link>{' '}
          <Link className="btn" to="/orders">
            Xem đơn hàng
          </Link>
        </div>
      </Card>
    </>
  );
}
