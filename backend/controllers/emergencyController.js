const Emergency = require('../models/Emergency');
const Pet = require('../models/Pet');
const { sendSuccess, sendError } = require('../utils/response');

const formatEmergency = (record, pet = null) => {
  const obj = record.toJSON ? record.toJSON() : record;
  return {
    ...obj,
    id: obj.id || obj._id?.toString(),
    petId: obj.petId?.toString?.() || obj.petId,
    petName: pet?.name || obj.petName || '',
    species: pet?.species || '',
    breed: pet?.breed || '',
  };
};

// GET /api/emergency/:petId
const getEmergency = async (req, res, next) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.petId, userId: req.user.id });
    if (!pet) return sendError(res, 'Pet not found.', 404);

    const record = await Emergency.findOne({ userId: req.user.id, petId: req.params.petId });
    if (!record) {
      return sendSuccess(res, 'No emergency information saved yet.', null);
    }

    return sendSuccess(res, 'Emergency information fetched.', formatEmergency(record, pet));
  } catch (error) {
    next(error);
  }
};

// POST /api/emergency
const createEmergency = async (req, res, next) => {
  try {
    const {
      petId,
      bloodGroup,
      allergies,
      currentMedication,
      importantMedicalNotes,
      veterinarianName,
      clinicName,
      veterinarianPhone,
      clinicAddress,
      emergencyContactName,
      emergencyContactRelationship,
      emergencyContactPhone,
    } = req.body;

    if (!petId) return sendError(res, 'Pet is required.');
    if (!emergencyContactName || !emergencyContactPhone) {
      return sendError(res, 'Emergency contact name and phone are required.');
    }

    const pet = await Pet.findOne({ _id: petId, userId: req.user.id });
    if (!pet) return sendError(res, 'Pet not found.', 404);

    const existing = await Emergency.findOne({ userId: req.user.id, petId });
    if (existing) {
      return sendError(res, 'Emergency information already exists for this pet. Use update instead.');
    }

    const record = await Emergency.create({
      userId: req.user.id,
      petId,
      bloodGroup: bloodGroup || '',
      allergies: allergies || '',
      currentMedication: currentMedication || '',
      importantMedicalNotes: importantMedicalNotes || '',
      veterinarianName: veterinarianName || '',
      clinicName: clinicName || '',
      veterinarianPhone: veterinarianPhone || '',
      clinicAddress: clinicAddress || '',
      emergencyContactName: emergencyContactName.trim(),
      emergencyContactRelationship: emergencyContactRelationship || '',
      emergencyContactPhone: emergencyContactPhone.trim(),
    });

    return sendSuccess(res, 'Emergency information saved.', formatEmergency(record, pet), 201);
  } catch (error) {
    next(error);
  }
};

// PUT /api/emergency/:petId
const updateEmergency = async (req, res, next) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.petId, userId: req.user.id });
    if (!pet) return sendError(res, 'Pet not found.', 404);

    let record = await Emergency.findOne({ userId: req.user.id, petId: req.params.petId });

    const payload = {
      bloodGroup: req.body.bloodGroup || '',
      allergies: req.body.allergies || '',
      currentMedication: req.body.currentMedication || '',
      importantMedicalNotes: req.body.importantMedicalNotes || '',
      veterinarianName: req.body.veterinarianName || '',
      clinicName: req.body.clinicName || '',
      veterinarianPhone: req.body.veterinarianPhone || '',
      clinicAddress: req.body.clinicAddress || '',
      emergencyContactName: (req.body.emergencyContactName || '').trim(),
      emergencyContactRelationship: req.body.emergencyContactRelationship || '',
      emergencyContactPhone: (req.body.emergencyContactPhone || '').trim(),
    };

    if (!payload.emergencyContactName || !payload.emergencyContactPhone) {
      return sendError(res, 'Emergency contact name and phone are required.');
    }

    if (!record) {
      record = await Emergency.create({
        userId: req.user.id,
        petId: req.params.petId,
        ...payload,
      });
    } else {
      Object.assign(record, payload);
      await record.save();
    }

    return sendSuccess(res, 'Emergency information saved.', formatEmergency(record, pet));
  } catch (error) {
    next(error);
  }
};

module.exports = { getEmergency, createEmergency, updateEmergency };
