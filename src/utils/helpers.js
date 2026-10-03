export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

export function isValidPhone(phone) {
  const cleaned = String(phone).replace(/[\s\-()]/g, '');
  return /^[0-9]{10}$/.test(cleaned);
}

export function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return '—';
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return '—';
  const today = new Date();
  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  if (months < 0 || (months === 0 && today.getDate() < dob.getDate())) {
    years -= 1;
    months += 12;
  }
  if (years < 1) {
    return months <= 0 ? 'Newborn' : `${months} mo`;
  }
  return years === 1 ? '1 year' : `${years} years`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Status based on next due date:
 * - Overdue: due date has passed
 * - Due Soon: within next 14 days
 * - Upcoming: more than 14 days away
 */
export function getDueStatus(dueDate) {
  if (!dueDate) return 'Upcoming';
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'Overdue';
  if (diffDays <= 14) return 'Due Soon';
  return 'Upcoming';
}

export function daysUntil(dateStr) {
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
}
