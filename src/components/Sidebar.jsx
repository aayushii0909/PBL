import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';

const LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: 'grid' },
  { to: '/pets', label: 'My Pets', icon: 'paw' },
  { to: '/vaccinations', label: 'Vaccinations', icon: 'syringe' },
  { to: '/medical-history', label: 'Medical History', icon: 'file' },
  { to: '/vet-visits', label: 'Vet Visits', icon: 'clinic' },
  { to: '/reminders', label: 'Reminders', icon: 'bell' },
  { to: '/emergency', label: 'Emergency Info', icon: 'alert' },
  { to: '/profile', label: 'Profile', icon: 'user' },
];

function NavIcon({ type }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

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
          <circle cx="8" cy="8" r="2" />
          <circle cx="16" cy="8" r="2" />
          <circle cx="6" cy="14" r="2" />
          <circle cx="18" cy="14" r="2" />
          <ellipse cx="12" cy="17" rx="3.5" ry="2.5" />
        </svg>
      );
    case 'syringe':
      return (
        <svg {...common}>
          <path d="M18 2l4 4M16 4l4 4M12 8l-8 8v4h4l8-8M9 15l3 3" />
        </svg>
      );
    case 'file':
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <path d="M14 2v6h6M8 13h8M8 17h6" />
        </svg>
      );
    case 'clinic':
      return (
        <svg {...common}>
          <path d="M3 21h18M5 21V7l7-4 7 4v14M10 12h4M12 10v4" />
        </svg>
      );
    case 'bell':
      return (
        <svg {...common}>
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
        </svg>
      );
    case 'alert':
      return (
        <svg {...common}>
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
      );
    case 'user':
      return (
        <svg {...common}>
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <>
      <div
        className={`sidebar-backdrop ${open ? 'show' : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-mark">SP</div>
          <div>
            <strong>SmartPet</strong>
            <span>Health Manager</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <NavIcon type={link.icon} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <button type="button" className="sidebar-logout" onClick={handleLogout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Logout
        </button>
      </aside>
    </>
  );
}
