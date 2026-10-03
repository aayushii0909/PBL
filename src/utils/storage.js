export const STORAGE_KEYS = {
  USERS: 'smartpet_users',
  CURRENT_USER: 'smartpet_current_user',
  PETS: 'smartpet_pets',
  VACCINATIONS: 'smartpet_vaccinations',
  MEDICAL_RECORDS: 'smartpet_medical_records',
  VET_VISITS: 'smartpet_vet_visits',
  REMINDERS: 'smartpet_reminders',
  EMERGENCY: 'smartpet_emergency',
  DEMO_SEEDED: 'smartpet_demo_seeded',
};

export function getItem(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key) {
  localStorage.removeItem(key);
}

export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
