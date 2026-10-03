const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'smartpet_token';
const USER_KEY = 'smartpet_current_user';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

export function clearSession() {
  setToken(null);
  setStoredUser(null);
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    return {
      success: false,
      message: 'Cannot connect to server. Make sure the backend is running on port 5000.',
    };
  }

  let data;
  try {
    data = await response.json();
  } catch {
    return { success: false, message: 'Invalid server response.' };
  }

  if (response.status === 401 && !path.includes('/auth/login')) {
    // Token invalid — clear local session
    if (!path.includes('/auth/register')) {
      clearSession();
    }
  }

  return data;
}

/* ---------- Auth ---------- */
export async function registerUser({ fullName, email, phone, password }) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name: fullName, fullName, email, phone, password }),
  });
}

export async function loginUser(email, password) {
  const result = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (result.success && result.data) {
    setToken(result.data.token);
    setStoredUser(result.data.user);
  }

  return result;
}

export async function getCurrentUser() {
  return request('/auth/me');
}

export async function updateUserProfile(updates) {
  return request('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify({
      name: updates.fullName || updates.name,
      fullName: updates.fullName || updates.name,
      email: updates.email,
      phone: updates.phone,
    }),
  });
}

export function logoutUser() {
  clearSession();
}

/* ---------- Pets ---------- */
export async function getPets() {
  return request('/pets');
}

export async function getPetById(id) {
  return request(`/pets/${id}`);
}

export async function addPet(petData) {
  return request('/pets', {
    method: 'POST',
    body: JSON.stringify(petData),
  });
}

export async function updatePet(id, petData) {
  return request(`/pets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(petData),
  });
}

export async function deletePet(id) {
  return request(`/pets/${id}`, { method: 'DELETE' });
}

/* ---------- Vaccinations ---------- */
export async function getVaccinations() {
  return request('/vaccinations');
}

export async function addVaccination(data) {
  return request('/vaccinations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateVaccination(id, data) {
  return request(`/vaccinations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteVaccination(id) {
  return request(`/vaccinations/${id}`, { method: 'DELETE' });
}

/* ---------- Medical Records ---------- */
export async function getMedicalRecords() {
  return request('/medical-records');
}

export async function addMedicalRecord(data) {
  return request('/medical-records', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateMedicalRecord(id, data) {
  return request(`/medical-records/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteMedicalRecord(id) {
  return request(`/medical-records/${id}`, { method: 'DELETE' });
}

/* ---------- Vet Visits ---------- */
export async function getVetVisits() {
  return request('/vet-visits');
}

export async function addVetVisit(data) {
  return request('/vet-visits', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateVetVisit(id, data) {
  return request(`/vet-visits/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteVetVisit(id) {
  return request(`/vet-visits/${id}`, { method: 'DELETE' });
}

/* ---------- Reminders ---------- */
export async function getReminders() {
  return request('/reminders');
}

export async function addReminder(data) {
  return request('/reminders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateReminder(id, data) {
  return request(`/reminders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteReminder(id) {
  return request(`/reminders/${id}`, { method: 'DELETE' });
}

/* ---------- Emergency ---------- */
export async function getEmergencyInfo(petId) {
  return request(`/emergency/${petId}`);
}

export async function saveEmergencyInfo(data, existing = false) {
  if (existing || data.petId) {
    // Prefer upsert via PUT when petId is known
    return request(`/emergency/${data.petId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  return request('/emergency', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/* ---------- Appointments (same backend as vet visits) ---------- */
export async function getAppointments() {
  return request('/appointments');
}

export async function addAppointment(data) {
  return request('/appointments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAppointment(id, data) {
  return request(`/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteAppointment(id) {
  return request(`/appointments/${id}`, { method: 'DELETE' });
}

/* ---------- Dashboard ---------- */
export async function getDashboard() {
  return request('/dashboard');
}

/* ---------- Public content ---------- */
export async function getPublicContent() {
  return request('/content');
}

export async function submitContact(data) {
  return request('/content/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/* ---------- Admin ---------- */
export async function adminGet(path) {
  return request(`/admin${path}`);
}

export async function adminPut(path, data) {
  return request(`/admin${path}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function adminDelete(path) {
  return request(`/admin${path}`, { method: 'DELETE' });
}
