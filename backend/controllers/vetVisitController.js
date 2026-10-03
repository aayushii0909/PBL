const VetVisit = require('../models/VetVisit');
const Pet = require('../models/Pet');
const { sendSuccess, sendError } = require('../utils/response');
const { formatDate } = require('../utils/dates');

const STATUSES = ['Scheduled', 'Completed', 'Cancelled'];

const formatVisit = (record, petName = '') => {
  const obj = record.toJSON ? record.toJSON() : record;
  const visitDate = formatDate(obj.visitDate);
  return {
    ...obj,
    id: obj.id || obj._id?.toString(),
    petId: obj.petId?._id?.toString?.() || obj.petId?.toString?.() || obj.petId,
    petName: petName || obj.petId?.name || '',
    visitDate,
    appointmentDate: visitDate,
    visitTime: obj.visitTime || '',
    time: obj.visitTime || '',
    clinicName: obj.clinicName || '',
    veterinarianName: obj.veterinarianName || '',
    status: obj.status || 'Scheduled',
  };
};

const getVetVisits = async (req, res, next) => {
  try {
    const filter = { userId: req.user.id };
    if (req.query.petId) filter.petId = req.query.petId;
    if (req.query.status) filter.status = req.query.status;

    const records = await VetVisit.find(filter).populate('petId', 'name').sort({ visitDate: -1 });
    return sendSuccess(
      res,
      'Appointments fetched.',
      records.map((r) => formatVisit(r, r.petId?.name || ''))
    );
  } catch (error) {
    next(error);
  }
};

const getVetVisitById = async (req, res, next) => {
  try {
    const record = await VetVisit.findOne({ _id: req.params.id, userId: req.user.id }).populate(
      'petId',
      'name'
    );
    if (!record) return sendError(res, 'Appointment not found.', 404);
    return sendSuccess(res, 'Appointment fetched.', formatVisit(record, record.petId?.name || ''));
  } catch (error) {
    next(error);
  }
};

const createVetVisit = async (req, res, next) => {
  try {
    const {
      petId,
      veterinarianName,
      clinicName,
      visitDate,
      appointmentDate,
      visitTime,
      time,
      reason,
      treatment,
      notes,
      status,
    } = req.body;

    const date = visitDate || appointmentDate;
    const clinic = (clinicName || veterinarianName || '').trim();
    if (!petId || !date || !reason || !clinic) {
      return sendError(res, 'Pet, date, clinic/veterinarian and reason are required.');
    }

    const pet = await Pet.findOne({ _id: petId, userId: req.user.id });
    if (!pet) return sendError(res, 'Pet not found.', 404);

    const record = await VetVisit.create({
      userId: req.user.id,
      petId,
      veterinarianName: (veterinarianName || '').trim(),
      clinicName: (clinicName || veterinarianName || '').trim(),
      visitDate: date,
      visitTime: visitTime || time || '',
      reason: reason.trim(),
      treatment: treatment || '',
      notes: notes || '',
      status: STATUSES.includes(status) ? status : 'Scheduled',
    });

    return sendSuccess(res, 'Appointment saved.', formatVisit(record, pet.name), 201);
  } catch (error) {
    next(error);
  }
};

const updateVetVisit = async (req, res, next) => {
  try {
    const record = await VetVisit.findOne({ _id: req.params.id, userId: req.user.id });
    if (!record) return sendError(res, 'Appointment not found.', 404);

    const {
      petId,
      veterinarianName,
      clinicName,
      visitDate,
      appointmentDate,
      visitTime,
      time,
      reason,
      treatment,
      notes,
      status,
    } = req.body;

    if (petId) {
      const pet = await Pet.findOne({ _id: petId, userId: req.user.id });
      if (!pet) return sendError(res, 'Pet not found.', 404);
      record.petId = petId;
    }

    if (veterinarianName !== undefined) record.veterinarianName = veterinarianName.trim();
    if (clinicName !== undefined) record.clinicName = clinicName;
    if (visitDate !== undefined || appointmentDate !== undefined) {
      record.visitDate = visitDate || appointmentDate;
    }
    if (visitTime !== undefined || time !== undefined) record.visitTime = visitTime || time || '';
    if (reason !== undefined) record.reason = reason.trim();
    if (treatment !== undefined) record.treatment = treatment;
    if (notes !== undefined) record.notes = notes;
    if (status !== undefined && STATUSES.includes(status)) record.status = status;

    await record.save();
    const pet = await Pet.findById(record.petId);
    return sendSuccess(res, 'Appointment saved.', formatVisit(record, pet?.name || ''));
  } catch (error) {
    next(error);
  }
};

const deleteVetVisit = async (req, res, next) => {
  try {
    const record = await VetVisit.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!record) return sendError(res, 'Appointment not found.', 404);
    return sendSuccess(res, 'Appointment deleted.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVetVisits,
  getVetVisitById,
  createVetVisit,
  updateVetVisit,
  deleteVetVisit,
  formatVisit,
};
