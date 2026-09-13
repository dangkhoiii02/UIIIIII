import { Suspense, useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, BookOpen, Bell, ShieldCheck, Globe, Printer } from 'lucide-react';
import { navigation } from '../config/navigation';
import { HelpDialog } from '@/shared/ui/HelpDialog';
import { Modal } from '@/shared/ui/Modal';
import { useToast } from '@/shared/ui/toast-context';

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [help, setHelp] = useState(false);
  const [isInternal, setIsInternal] = useState(false);
  const [popup, setPopup] = useState<'account' | 'notifications'>();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const notify = useToast();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const toggleInternalMode = () => {
    const nextMode = !isInternal;
    setIsInternal(nextMode);
    notify(
      nextMode
        ? 'Đã chuyển sang Giao diện Nội bộ (CSKH / Vận hành / Admin).'
        : 'Đã chuyển về Giao diện Shop (Khách hàng).',
    );
  };

  return (
    <div className={collapsed ? 'app-shell collapsed' : 'app-shell'}>
      <aside id="sidebar">
        <Link className="brand" to="/create">
          <span className="mark">S</span>
          <strong>SuperPlatform</strong>
        </Link>
        <nav aria-label="Điều hướng chính">
          {navigation.map(({ path, label, icon: Icon }) => (
            <NavLink key={path} to={path} title={label}>
              <span className="nav-icon">
                <Icon size={21} />
              </span>
              <span>{label}</span>
            </NavLink>
          ))}

          {isInternal && (
            <NavLink to="/print-templates" title="Quản lý tem in" className="nav-internal-link">
              <span className="nav-icon">
                <Printer size={21} />
              </span>
              <span>Quản lý tem in</span>
            </NavLink>
          )}
        </nav>
        <div className="version">
          Phiên bản UI 1.0<small>SuperPlatform © 2026</small>
        </div>
      </aside>
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
          <Search size={20} />
          <input
            aria-label="Tra cứu đơn hàng"
            placeholder="Tra cứu đơn hàng..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
        <div className="header-actions">
          {/* Nút 1: Switch sang UI nội bộ (CSKH / Admin) */}
          <button
            type="button"
            className={`icon ${isInternal ? 'active-internal' : ''}`}
            title={isInternal ? 'Đang ở UI Nội bộ (Click để về UI Shop)' : 'Chuyển sang UI Nội bộ (CSKH / Admin)'}
            aria-label="UI Nội bộ"
            onClick={toggleInternalMode}
          >
            <ShieldCheck size={20} />
          </button>

          {/* Nút 2: Chuyển đến trang Public Tracking cho người nhận */}
          <Link
            to="/tracking"
            className="icon"
            title="Tra cứu Public (Dành cho Người nhận)"
            aria-label="Public Tracking"
          >
            <Globe size={20} />
          </Link>

          <button
            className="icon"
            title="Hướng dẫn"
            aria-label="Hướng dẫn"
            onClick={() => setHelp(true)}
          >
            <BookOpen size={20} />
          </button>
          <button
            className="icon"
            title="Thông báo"
            aria-label="Thông báo"
            onClick={() => setPopup('notifications')}
          >
            <Bell size={20} />
          </button>
          <button className="account" onClick={() => setPopup('account')}>
            <span className="avatar">{isInternal ? 'CSKH' : 'SP'}</span>
            {isInternal ? 'CSKH01 - QTV NỘI BỘ' : 'S983262 - SUPERSHIP TEST'} <span>⌄</span>
          </button>
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
    </div>
  );
}
