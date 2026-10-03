const User = require('../models/User');
const Pet = require('../models/Pet');
const Vaccination = require('../models/Vaccination');
const MedicalHistory = require('../models/MedicalHistory');
const VetVisit = require('../models/VetVisit');
const Reminder = require('../models/Reminder');
const WebsiteContent = require('../models/WebsiteContent');
const ContactMessage = require('../models/ContactMessage');
const { sendSuccess, sendError } = require('../utils/response');
const { deleteRecordsForPet, deleteRecordsForUser } = require('../utils/cascade');
const { formatPet } = require('./petController');
const { formatVaccination } = require('./vaccinationController');
const { formatRecord } = require('./medicalController');
const { formatVisit } = require('./vetVisitController');

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getOverview = async (req, res, next) => {
  try {
    const [users, pets, healthRecords, vaccinations, appointments, reminders, messages] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      Pet.countDocuments(),
      MedicalHistory.countDocuments(),
      Vaccination.countDocuments(),
      VetVisit.countDocuments(),
      Reminder.countDocuments(),
      ContactMessage.countDocuments(),
    ]);

    return sendSuccess(res, 'Admin overview fetched.', {
      totalUsers: users,
      totalPets: pets,
      totalHealthRecords: healthRecords,
      totalVaccinations: vaccinations,
      totalAppointments: appointments,
      totalReminders: reminders,
      totalContactMessages: messages,
    });
  } catch (error) {
    next(error);
  }
};

const listUsers = async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const filter = { role: { $ne: 'admin' } };
    if (q) {
      filter.$or = [
        { name: new RegExp(escapeRegex(q), 'i') },
        { email: new RegExp(escapeRegex(q), 'i') },
        { phone: new RegExp(escapeRegex(q), 'i') },
      ];
    }
    const users = await User.find(filter).sort({ createdAt: -1 });
    return sendSuccess(
      res,
      'Users fetched.',
      users.map((u) => ({
        id: u._id.toString(),
        fullName: u.name,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        createdAt: u.createdAt,
      }))
    );
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      return sendError(res, 'You cannot delete your own admin account.');
    }
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 'User not found.', 404);
    if (user.role === 'admin') return sendError(res, 'Cannot delete another admin from this panel.', 403);

    await deleteRecordsForUser(user._id);
    await User.deleteOne({ _id: user._id });
    return sendSuccess(res, 'User and related records deleted.');
  } catch (error) {
    next(error);
  }
};

const listPets = async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const filter = {};
    if (q) {
      filter.$or = [
        { name: new RegExp(escapeRegex(q), 'i') },
        { species: new RegExp(escapeRegex(q), 'i') },
        { breed: new RegExp(escapeRegex(q), 'i') },
      ];
    }
    const pets = await Pet.find(filter).populate('userId', 'name email').sort({ createdAt: -1 });
    return sendSuccess(
      res,
      'Pets fetched.',
      pets.map((p) => ({
        ...formatPet(p),
        ownerName: p.userId?.name || '',
        ownerEmail: p.userId?.email || '',
      }))
    );
  } catch (error) {
    next(error);
  }
};

const adminUpdatePet = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return sendError(res, 'Pet not found.', 404);
    const fields = ['name', 'species', 'breed', 'gender', 'dateOfBirth', 'approximateAge', 'weight', 'notes'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) pet[field] = req.body[field];
    });
    if (req.body.animalType) pet.species = req.body.animalType;
    await pet.save();
    return sendSuccess(res, 'Pet updated.', formatPet(pet));
  } catch (error) {
    next(error);
  }
};

const adminDeletePet = async (req, res, next) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return sendError(res, 'Pet not found.', 404);
    await deleteRecordsForPet(pet._id);
    return sendSuccess(res, 'Pet deleted.');
  } catch (error) {
    next(error);
  }
};

const listHealthRecords = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.recordType) filter.recordType = req.query.recordType;
    const records = await MedicalHistory.find(filter)
      .populate('petId', 'name')
      .populate('userId', 'name email')
      .sort({ date: -1 });
    return sendSuccess(
      res,
      'Health records fetched.',
      records.map((r) => ({
        ...formatRecord(r, r.petId?.name || ''),
        ownerName: r.userId?.name || '',
        ownerEmail: r.userId?.email || '',
      }))
    );
  } catch (error) {
    next(error);
  }
};

const adminDeleteHealth = async (req, res, next) => {
  try {
    const record = await MedicalHistory.findByIdAndDelete(req.params.id);
    if (!record) return sendError(res, 'Record not found.', 404);
    return sendSuccess(res, 'Health record deleted.');
  } catch (error) {
    next(error);
  }
};

const listVaccinations = async (req, res, next) => {
  try {
    const records = await Vaccination.find()
      .populate('petId', 'name')
      .populate('userId', 'name email')
      .sort({ nextDueDate: 1 });
    return sendSuccess(
      res,
      'Vaccinations fetched.',
      records.map((r) => ({
        ...formatVaccination(r, r.petId?.name || ''),
        ownerName: r.userId?.name || '',
        ownerEmail: r.userId?.email || '',
      }))
    );
  } catch (error) {
    next(error);
  }
};

const adminDeleteVaccination = async (req, res, next) => {
  try {
    const record = await Vaccination.findByIdAndDelete(req.params.id);
    if (!record) return sendError(res, 'Vaccination not found.', 404);
    return sendSuccess(res, 'Vaccination deleted.');
  } catch (error) {
    next(error);
  }
};

const listAppointments = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const records = await VetVisit.find(filter)
      .populate('petId', 'name')
      .populate('userId', 'name email')
      .sort({ visitDate: -1 });
    return sendSuccess(
      res,
      'Appointments fetched.',
      records.map((r) => ({
        ...formatVisit(r, r.petId?.name || ''),
        ownerName: r.userId?.name || '',
        ownerEmail: r.userId?.email || '',
      }))
    );
  } catch (error) {
    next(error);
  }
};

const adminUpdateAppointment = async (req, res, next) => {
  try {
    const record = await VetVisit.findById(req.params.id);
    if (!record) return sendError(res, 'Appointment not found.', 404);
    if (req.body.status) record.status = req.body.status;
    if (req.body.notes !== undefined) record.notes = req.body.notes;
    await record.save();
    return sendSuccess(res, 'Appointment updated.', formatVisit(record));
  } catch (error) {
    next(error);
  }
};

const adminDeleteAppointment = async (req, res, next) => {
  try {
    const record = await VetVisit.findByIdAndDelete(req.params.id);
    if (!record) return sendError(res, 'Appointment not found.', 404);
    return sendSuccess(res, 'Appointment deleted.');
  } catch (error) {
    next(error);
  }
};

const getContent = async (req, res, next) => {
  try {
    let content = await WebsiteContent.findOne({ key: 'homepage' });
    if (!content) content = await WebsiteContent.create({ key: 'homepage' });
    return sendSuccess(res, 'Website content fetched.', content.toJSON());
  } catch (error) {
    next(error);
  }
};

const updateContent = async (req, res, next) => {
  try {
    let content = await WebsiteContent.findOne({ key: 'homepage' });
    if (!content) content = await WebsiteContent.create({ key: 'homepage' });

    const fields = [
      'heroHeadline',
      'heroSubtext',
      'aboutText',
      'contactEmail',
      'contactPhone',
      'contactAddress',
      'careTips',
      'faqs',
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) content[field] = req.body[field];
    });
    await content.save();
    return sendSuccess(res, 'Website content updated.', content.toJSON());
  } catch (error) {
    next(error);
  }
};

const listMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(100);
    return sendSuccess(res, 'Messages fetched.', messages.map((m) => m.toJSON()));
  } catch (error) {
    next(error);
  }
};

const getSettings = async (req, res, next) => {
  try {
    return sendSuccess(res, 'Settings fetched.', {
      appName: 'SmartPet Health',
      adminEmail: req.user.email,
      jwtExpire: process.env.JWT_EXPIRE || '7d',
      remindersChannel: 'In-app only (email/push not configured)',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverview,
  listUsers,
  deleteUser,
  listPets,
  adminUpdatePet,
  adminDeletePet,
  listHealthRecords,
  adminDeleteHealth,
  listVaccinations,
  adminDeleteVaccination,
  listAppointments,
  adminUpdateAppointment,
  adminDeleteAppointment,
  getContent,
  updateContent,
  listMessages,
  getSettings,
};
