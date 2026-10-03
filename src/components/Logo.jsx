export default function Logo({ size = 36, withText = true, inverted = false, text = 'SmartPet Health' }) {
  const color = inverted ? '#ffffff' : '#0f3d3e';
  const sub = inverted ? 'rgba(255,255,255,0.75)' : '#5b7a80';

  return (
    <span className={`brand-logo ${inverted ? 'brand-logo-inverted' : ''}`}>
      <svg
        className="brand-logo-mark"
        width={size}
        height={size}
        viewBox="0 0 64 64"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="60" height="60" rx="18" fill="#1a6b6a" />
        <rect x="2" y="2" width="60" height="60" rx="18" fill="url(#sphGrad)" />
        <defs>
          <linearGradient id="sphGrad" x1="8" y1="6" x2="58" y2="58">
            <stop offset="0%" stopColor="#2b9b96" />
            <stop offset="100%" stopColor="#123c4a" />
          </linearGradient>
        </defs>
        <circle cx="22" cy="22" r="4.2" fill="#fff" />
        <circle cx="34" cy="18" r="3.4" fill="#fff" />
        <circle cx="16" cy="31" r="3.2" fill="#fff" />
        <ellipse cx="28" cy="34" rx="8.5" ry="6.2" fill="#fff" />
        <rect x="40" y="28" width="5" height="16" rx="1.5" fill="#ff8a7a" />
        <rect x="34.5" y="33.5" width="16" height="5" rx="1.5" fill="#ff8a7a" />
      </svg>
      {withText && (
        <span className="brand-logo-text">
          <strong style={{ color }}>{text}</strong>
          <small style={{ color: sub }}>Pet healthcare records</small>
        </span>
      )}
    </span>
  );
}
