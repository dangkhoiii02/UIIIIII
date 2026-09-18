import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, LockKeyhole, ShieldAlert, ShieldCheck, Store } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

const PAGE_NAMES: Record<string, string> = {
  '/carrier-operations': 'Vận hành vận chuyển',
  '/internal-print': 'Trung tâm in Nội bộ',
  '/print-templates': 'Quản lý mẫu in',
};

export function AccessDeniedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    from?: string;
    attemptedArea?: 'shop' | 'internal';
  } | null;
  const from = state?.from;
  const isOpeningInternal = state?.attemptedArea !== 'shop';
  const destination = from ? PAGE_NAMES[from] || 'trang được yêu cầu' : 'khu vực Nội bộ';

  return (
    <div className="access-denied-page">
      <section className="access-denied-hero" role="alert" aria-labelledby="access-denied-title">
        <div className="access-denied-grid" aria-hidden="true" />

        <div className="access-denied-copy">
          <span className="access-denied-eyebrow">
            <ShieldAlert size={15} />
            KIỂM SOÁT TRUY CẬP
          </span>
          <div className="access-denied-code" aria-hidden="true">403</div>
          <h1 id="access-denied-title">
            {isOpeningInternal
              ? 'Trang này chỉ dành cho tài khoản Nội bộ'
              : 'Trang này chỉ dành cho tài khoản Shop'}
          </h1>
          <p>
            {isOpeningInternal
              ? `Bạn đang đăng nhập bằng tài khoản Shop nên không thể truy cập “${destination}”.`
              : `Tài khoản Nội bộ hiện tại không thể truy cập “${destination}” trong khu vực Shop.`}
          </p>

          <div className="access-denied-role-flow" aria-label="Thông tin phân quyền">
            <span className="access-role-pill current">
              <Store size={16} />
              {isOpeningInternal ? 'Shop S275518 - AB' : 'Tài khoản Nội bộ'}
            </span>
            <span className="access-role-divider">không có quyền vào</span>
            <span className="access-role-pill protected">
              <LockKeyhole size={16} />
              {isOpeningInternal ? 'Khu vực Nội bộ' : 'Khu vực Shop'}
            </span>
          </div>

          <Button
            className="access-denied-action"
            variant="primary"
            onClick={() => navigate('/orders', { replace: true })}
          >
            <ArrowLeft size={17} />
            {isOpeningInternal ? 'VỀ ĐƠN HÀNG SHOP' : 'VỀ ĐƠN HÀNG NỘI BỘ'}
          </Button>

          <span className="access-denied-help">
            Nếu cần sử dụng chức năng này, hãy chuyển sang đúng vai trò đã được cấp quyền hoặc liên hệ quản trị viên.
          </span>
        </div>

        <div className="access-denied-visual" aria-hidden="true">
          <span className="access-denied-orbit orbit-outer" />
          <span className="access-denied-orbit orbit-inner" />
          <div className="access-shield-badge">
            <ShieldCheck size={36} />
          </div>
          <img
            className="access-denied-robot"
            src="/images/superplatform-robot-v1.png"
            alt=""
          />
          <div className="access-denied-card">
            <span><LockKeyhole size={20} /></span>
            <div>
              <b>Quyền truy cập bị giới hạn</b>
              <small>Chỉ dành cho tài khoản đúng vai trò</small>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
