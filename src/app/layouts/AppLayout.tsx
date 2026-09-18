import { Suspense, useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  BookOpen,
  Bell,
  ShieldCheck,
  Globe,
  Printer,
  ChevronDown,
  Check,
  ArrowUp,
  Store,
} from 'lucide-react';
import { internalNavigation, navigation } from '../config/navigation';
import { HelpDialog } from '@/shared/ui/HelpDialog';
import { Modal } from '@/shared/ui/Modal';
import { useToast } from '@/shared/ui/toast-context';

const SHOP_ONLY_PATHS = new Set(['/create', '/sheet3', '/sheet2', '/order-batches']);
const INTERNAL_ONLY_PATHS = new Set(['/carrier-operations', '/internal-print', '/print-templates']);

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [help, setHelp] = useState(false);
  const [isInternal, setIsInternal] = useState(() => {
    return (
      typeof window !== 'undefined' &&
      localStorage.getItem('superplatform:view_mode') === 'internal'
    );
  });
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [popup, setPopup] = useState<'account' | 'notifications'>();
  const [query, setQuery] = useState('');
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const notify = useToast();
  const { pathname } = useLocation();
  const isAccessDeniedPage = pathname === '/403';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (isInternal && SHOP_ONLY_PATHS.has(pathname)) {
      navigate('/403', {
        replace: true,
        state: { from: pathname, attemptedArea: 'shop' },
      });
    }
    if (!isInternal && INTERNAL_ONLY_PATHS.has(pathname)) {
      navigate('/403', {
        replace: true,
        state: { from: pathname, attemptedArea: 'internal' },
      });
    }
  }, [isInternal, navigate, pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setShowRoleDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectRole = (internal: boolean) => {
    setIsInternal(internal);
    localStorage.setItem('superplatform:view_mode', internal ? 'internal' : 'shop');
    setShowRoleDropdown(false);
    notify(
      internal
        ? 'Đã chuyển sang: 🔒 Giao diện Nội bộ (Quản trị / CSKH).'
        : 'Đã chuyển sang: 🏪 Giao diện Shop (S275518 - AB).',
    );
  };

  const handleSelectPublic = () => {
    setShowRoleDropdown(false);
    notify('Đã chuyển sang giao diện tra cứu công khai dành cho Người nhận.');
    navigate('/tracking');
  };

  return (
    <div
      className={[
        'app-shell',
        collapsed ? 'collapsed' : '',
        isAccessDeniedPage ? 'access-denied-shell' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <aside id="sidebar">
        <Link className="brand" to="/orders">
          <div className="brand-logo-wrap">
            <svg
              className="brand-platform-mark"
              width="44"
              height="44"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M24 4L43 14L24 24L5 14L24 4Z"
                stroke="white"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <path
                d="M5 23L24 33L43 23"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 32L24 42L43 32"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="brand-text">
              <strong className="brand-title">SuperPlatform</strong>
              <small className="brand-subtitle">NỀN TẢNG QUẢN LÝ ĐƠN HÀNG</small>
            </div>
          </div>
        </Link>
        <nav aria-label="Điều hướng chính">
          {navigation
            .filter(({ path }) => !isInternal || !SHOP_ONLY_PATHS.has(path))
            .map(({ path, label, icon: Icon }) => (
              <NavLink key={path} to={path} title={label}>
                <span className="nav-icon">
                  <Icon size={19} />
                </span>
                <span>
                  {isInternal && path === '/requests'
                    ? 'Trung tâm yêu cầu'
                    : isInternal && path === '/statistics'
                      ? 'Báo cáo đơn hàng'
                      : label}
                </span>
              </NavLink>
            ))}

          {isInternal &&
            internalNavigation.map(({ path, label, icon: Icon }) => (
              <NavLink key={path} to={path} title={label}>
                <span className="nav-icon">
                  <Icon size={19} />
                </span>
                <span>{label}</span>
              </NavLink>
            ))}

          {isInternal && (
            <NavLink to="/print-templates" title="Quản lý tem in" className="nav-internal-link">
              <span className="nav-icon">
                <Printer size={19} />
              </span>
              <span>Quản lý tem in</span>
            </NavLink>
          )}
        </nav>
        <div className="sidebar-footer-box">
          <div className="sidebar-version-text">Phiên bản: 1.0.35</div>
        </div>
      </aside>
      <div className="app-main-layout">
        <header>
          <button
            className="icon menu"
            aria-label="Thu gọn menu"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu />
          </button>
          <form
            className="search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              navigate('/orders?q=' + encodeURIComponent(query.trim()));
            }}
          >
            <Search size={18} className="search-icon" />
            <input
              aria-label="Tra cứu đơn hàng"
              placeholder="Nhập Mã Vận Đơn/Mã Đơn Hàng/SĐT/Mã Đơn Riêng để tìm kiếm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
          <div className="header-actions">
            {/* Nút App mobile */}
            <button
              type="button"
              className="icon"
              title="Tải ứng dụng di động"
              aria-label="Mobile App"
              onClick={() =>
                notify('Ứng dụng SuperPlatform Mobile có sẵn trên App Store & Google Play!')
              }
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                <path d="M12 18h.01" />
              </svg>
            </button>

            {/* Nút Yêu cầu / Chat */}
            <button
              type="button"
              className="icon"
              title="Gửi yêu cầu hỗ trợ"
              aria-label="Yêu cầu hỗ trợ"
              onClick={() => navigate('/requests')}
            >
              <BookOpen size={18} />
            </button>

            {/* Nút Thông báo */}
            <button
              type="button"
              className="icon"
              title="Thông báo"
              aria-label="Thông báo"
              onClick={() => setPopup('notifications')}
            >
              <Bell size={18} />
            </button>

            {/* Nút Tra cứu Public Tracking */}
            <Link
              to="/tracking"
              className="icon"
              title="Tra cứu Public (Dành cho Người nhận)"
              aria-label="Public Tracking"
            >
              <Globe size={18} />
            </Link>

            {/* Account Pill với Dropdown chọn quyền Shop / Nội bộ (Duy nhất tại đây) */}
            <div className="account-role-wrapper" ref={roleDropdownRef}>
              <button
                type="button"
                className={`account account-pill ${isInternal ? 'internal-active' : ''}`}
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                title="Nhấn để chuyển đổi vai trò hiển thị: Shop hoặc Nội bộ"
                aria-expanded={showRoleDropdown}
              >
                <span className="account-verified-icon">
                  <ShieldCheck size={16} />
                </span>
                <span className="account-name">
                  {isInternal ? 'Nội bộ - SuperPlatform' : 'S275518 - AB'}
                </span>
                <ChevronDown
                  size={14}
                  className={`account-chevron ${showRoleDropdown ? 'rotate-180' : ''}`}
                />
              </button>

              {showRoleDropdown && (
                <div className="role-dropdown-popover">
                  <div className="role-dropdown-header">
                    <span className="role-dropdown-title">Chế độ xem dữ liệu</span>
                    <span className="role-dropdown-hint">Chọn giao diện phân quyền</span>
                  </div>
                  <div className="role-dropdown-options">
                    <button
                      type="button"
                      className={`role-dropdown-option ${!isInternal ? 'selected' : ''}`}
                      onClick={() => handleSelectRole(false)}
                    >
                      <div className="role-option-icon shop">
                        <Store size={18} />
                      </div>
                      <div className="role-option-info">
                        <span className="role-option-name">Giao diện Shop</span>
                        <span className="role-option-desc">Mã shop: S275518 - AB (Khách hàng)</span>
                      </div>
                      {!isInternal && <Check size={16} className="role-option-check" />}
                    </button>

                    <button
                      type="button"
                      className={`role-dropdown-option ${isInternal ? 'selected' : ''}`}
                      onClick={() => handleSelectRole(true)}
                    >
                      <div className="role-option-icon internal">
                        <ShieldCheck size={18} />
                      </div>
                      <div className="role-option-info">
                        <span className="role-option-name">Giao diện Nội bộ</span>
                        <span className="role-option-desc">
                          Quản trị / CSKH / Điều phối vận hành
                        </span>
                      </div>
                      {isInternal && <Check size={16} className="role-option-check" />}
                    </button>

                    <button
                      type="button"
                      className="role-dropdown-option"
                      onClick={handleSelectPublic}
                    >
                      <div className="role-option-icon public">
                        <Globe size={18} />
                      </div>
                      <div className="role-option-info">
                        <span className="role-option-name">Giao diện công khai</span>
                        <span className="role-option-desc">Người nhận / Khách mua hàng</span>
                      </div>
                    </button>
                  </div>
                  <div className="role-dropdown-divider" />
                  <button
                    type="button"
                    className="role-dropdown-action-btn"
                    onClick={() => {
                      setShowRoleDropdown(false);
                      setPopup('account');
                    }}
                  >
                    Xem chi tiết tài khoản
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main id="main">
          <Suspense
            fallback={
              <div className="empty" role="status">
                Đang tải màn hình…
              </div>
            }
          >
            <Outlet context={{ isInternal, setIsInternal }} />
          </Suspense>
          <footer>
            2026 © <span className="red">SuperPlatform</span>
          </footer>
        </main>
      </div>
      {help && <HelpDialog onClose={() => setHelp(false)} />}{' '}
      {popup && (
        <Modal
          title={popup === 'account' ? 'Tài khoản' : 'Thông báo'}
          onClose={() => setPopup(undefined)}
        >
          {popup === 'account' ? (
            <>
              <b>S983262 - SUPERSHIP TEST</b>
              <p>Raspberry Pi VN</p>
              <p>Tài khoản mẫu để xem giao diện local.</p>
            </>
          ) : (
            <p>Bạn chưa có thông báo mới.</p>
          )}
        </Modal>
      )}
      <button
        type="button"
        className="btn-scroll-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title="Cuộn lên đầu trang"
        aria-label="Cuộn lên đầu trang"
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
}
