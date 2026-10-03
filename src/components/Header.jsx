import { getCurrentUser } from '../utils/auth';

export default function Header({ title, onMenuClick }) {
  const user = getCurrentUser();
  const initial = user?.fullName?.charAt(0)?.toUpperCase() || 'U';

  return (
    <header className="app-header">
      <div className="header-left">
        <button type="button" className="menu-toggle" onClick={onMenuClick} aria-label="Open menu">
          <span />
          <span />
          <span />
        </button>
        <h1 className="page-title">{title}</h1>
      </div>
      <div className="header-user">
        <span className="header-user-name">{user?.fullName || 'User'}</span>
        <div className="header-avatar" aria-hidden="true">
          {initial}
        </div>
      </div>
    </header>
  );
}
