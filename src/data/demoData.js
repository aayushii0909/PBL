import { STORAGE_KEYS, getItem, setItem, generateId } from '../utils/storage';
import {
  saveUsers,
  savePets,
  saveVaccinations,
  saveMedicalRecords,
  saveVetVisits,
  saveReminders,
  saveEmergency,
} from '../utils/auth';

/**
 * Seeds demo data once when the app is first opened and storage is empty.
 * Users can still register their own accounts; demo data belongs to demo user.
 */
export function seedDemoData() {
  if (getItem(STORAGE_KEYS.DEMO_SEEDED, false)) return;

  const demoUserId = 'user_demo_bruno';
  const demoUser = {
    id: demoUserId,
    fullName: 'Demo Owner',
    email: 'demo@smartpet.com',
    phone: '9876543210',
    password: 'demo123',
    createdAt: new Date().toISOString(),
  };

  const existingUsers = getItem(STORAGE_KEYS.USERS, []);
  if (!existingUsers.find((u) => u.email === demoUser.email)) {
    saveUsers([...existingUsers, demoUser]);
  }

  const petId = generateId('pet');
  const pets = [
    {
      id: petId,
      name: 'Bruno',
      species: 'Dog',
      breed: 'Golden Retriever',
      gender: 'Male',
      dateOfBirth: '2021-03-15',
      weight: '28',
      color: 'Golden',
      ownerContact: '9876543210',
      allergies: 'None known',
      notes: 'Friendly and active. Loves morning walks.',
      photo: '',
      createdAt: new Date().toISOString(),
    },
  ];

  const today = new Date();
  const addDays = (n) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };

  const vaccinations = [
    {
      id: generateId('vac'),
      petId,
      petName: 'Bruno',
      vaccineName: 'Rabies',
      dateGiven: addDays(-180),
      nextDueDate: addDays(20),
      veterinarian: 'Dr. Sharma',
      notes: 'Annual booster',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId('vac'),
      petId,
      petName: 'Bruno',
      vaccineName: 'DHPP',
      dateGiven: addDays(-90),
      nextDueDate: addDays(-5),
      veterinarian: 'Dr. Sharma',
      notes: 'Overdue for booster',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId('vac'),
      petId,
      petName: 'Bruno',
      vaccineName: 'Bordetella',
      dateGiven: addDays(-30),
      nextDueDate: addDays(60),
      veterinarian: 'Dr. Mehta',
      notes: 'Kennel cough prevention',
      createdAt: new Date().toISOString(),
    },
  ];

  const medicalRecords = [
    {
      id: generateId('med'),
      petId,
      petName: 'Bruno',
      date: addDays(-45),
      diagnosis: 'Mild ear infection',
      treatment: 'Ear drops for 7 days',
      medicine: 'Otomax',
      veterinarian: 'Dr. Sharma',
      notes: 'Follow-up if symptoms persist',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId('med'),
      petId,
      petName: 'Bruno',
      date: addDays(-120),
      diagnosis: 'Seasonal allergies',
      treatment: 'Antihistamine course',
      medicine: 'Cetirizine (vet dose)',
      veterinarian: 'Dr. Mehta',
      notes: 'Monitor itching during spring',
      createdAt: new Date().toISOString(),
    },
  ];

  const vetVisits = [
    {
      id: generateId('vet'),
      petId,
      petName: 'Bruno',
      veterinarianName: 'Dr. Sharma',
      clinicName: 'Paws & Care Clinic',
      visitDate: addDays(-45),
      reason: 'Ear check-up',
      treatment: 'Prescribed ear drops',
      notes: 'Next visit in 6 months for general check-up',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId('vet'),
      petId,
      petName: 'Bruno',
      veterinarianName: 'Dr. Mehta',
      clinicName: 'City Vet Hospital',
      visitDate: addDays(-120),
      reason: 'Allergy consultation',
      treatment: 'Antihistamine prescribed',
      notes: 'Avoid grassy areas during pollen season',
      createdAt: new Date().toISOString(),
    },
  ];

  const reminders = [
    {
      id: generateId('rem'),
      title: 'Grooming appointment',
      petId,
      petName: 'Bruno',
      date: addDays(10),
      description: 'Monthly grooming at PetSpa',
      type: 'custom',
      createdAt: new Date().toISOString(),
    },
  ];

  const emergency = {
    pet: {
      petName: 'Bruno',
      species: 'Dog',
      breed: 'Golden Retriever',
      bloodGroup: 'DEA 1.1 Positive',
      allergies: 'None known',
      currentMedication: 'None',
      importantNotes: 'Microchip ID: BRU-2021-0315. Friendly with strangers.',
    },
    veterinarian: {
      name: 'Dr. Sharma',
      clinicName: 'Paws & Care Clinic',
      phone: '9876501234',
      address: '12 Green Park Road, City Center',
    },
    contact: {
      name: 'Demo Owner',
      relationship: 'Owner',
      phone: '9876543210',
    },
  };

  savePets(demoUserId, pets);
  saveVaccinations(demoUserId, vaccinations);
  saveMedicalRecords(demoUserId, medicalRecords);
  saveVetVisits(demoUserId, vetVisits);
  saveReminders(demoUserId, reminders);
  saveEmergency(demoUserId, emergency);
  setItem(STORAGE_KEYS.DEMO_SEEDED, true);
}
