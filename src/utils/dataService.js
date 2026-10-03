import { getItem, setItem, generateId, KEYS } from './storage';
import { getCurrentUser } from './auth';
import { getDueStatus } from './dates';

function userId() {
  const user = getCurrentUser();
  return user ? user.id : null;
}

function filterByUser(list) {
  const uid = userId();
  if (!uid) return [];
  return (list || []).filter((item) => item.userId === uid);
}

/* ── Pets ── */
export function getPets() {
  return filterByUser(getItem(KEYS.PETS, []));
}

export function getPetById(id) {
  return getPets().find((p) => p.id === id) || null;
}

export function savePet(petData) {
  const all = getItem(KEYS.PETS, []);
  const uid = userId();
  if (petData.id) {
    const idx = all.findIndex((p) => p.id === petData.id && p.userId === uid);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...petData, userId: uid };
      setItem(KEYS.PETS, all);
      return all[idx];
    }
  }
  const newPet = {
    ...petData,
    id: generateId('pet'),
    userId: uid,
    createdAt: new Date().toISOString(),
  };
  all.push(newPet);
  setItem(KEYS.PETS, all);
  return newPet;
}

export function deletePet(id) {
  const uid = userId();
  setItem(
    KEYS.PETS,
    getItem(KEYS.PETS, []).filter((p) => !(p.id === id && p.userId === uid))
  );
  setItem(
    KEYS.VACCINATIONS,
    getItem(KEYS.VACCINATIONS, []).filter((v) => !(v.petId === id && v.userId === uid))
  );
  setItem(
    KEYS.MEDICAL,
    getItem(KEYS.MEDICAL, []).filter((m) => !(m.petId === id && m.userId === uid))
  );
  setItem(
    KEYS.VET_VISITS,
    getItem(KEYS.VET_VISITS, []).filter((v) => !(v.petId === id && v.userId === uid))
  );
  setItem(
    KEYS.REMINDERS,
    getItem(KEYS.REMINDERS, []).filter((r) => !(r.petId === id && r.userId === uid))
  );
}

/* ── Vaccinations ── */
export function getVaccinations() {
  return filterByUser(getItem(KEYS.VACCINATIONS, []));
}

export function saveVaccination(data) {
  const all = getItem(KEYS.VACCINATIONS, []);
  const uid = userId();
  if (data.id) {
    const idx = all.findIndex((v) => v.id === data.id && v.userId === uid);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...data, userId: uid };
      setItem(KEYS.VACCINATIONS, all);
      return all[idx];
    }
  }
  const record = { ...data, id: generateId('vac'), userId: uid };
  all.push(record);
  setItem(KEYS.VACCINATIONS, all);
  return record;
}

export function deleteVaccination(id) {
  const uid = userId();
  setItem(
    KEYS.VACCINATIONS,
    getItem(KEYS.VACCINATIONS, []).filter((v) => !(v.id === id && v.userId === uid))
  );
}

/* ── Medical Records ── */
export function getMedicalRecords() {
  return filterByUser(getItem(KEYS.MEDICAL, []));
}

export function saveMedicalRecord(data) {
  const all = getItem(KEYS.MEDICAL, []);
  const uid = userId();
  if (data.id) {
    const idx = all.findIndex((m) => m.id === data.id && m.userId === uid);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...data, userId: uid };
      setItem(KEYS.MEDICAL, all);
      return all[idx];
    }
  }
  const record = { ...data, id: generateId('med'), userId: uid };
  all.push(record);
  setItem(KEYS.MEDICAL, all);
  return record;
}

export function deleteMedicalRecord(id) {
  const uid = userId();
  setItem(
    KEYS.MEDICAL,
    getItem(KEYS.MEDICAL, []).filter((m) => !(m.id === id && m.userId === uid))
  );
}

/* ── Vet Visits ── */
export function getVetVisits() {
  return filterByUser(getItem(KEYS.VET_VISITS, []));
}

export function saveVetVisit(data) {
  const all = getItem(KEYS.VET_VISITS, []);
  const uid = userId();
  if (data.id) {
    const idx = all.findIndex((v) => v.id === data.id && v.userId === uid);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...data, userId: uid };
      setItem(KEYS.VET_VISITS, all);
      return all[idx];
    }
  }
  const record = { ...data, id: generateId('visit'), userId: uid };
  all.push(record);
  setItem(KEYS.VET_VISITS, all);
  return record;
}

export function deleteVetVisit(id) {
  const uid = userId();
  setItem(
    KEYS.VET_VISITS,
    getItem(KEYS.VET_VISITS, []).filter((v) => !(v.id === id && v.userId === uid))
  );
}

/* ── Reminders ── */
export function getCustomReminders() {
  return filterByUser(getItem(KEYS.REMINDERS, []));
}

export function saveReminder(data) {
  const all = getItem(KEYS.REMINDERS, []);
  const uid = userId();
  const record = {
    ...data,
    id: generateId('rem'),
    userId: uid,
    custom: true,
  };
  all.push(record);
  setItem(KEYS.REMINDERS, all);
  return record;
}

export function deleteReminder(id) {
  const uid = userId();
  setItem(
    KEYS.REMINDERS,
    getItem(KEYS.REMINDERS, []).filter((r) => !(r.id === id && r.userId === uid))
  );
}

/** Combined reminders: vaccination due dates + custom */
export function getAllReminders() {
  const pets = getPets();
  const petName = (id) => pets.find((p) => p.id === id)?.name || 'Unknown';

  const fromVaccines = getVaccinations()
    .filter((v) => v.nextDueDate)
    .map((v) => ({
      id: `vac_rem_${v.id}`,
      petId: v.petId,
      petName: petName(v.petId),
      title: `${v.vaccineName} vaccination`,
      date: v.nextDueDate,
      description: `Next due for ${petName(v.petId)}`,
      status: getDueStatus(v.nextDueDate),
      source: 'vaccination',
    }));

  const custom = getCustomReminders().map((r) => ({
    ...r,
    petName: petName(r.petId),
    status: getDueStatus(r.date),
    source: 'custom',
  }));

  return [...fromVaccines, ...custom].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
}

/* ── Emergency ── */
export function getEmergencyInfo() {
  const uid = userId();
  const all = getItem(KEYS.EMERGENCY, {});
  return all[uid] || null;
}

export function saveEmergencyInfo(data) {
  const uid = userId();
  const all = getItem(KEYS.EMERGENCY, {});
  all[uid] = data;
  setItem(KEYS.EMERGENCY, all);
  return data;
}

/* ── Dashboard stats ── */
export function getDashboardStats() {
  const pets = getPets();
  const vaccinations = getVaccinations();
  const medical = getMedicalRecords();
  const visits = getVetVisits();
  const reminders = getAllReminders();

  return {
    totalPets: pets.length,
    vaccinations: vaccinations.length,
    medicalRecords: medical.length,
    vetVisits: visits.length,
    upcomingReminders: reminders.filter(
      (r) => r.status === 'upcoming' || r.status === 'due-soon'
    ).length,
    pets,
    upcomingVaccinations: vaccinations
      .filter((v) => v.nextDueDate)
      .map((v) => ({
        ...v,
        petName: pets.find((p) => p.id === v.petId)?.name || 'Unknown',
        status: getDueStatus(v.nextDueDate),
      }))
      .sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate))
      .slice(0, 5),
    recentActivity: [
      ...visits.slice(-3).map((v) => ({
        type: 'visit',
        text: `Vet visit — ${pets.find((p) => p.id === v.petId)?.name || 'Pet'}`,
        date: v.visitDate,
      })),
      ...medical.slice(-3).map((m) => ({
        type: 'medical',
        text: `Medical record — ${m.diagnosis}`,
        date: m.date,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5),
  };
}
