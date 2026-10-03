import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import Button from '../components/Button';

const FEATURES = [
  {
    title: 'Pet Profiles',
    desc: 'Store species, breed, age, weight and notes for each pet in one place.',
    icon: 'paw',
  },
  {
    title: 'Vaccination Tracking',
    desc: 'Track vaccines given and upcoming due dates with clear status labels.',
    icon: 'syringe',
  },
  {
    title: 'Medical History',
    desc: 'Keep diagnosis, treatment and medicine records organized digitally.',
    icon: 'clipboard',
  },
  {
    title: 'Vet Records',
    desc: 'Log clinic visits, veterinarians and reasons for each appointment.',
    icon: 'stethoscope',
  },
  {
    title: 'Health Reminders',
    desc: 'Never miss important health dates with upcoming and overdue alerts.',
    icon: 'bell',
  },
  {
    title: 'Emergency Information',
    desc: 'Quick access to allergies, medications and emergency contacts.',
    icon: 'alert',
  },
];

function FeatureIcon({ type }) {
  const props = {
    width: 28,
    height: 28,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
  };
  if (type === 'paw') {
    return (
      <svg {...props}>
        <circle cx="8" cy="9" r="2" />
        <circle cx="16" cy="9" r="2" />
        <circle cx="5" cy="14" r="1.8" />
        <circle cx="19" cy="14" r="1.8" />
        <ellipse cx="12" cy="17" rx="4" ry="3" />
      </svg>
    );
  }
  if (type === 'syringe') {
    return (
      <svg {...props}>
        <path d="M14 4l6 6M11 7l6 6M4 20l7-7M9 15l-2 5 5-2" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === 'clipboard') {
    return (
      <svg {...props}>
        <path d="M9 5h6M8 3h8v3H7V4a1 1 0 011-1zM7 7h10v13H7V7z" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === 'stethoscope') {
    return (
      <svg {...props}>
        <path d="M6 4v6a6 6 0 0012 0V4M18 14a3 3 0 11-3 3" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === 'bell') {
    return (
      <svg {...props}>
        <path d="M6 9a6 6 0 0112 0c0 7 3 7 3 7H3s3 0 3-7M10 20a2 2 0 004 0" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path
        d="M12 9v4M12 17h.01M10.3 4.3L2.8 18a2 2 0 001.7 3h15a2 2 0 001.7-3L13.7 4.3a2 2 0 00-3.4 0z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <PublicNavbar />

      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="hero-eyebrow">Pet Health Management</p>
            <h1>Smart Care for Your Beloved Pets</h1>
            <p className="hero-desc">
              Manage your pet&apos;s health records, vaccinations, medical history and emergency
              information in one simple place.
            </p>
            <div className="hero-actions">
              <Button onClick={() => navigate('/register')}>Get Started</Button>
              <Button variant="secondary" onClick={() => navigate('/login')}>
                Login
              </Button>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-blob">
              <div className="hero-pet-card">
                <div className="hero-pet-avatar">B</div>
                <div>
                  <strong>Bruno</strong>
                  <span>Golden Retriever · Healthy</span>
                </div>
              </div>
              <div className="hero-stat-row">
                <div className="hero-mini-card">
                  <span>Vaccines</span>
                  <strong>On Track</strong>
                </div>
                <div className="hero-mini-card">
                  <span>Next Visit</span>
                  <strong>Due Soon</strong>
                </div>
              </div>
              <div className="hero-rings">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="container">
          <div className="section-heading">
            <h2>Everything you need for pet health</h2>
            <p>Simple tools to organize care records without complicated setups.</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <article key={f.title} className="feature-card">
                <div className="feature-icon">
                  <FeatureIcon type={f.icon} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="container about-grid">
          <div>
            <h2>About SmartPet</h2>
            <p>
              SmartPet helps pet owners organize important health information digitally. From
              vaccination schedules to emergency contacts, keep critical details ready when you need
              them — whether at home or at the clinic.
            </p>
            <p>
              Built as a college project, the system stores data securely in your browser using
              localStorage. No backend or external services are required.
            </p>
          </div>
          <div className="about-highlights">
            <div>
              <strong>Simple</strong>
              <span>Easy forms and clear dashboards</span>
            </div>
            <div>
              <strong>Organized</strong>
              <span>Pets, vaccines, visits & reminders</span>
            </div>
            <div>
              <strong>Ready</strong>
              <span>Emergency info in one view</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <div className="brand footer-brand">
              <span className="brand-mark" aria-hidden="true" />
              <span className="brand-text">SmartPet</span>
            </div>
            <p>Smart Pet Health & Emergency Management System for organized pet care.</p>
          </div>
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <button type="button" onClick={() => navigate('/login')}>
              Login
            </button>
            <button type="button" onClick={() => navigate('/register')}>
              Register
            </button>
          </div>
        </div>
        <div className="container footer-copy">
          <p>© {new Date().getFullYear()} SmartPet. College project — not a medical service.</p>
        </div>
      </footer>
    </div>
  );
}
