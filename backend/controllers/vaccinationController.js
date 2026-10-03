const Vaccination = require('../models/Vaccination');
const Pet = require('../models/Pet');
const { sendSuccess, sendError } = require('../utils/response');
const { formatDate, getDueStatus } = require('../utils/dates');

const formatVaccination = (record, petName = '') => {
  const obj = record.toJSON ? record.toJSON() : record;
  const nextDueDate = formatDate(obj.nextDueDate);
  return {
    ...obj,
    id: obj.id || obj._id?.toString(),
    petId: obj.petId?._id?.toString?.() || obj.petId?.toString?.() || obj.petId,
    petName: petName || obj.petId?.name || obj.petName || '',
    dateGiven: formatDate(obj.dateGiven),
    vaccinationDate: formatDate(obj.dateGiven),
    nextDueDate,
    status: getDueStatus(obj.nextDueDate),
  };
};

const assertOwnPet = async (userId, petId) => Pet.findOne({ _id: petId, userId });

const getVaccinations = async (req, res, next) => {
  try {
    const filter = { userId: req.user.id };
    if (req.query.petId) filter.petId = req.query.petId;

    const records = await Vaccination.find(filter).populate('petId', 'name').sort({ dateGiven: -1 });
    const data = records.map((r) => formatVaccination(r, r.petId?.name || ''));
    return sendSuccess(res, 'Vaccinations fetched.', data);
  } catch (error) {
    next(error);
  }
};

const getVaccinationById = async (req, res, next) => {
  try {
    const record = await Vaccination.findOne({ _id: req.params.id, userId: req.user.id }).populate(
      'petId',
      'name'
    );
    if (!record) return sendError(res, 'Vaccination not found.', 404);
    return sendSuccess(res, 'Vaccination fetched.', formatVaccination(record, record.petId?.name || ''));
  } catch (error) {
    next(error);
  }
};

const createVaccination = async (req, res, next) => {
  try {
    const { petId, vaccineName, dateGiven, vaccinationDate, nextDueDate, veterinarian, notes } = req.body;
    const given = dateGiven || vaccinationDate;

    if (!petId || !vaccineName || !given || !nextDueDate) {
      return sendError(res, 'Please fill all required fields.');
    }

    const pet = await assertOwnPet(req.user.id, petId);
    if (!pet) return sendError(res, 'Pet not found.', 404);

    const record = await Vaccination.create({
      userId: req.user.id,
      petId,
      vaccineName: vaccineName.trim(),
      dateGiven: given,
      nextDueDate,
      veterinarian: veterinarian || '',
      notes: notes || '',
    });

    return sendSuccess(res, 'Vaccination record saved.', formatVaccination(record, pet.name), 201);
  } catch (error) {
    next(error);
  }
};

const updateVaccination = async (req, res, next) => {
  try {
    const record = await Vaccination.findOne({ _id: req.params.id, userId: req.user.id });
    if (!record) return sendError(res, 'Vaccination not found.', 404);

    const { petId, vaccineName, dateGiven, vaccinationDate, nextDueDate, veterinarian, notes } = req.body;

    if (petId) {
      const pet = await assertOwnPet(req.user.id, petId);
      if (!pet) return sendError(res, 'Pet not found.', 404);
      record.petId = petId;
    }

    if (vaccineName !== undefined) record.vaccineName = vaccineName.trim();
    if (dateGiven !== undefined || vaccinationDate !== undefined) {
      record.dateGiven = dateGiven || vaccinationDate;
    }
    if (nextDueDate !== undefined) record.nextDueDate = nextDueDate;
    if (veterinarian !== undefined) record.veterinarian = veterinarian;
    if (notes !== undefined) record.notes = notes;

    await record.save();
    const pet = await Pet.findById(record.petId);
    return sendSuccess(res, 'Vaccination record saved.', formatVaccination(record, pet?.name || ''));
  } catch (error) {
    next(error);
  }
};

const deleteVaccination = async (req, res, next) => {
  try {
    const record = await Vaccination.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!record) return sendError(res, 'Vaccination not found.', 404);
    return sendSuccess(res, 'Vaccination deleted successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVaccinations,
  getVaccinationById,
  createVaccination,
  updateVaccination,
  deleteVaccination,
  formatVaccination,
};
