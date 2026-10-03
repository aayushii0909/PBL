export function isRequired(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

export function isValidPhone(phone) {
  const cleaned = String(phone).replace(/[\s\-()]/g, '');
  return /^\+?\d{7,15}$/.test(cleaned);
}

export function passwordsMatch(password, confirm) {
  return password === confirm;
}

export function isValidDate(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return !Number.isNaN(d.getTime());
}

export function validateRequiredFields(fields) {
  for (const [label, value] of Object.entries(fields)) {
    if (!isRequired(value)) {
      return `Please fill all required fields. (${label} is required)`;
    }
  }
  return null;
}
