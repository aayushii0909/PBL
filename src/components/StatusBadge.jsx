export default function StatusBadge({ status }) {
  const key = String(status || 'Upcoming').toLowerCase().replace(/\s+/g, '-');
  return <span className={`status-badge status-${key}`}>{status}</span>;
}
