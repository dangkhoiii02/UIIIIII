import { useLocation, useNavigate } from 'react-router-dom';
import { AsyncStatePanel } from '@/shared/ui/AsyncStatePanel';

export function AccessDeniedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  return (
    <div className="route-state-page">
      <div className="route-state-code">403</div>
      <AsyncStatePanel
        state="forbidden"
        title="Không có quyền truy cập trang"
        description={
          from
            ? `Tài khoản hiện tại không được phép truy cập “${from}”. Hãy chuyển đúng vai trò hoặc liên hệ quản trị viên.`
            : undefined
        }
        actionLabel="Về danh sách Order"
        onAction={() => navigate('/orders', { replace: true })}
      />
    </div>
  );
}

