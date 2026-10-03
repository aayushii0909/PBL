export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function daysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

/**
 * Upcoming: more than 7 days away
 * Due Soon: within 7 days (including today)
 * Overdue: past due date
 */
export function getDueStatus(dueDate) {
  if (!dueDate) return 'upcoming';
  const days = daysUntil(dueDate);
  if (days < 0) return 'overdue';
  if (days <= 7) return 'due-soon';
  return 'upcoming';
}

export function getStatusLabel(status) {
  if (status === 'overdue') return 'Overdue';
  if (status === 'due-soon') return 'Due Soon';
  return 'Upcoming';
}

export function calculateAge(dob) {
  if (!dob) return '—';
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return '—';
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
    years -= 1;
    months += 12;
  }
  if (today.getDate() < birth.getDate()) months -= 1;
  if (years < 1) return `${Math.max(months, 0)} mo`;
  if (months === 0) return `${years} yr`;
  return `${years} yr ${months} mo`;
}
