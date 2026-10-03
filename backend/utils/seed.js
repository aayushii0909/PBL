/**
 * Optional demo data seed script.
 * Run: npm run seed
 *
 * Creates demo user (if missing) and sample records for Bruno.
 * Does NOT run automatically for every user.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Pet = require('../models/Pet');
const Vaccination = require('../models/Vaccination');
const MedicalHistory = require('../models/MedicalHistory');
const VetVisit = require('../models/VetVisit');
const Reminder = require('../models/Reminder');
const Emergency = require('../models/Emergency');

const addDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
};

const seed = async () => {
  try {
    await connectDB();

    let user = await User.findOne({ email: 'demo@smartpet.com' });
    if (!user) {
      user = await User.create({
        name: 'Demo Owner',
        email: 'demo@smartpet.com',
        phone: '9876543210',
        password: 'demo123',
      });
      console.log('Demo user created: demo@smartpet.com / demo123');
    } else {
      console.log('Demo user already exists.');
    }

    let pet = await Pet.findOne({ userId: user._id, name: 'Bruno' });
    if (!pet) {
      pet = await Pet.create({
        userId: user._id,
        name: 'Bruno',
        species: 'Dog',
        breed: 'Golden Retriever',
        gender: 'Male',
        dateOfBirth: new Date('2021-03-15'),
        weight: '28',
        color: 'Golden',
        ownerContact: '9876543210',
        allergies: 'None known',
        notes: 'Friendly and active. Loves morning walks.',
      });
      console.log('Demo pet Bruno created.');
    } else {
      console.log('Demo pet Bruno already exists.');
    }

    const vacCount = await Vaccination.countDocuments({ userId: user._id, petId: pet._id });
    if (vacCount === 0) {
      await Vaccination.insertMany([
        {
          userId: user._id,
          petId: pet._id,
          vaccineName: 'Rabies',
          dateGiven: addDays(-180),
          nextDueDate: addDays(20),
          veterinarian: 'Dr. Sharma',
          notes: 'Annual booster',
        },
        {
          userId: user._id,
          petId: pet._id,
          vaccineName: 'DHPP',
          dateGiven: addDays(-90),
          nextDueDate: addDays(-5),
          veterinarian: 'Dr. Sharma',
          notes: 'Overdue for booster',
        },
        {
          userId: user._id,
          petId: pet._id,
          vaccineName: 'Bordetella',
          dateGiven: addDays(-30),
          nextDueDate: addDays(60),
          veterinarian: 'Dr. Mehta',
          notes: 'Kennel cough prevention',
        },
      ]);
      console.log('Demo vaccinations created.');
    }

    const medCount = await MedicalHistory.countDocuments({ userId: user._id, petId: pet._id });
    if (medCount === 0) {
      await MedicalHistory.insertMany([
        {
          userId: user._id,
          petId: pet._id,
          date: addDays(-45),
          diagnosis: 'Mild ear infection',
          treatment: 'Ear drops for 7 days',
          medicine: 'Otomax',
          veterinarian: 'Dr. Sharma',
          notes: 'Follow-up if symptoms persist',
        },
        {
          userId: user._id,
          petId: pet._id,
          date: addDays(-120),
          diagnosis: 'Seasonal allergies',
          treatment: 'Antihistamine course',
          medicine: 'Cetirizine (vet dose)',
          veterinarian: 'Dr. Mehta',
          notes: 'Monitor itching during spring',
        },
      ]);
      console.log('Demo medical records created.');
    }

    const visitCount = await VetVisit.countDocuments({ userId: user._id, petId: pet._id });
    if (visitCount === 0) {
      await VetVisit.insertMany([
        {
          userId: user._id,
          petId: pet._id,
          veterinarianName: 'Dr. Sharma',
          clinicName: 'Paws & Care Clinic',
          visitDate: addDays(-45),
          reason: 'Ear check-up',
          treatment: 'Prescribed ear drops',
          notes: 'Next visit in 6 months for general check-up',
        },
        {
          userId: user._id,
          petId: pet._id,
          veterinarianName: 'Dr. Mehta',
          clinicName: 'City Vet Hospital',
          visitDate: addDays(-120),
          reason: 'Allergy consultation',
          treatment: 'Antihistamine prescribed',
          notes: 'Avoid grassy areas during pollen season',
        },
      ]);
      console.log('Demo vet visits created.');
    }

    const remCount = await Reminder.countDocuments({ userId: user._id, petId: pet._id });
    if (remCount === 0) {
      await Reminder.create({
        userId: user._id,
        petId: pet._id,
        title: 'Grooming appointment',
        date: addDays(10),
        description: 'Monthly grooming at PetSpa',
        type: 'custom',
      });
      console.log('Demo reminder created.');
    }

    const emergency = await Emergency.findOne({ userId: user._id, petId: pet._id });
    if (!emergency) {
      await Emergency.create({
        userId: user._id,
        petId: pet._id,
        bloodGroup: 'DEA 1.1 Positive',
        allergies: 'None known',
        currentMedication: 'None',
        importantMedicalNotes: 'Microchip ID: BRU-2021-0315. Friendly with strangers.',
        veterinarianName: 'Dr. Sharma',
        clinicName: 'Paws & Care Clinic',
        veterinarianPhone: '9876501234',
        clinicAddress: '12 Green Park Road, City Center',
        emergencyContactName: 'Demo Owner',
        emergencyContactRelationship: 'Owner',
        emergencyContactPhone: '9876543210',
      });
      console.log('Demo emergency info created.');
    }

    console.log('Seed completed successfully.');
  } catch (error) {
    console.error('Seed failed:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seed();
