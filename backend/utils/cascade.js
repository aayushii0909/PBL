const Vaccination = require('../models/Vaccination');
const MedicalHistory = require('../models/MedicalHistory');
const VetVisit = require('../models/VetVisit');
const Reminder = require('../models/Reminder');
const Emergency = require('../models/Emergency');
const Pet = require('../models/Pet');

const deleteRecordsForPet = async (petId) => {
  await Promise.all([
    Vaccination.deleteMany({ petId }),
    MedicalHistory.deleteMany({ petId }),
    VetVisit.deleteMany({ petId }),
    Reminder.deleteMany({ petId }),
    Emergency.deleteMany({ petId }),
  ]);
};

const deleteRecordsForUser = async (userId) => {
  const pets = await Pet.find({ userId }).select('_id');
  const petIds = pets.map((p) => p._id);
  await Promise.all([
    Pet.deleteMany({ userId }),
    Vaccination.deleteMany({ userId }),
    MedicalHistory.deleteMany({ userId }),
    VetVisit.deleteMany({ userId }),
    Reminder.deleteMany({ userId }),
    Emergency.deleteMany({ userId }),
  ]);
  return petIds.length;
};

module.exports = { deleteRecordsForPet, deleteRecordsForUser };
