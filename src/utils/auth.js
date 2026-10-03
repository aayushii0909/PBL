import { STORAGE_KEYS, getItem, setItem, generateId } from './storage';

export function getUsers() {
  return getItem(STORAGE_KEYS.USERS, []);
}

export function saveUsers(users) {
  setItem(STORAGE_KEYS.USERS, users);
}

export function getCurrentUser() {
  return getItem(STORAGE_KEYS.CURRENT_USER, null);
}

export function setCurrentUser(user) {
  if (user) setItem(STORAGE_KEYS.CURRENT_USER, user);
  else localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

export function registerUser({ fullName, email, phone, password }) {
  const users = getUsers();
  const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return { success: false, message: 'An account with this email already exists.' };
  }
  const user = {
    id: generateId('user'),
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    password,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  return { success: true, message: 'Registration successful! Please login.', user };
}

export function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
  );
  if (!user) {
    return { success: false, message: 'Invalid email or password.' };
  }
  const session = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
  };
  setCurrentUser(session);
  return { success: true, message: 'Login successful.', user: session };
}

export function logoutUser() {
  setCurrentUser(null);
}

export function updateUserProfile(updates) {
  const current = getCurrentUser();
  if (!current) return { success: false, message: 'Not logged in.' };
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === current.id);
  if (idx === -1) return { success: false, message: 'User not found.' };
  users[idx] = { ...users[idx], ...updates };
  saveUsers(users);
  const session = {
    id: users[idx].id,
    fullName: users[idx].fullName,
    email: users[idx].email,
    phone: users[idx].phone,
  };
  setCurrentUser(session);
  return { success: true, message: 'Profile updated successfully.', user: session };
}

function scopedKey(baseKey, userId) {
  return `${baseKey}_${userId}`;
}

export function getPets(userId) {
  return getItem(scopedKey(STORAGE_KEYS.PETS, userId), []);
}

export function savePets(userId, pets) {
  setItem(scopedKey(STORAGE_KEYS.PETS, userId), pets);
}

export function getVaccinations(userId) {
  return getItem(scopedKey(STORAGE_KEYS.VACCINATIONS, userId), []);
}

export function saveVaccinations(userId, records) {
  setItem(scopedKey(STORAGE_KEYS.VACCINATIONS, userId), records);
}

export function getMedicalRecords(userId) {
  return getItem(scopedKey(STORAGE_KEYS.MEDICAL_RECORDS, userId), []);
}

export function saveMedicalRecords(userId, records) {
  setItem(scopedKey(STORAGE_KEYS.MEDICAL_RECORDS, userId), records);
}

export function getVetVisits(userId) {
  return getItem(scopedKey(STORAGE_KEYS.VET_VISITS, userId), []);
}

export function saveVetVisits(userId, records) {
  setItem(scopedKey(STORAGE_KEYS.VET_VISITS, userId), records);
}

export function getReminders(userId) {
  return getItem(scopedKey(STORAGE_KEYS.REMINDERS, userId), []);
}

export function saveReminders(userId, records) {
  setItem(scopedKey(STORAGE_KEYS.REMINDERS, userId), records);
}

export function getEmergency(userId) {
  return getItem(scopedKey(STORAGE_KEYS.EMERGENCY, userId), null);
}

export function saveEmergency(userId, data) {
  setItem(scopedKey(STORAGE_KEYS.EMERGENCY, userId), data);
}
