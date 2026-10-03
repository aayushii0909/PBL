import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import Button from './Button';

export default function PublicNavbar() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const go = (hash) => {
    setOpen(false);
    if (location.pathname !== '/') {
      navigate(`/${hash}`);
      return;
    }
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const homeLink = (hash, label) => (
    <a
      href={`/${hash}`}
      onClick={(e) => {
        e.preventDefault();
        go(hash);
      }}
    >
      {label}
    </a>
  );

  return (
    <header className="public-nav">
      <div className="container public-nav-inner">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <Logo size={38} />
        </NavLink>
        <button
          type="button"
          className="public-nav-toggle menu-toggle"
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className="public-links">
          {homeLink('#features', 'Features')}
          {homeLink('#benefits', 'Benefits')}
          {homeLink('#how-it-works', 'How it works')}
          {homeLink('#tips', 'Care tips')}
          {homeLink('#faq', 'FAQ')}
          {homeLink('#contact', 'Contact')}
          {isAuthenticated ? (
            <Button onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/dashboard')}>
              {user?.role === 'admin' ? 'Admin' : 'Dashboard'}
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/register')}>Get Started</Button>
            </>
          )}
        </nav>
      </div>
      <div className={`public-mobile-menu ${open ? 'show' : ''}`}>
        {homeLink('#features', 'Features')}
        {homeLink('#benefits', 'Benefits')}
        {homeLink('#how-it-works', 'How it works')}
        {homeLink('#contact', 'Contact')}
      </div>
    </header>
  );
}
