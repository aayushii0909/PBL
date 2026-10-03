const Reminder = require('../models/Reminder');
const Pet = require('../models/Pet');
const Vaccination = require('../models/Vaccination');
const VetVisit = require('../models/VetVisit');
const { sendSuccess, sendError } = require('../utils/response');
const { formatDate, getDueStatus } = require('../utils/dates');

const formatReminder = (record, petName = '') => {
  const obj = record.toJSON ? record.toJSON() : record;
  return {
    ...obj,
    id: obj.id || obj._id?.toString(),
    petId: obj.petId?._id?.toString?.() || obj.petId?.toString?.() || obj.petId || '',
    petName: petName || obj.petId?.name || '',
    date: formatDate(obj.date),
    status: getDueStatus(obj.date),
  };
};

const getReminders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [custom, vaccinations, appointments] = await Promise.all([
      Reminder.find({ userId }).populate('petId', 'name').sort({ date: 1 }),
      Vaccination.find({ userId }).populate('petId', 'name'),
      VetVisit.find({ userId, status: { $ne: 'Cancelled' } }).populate('petId', 'name'),
    ]);

    const autoFromVaccines = vaccinations
      .filter((v) => v.nextDueDate)
      .map((v) => ({
        id: `vac_${v._id}`,
        title: `${v.vaccineName} vaccination due`,
        petId: v.petId?._id?.toString() || '',
        petName: v.petId?.name || '',
        date: formatDate(v.nextDueDate),
        description: 'Generated from vaccination next due date. In-app reminder only.',
        type: 'vaccination',
        status: getDueStatus(v.nextDueDate),
        auto: true,
      }));

    const autoFromAppointments = appointments
      .filter((a) => a.visitDate && a.status === 'Scheduled')
      .map((a) => ({
        id: `apt_${a._id}`,
        title: `Appointment: ${a.reason}`,
        petId: a.petId?._id?.toString() || '',
        petName: a.petId?.name || '',
        date: formatDate(a.visitDate),
        description: `${a.clinicName || a.veterinarianName || 'Clinic'}${a.visitTime ? ` at ${a.visitTime}` : ''}. In-app reminder only.`,
        type: 'appointment',
        status: getDueStatus(a.visitDate),
        auto: true,
      }));

    const customItems = custom.map((r) => formatReminder(r, r.petId?.name || ''));

    const data = [...autoFromVaccines, ...autoFromAppointments, ...customItems].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    return sendSuccess(res, 'Reminders fetched.', data);
  } catch (error) {
    next(error);
  }
};

const createReminder = async (req, res, next) => {
  try {
    const { petId, title, date, description, type } = req.body;
    if (!title || !date) {
      return sendError(res, 'Title and date are required.');
    }

    let petName = '';
    if (petId) {
      const pet = await Pet.findOne({ _id: petId, userId: req.user.id });
      if (!pet) return sendError(res, 'Pet not found.', 404);
      petName = pet.name;
    }

    const allowedTypes = ['vaccination', 'appointment', 'care', 'medical', 'vet', 'custom'];
    const reminderType = allowedTypes.includes(type) ? type : 'custom';

    const record = await Reminder.create({
      userId: req.user.id,
      petId: petId || null,
      title: title.trim(),
      date,
      description: description || '',
      type: reminderType,
    });

    return sendSuccess(res, 'Reminder added successfully.', formatReminder(record, petName), 201);
  } catch (error) {
    next(error);
  }
};

const updateReminder = async (req, res, next) => {
  try {
    if (String(req.params.id).startsWith('vac_') || String(req.params.id).startsWith('apt_')) {
      return sendError(res, 'Automatic reminders cannot be edited. Update the related record instead.');
    }

    const record = await Reminder.findOne({ _id: req.params.id, userId: req.user.id });
    if (!record) return sendError(res, 'Reminder not found.', 404);

    const { petId, title, date, description, type } = req.body;

    if (petId) {
      const pet = await Pet.findOne({ _id: petId, userId: req.user.id });
      if (!pet) return sendError(res, 'Pet not found.', 404);
      record.petId = petId;
    }

    if (title !== undefined) record.title = title.trim();
    if (date !== undefined) record.date = date;
    if (description !== undefined) record.description = description;
    if (type !== undefined) record.type = type;

    await record.save();
    const pet = record.petId ? await Pet.findById(record.petId) : null;
    return sendSuccess(res, 'Reminder updated.', formatReminder(record, pet?.name || ''));
  } catch (error) {
    next(error);
  }
};

const deleteReminder = async (req, res, next) => {
  try {
    if (String(req.params.id).startsWith('vac_') || String(req.params.id).startsWith('apt_')) {
      return sendError(res, 'Automatic reminders cannot be deleted from here.');
    }
    const record = await Reminder.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!record) return sendError(res, 'Reminder not found.', 404);
    return sendSuccess(res, 'Reminder deleted.');
  } catch (error) {
    next(error);
  }
};

module.exports = { getReminders, createReminder, updateReminder, deleteReminder };
