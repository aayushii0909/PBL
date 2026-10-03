export default function EmptyState({ title = 'Nothing here yet', message, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" opacity="0.3" />
          <path
            d="M16 28c2-4 6-6 8-6s6 2 8 6M18 20h.01M30 20h.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action && <div className="empty-action">{action}</div>}
    </div>
  );
}
