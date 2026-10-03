import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: 'grid' },
  { to: '/pets', label: 'My Pets', icon: 'paw' },
  { to: '/vaccinations', label: 'Vaccinations', icon: 'syringe' },
  { to: '/medical-history', label: 'Medical History', icon: 'clipboard' },
  { to: '/vet-visits', label: 'Vet Visits', icon: 'stethoscope' },
  { to: '/reminders', label: 'Reminders', icon: 'bell' },
  { to: '/emergency', label: 'Emergency Info', icon: 'alert' },
  { to: '/profile', label: 'Profile', icon: 'user' },
];

function NavIcon({ type }) {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 };
  switch (type) {
    case 'grid':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case 'paw':
      return (
        <svg {...common}>
          <circle cx="8" cy="9" r="2" />
          <circle cx="16" cy="9" r="2" />
          <circle cx="5" cy="14" r="1.8" />
          <circle cx="19" cy="14" r="1.8" />
          <ellipse cx="12" cy="17" rx="4" ry="3" />
        </svg>
      );
    case 'syringe':
      return (
        <svg {...common}>
          <path d="M14 4l6 6M11 7l6 6M4 20l7-7M9 15l-2 5 5-2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'clipboard':
      return (
        <svg {...common}>
          <path d="M9 5h6M8 3h8a1 1 0 011 1v2H7V4a1 1 0 011-1zM7 7h10v13a1 1 0 01-1 1H8a1 1 0 01-1-1V7z" strokeLinejoin="round" />
        </svg>
      );
    case 'stethoscope':
      return (
        <svg {...common}>
          <path d="M6 4v6a6 6 0 0012 0V4M18 14a3 3 0 11-3 3" strokeLinecap="round" />
        </svg>
      );
    case 'bell':
      return (
        <svg {...common}>
          <path d="M6 9a6 6 0 0112 0c0 7 3 7 3 7H3s3 0 3-7M10 20a2 2 0 004 0" strokeLinecap="round" />
        </svg>
      );
    case 'alert':
      return (
        <svg {...common}>
          <path d="M12 9v4M12 17h.01M10.3 4.3L2.8 18a2 2 0 001.7 3h15a2 2 0 001.7-3L13.7 4.3a2 2 0 00-3.4 0z" strokeLinejoin="round" />
        </svg>
      );
    case 'user':
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/pets': 'My Pets',
  '/pets/add': 'Add Pet',
  '/vaccinations': 'Vaccinations',
  '/medical-history': 'Medical History',
  '/vet-visits': 'Vet Visits',
  '/reminders': 'Reminders',
  '/emergency': 'Emergency Information',
  '/profile': 'Profile & Settings',
};

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const title =
    PAGE_TITLES[location.pathname] ||
    (location.pathname.startsWith('/pets/edit') ? 'Edit Pet' : 'SmartPet');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={`app-shell ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-text">SmartPet</span>
          <button type="button" className="sidebar-close" onClick={closeSidebar} aria-label="Close menu">
            ×
          </button>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
              end={item.to === '/dashboard'}
            >
              <NavIcon type={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <button type="button" className="sidebar-logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {sidebarOpen && <div className="sidebar-backdrop" onClick={closeSidebar} role="presentation" />}

      <div className="main-area">
        <header className="top-header">
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <span />
            <span />
            <span />
          </button>
          <h1 className="page-title">{title}</h1>
          <div className="header-user">
            <span className="header-user-name">{user?.fullName || 'User'}</span>
            <div className="header-avatar" aria-hidden="true">
              {(user?.fullName || 'U').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
