const MedicalHistory = require('../models/MedicalHistory');
const Pet = require('../models/Pet');
const { sendSuccess, sendError } = require('../utils/response');
const { formatDate } = require('../utils/dates');

const RECORD_TYPES = ['Checkup', 'Illness', 'Injury', 'Surgery', 'Medication', 'Lab result', 'Other'];

const formatRecord = (record, petName = '') => {
  const obj = record.toJSON ? record.toJSON() : record;
  const description = obj.description || obj.diagnosis || '';
  return {
    ...obj,
    id: obj.id || obj._id?.toString(),
    petId: obj.petId?._id?.toString?.() || obj.petId?.toString?.() || obj.petId,
    petName: petName || obj.petId?.name || '',
    date: formatDate(obj.date),
    recordType: obj.recordType || 'Other',
    description,
    diagnosis: description,
  };
};

const getMedicalRecords = async (req, res, next) => {
  try {
    const filter = { userId: req.user.id };
    if (req.query.petId) filter.petId = req.query.petId;
    if (req.query.recordType) filter.recordType = req.query.recordType;

    const records = await MedicalHistory.find(filter).populate('petId', 'name').sort({ date: -1 });
    return sendSuccess(
      res,
      'Health records fetched.',
      records.map((r) => formatRecord(r, r.petId?.name || ''))
    );
  } catch (error) {
    next(error);
  }
};

const getMedicalRecordById = async (req, res, next) => {
  try {
    const record = await MedicalHistory.findOne({ _id: req.params.id, userId: req.user.id }).populate(
      'petId',
      'name'
    );
    if (!record) return sendError(res, 'Health record not found.', 404);
    return sendSuccess(res, 'Health record fetched.', formatRecord(record, record.petId?.name || ''));
  } catch (error) {
    next(error);
  }
};

const createMedicalRecord = async (req, res, next) => {
  try {
    const { petId, date, recordType, description, diagnosis, treatment, medicine, veterinarian, clinicName, notes } =
      req.body;
    const desc = (description || diagnosis || '').trim();
    if (!petId || !date || !desc) {
      return sendError(res, 'Pet, date and description are required.');
    }

    const pet = await Pet.findOne({ _id: petId, userId: req.user.id });
    if (!pet) return sendError(res, 'Pet not found.', 404);

    const type = RECORD_TYPES.includes(recordType) ? recordType : 'Other';

    const record = await MedicalHistory.create({
      userId: req.user.id,
      petId,
      date,
      recordType: type,
      description: desc,
      diagnosis: desc,
      treatment: treatment || '',
      medicine: medicine || '',
      veterinarian: veterinarian || '',
      clinicName: clinicName || '',
      notes: notes || '',
    });

    return sendSuccess(res, 'Health record saved.', formatRecord(record, pet.name), 201);
  } catch (error) {
    next(error);
  }
};

const updateMedicalRecord = async (req, res, next) => {
  try {
    const record = await MedicalHistory.findOne({ _id: req.params.id, userId: req.user.id });
    if (!record) return sendError(res, 'Health record not found.', 404);

    const { petId, date, recordType, description, diagnosis, treatment, medicine, veterinarian, clinicName, notes } =
      req.body;

    if (petId) {
      const pet = await Pet.findOne({ _id: petId, userId: req.user.id });
      if (!pet) return sendError(res, 'Pet not found.', 404);
      record.petId = petId;
    }

    if (date !== undefined) record.date = date;
    if (recordType !== undefined && RECORD_TYPES.includes(recordType)) record.recordType = recordType;
    if (description !== undefined || diagnosis !== undefined) {
      const desc = (description || diagnosis || '').trim();
      record.description = desc;
      record.diagnosis = desc;
    }
    if (treatment !== undefined) record.treatment = treatment;
    if (medicine !== undefined) record.medicine = medicine;
    if (veterinarian !== undefined) record.veterinarian = veterinarian;
    if (clinicName !== undefined) record.clinicName = clinicName;
    if (notes !== undefined) record.notes = notes;

    await record.save();
    const pet = await Pet.findById(record.petId);
    return sendSuccess(res, 'Health record saved.', formatRecord(record, pet?.name || ''));
  } catch (error) {
    next(error);
  }
};

const deleteMedicalRecord = async (req, res, next) => {
  try {
    const record = await MedicalHistory.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!record) return sendError(res, 'Health record not found.', 404);
    return sendSuccess(res, 'Health record deleted.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMedicalRecords,
  getMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  formatRecord,
};
