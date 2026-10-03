const Pet = require('../models/Pet');
const { sendSuccess, sendError } = require('../utils/response');
const { formatDate } = require('../utils/dates');
const { deleteRecordsForPet } = require('../utils/cascade');

const formatPet = (pet) => {
  const obj = pet.toJSON ? pet.toJSON() : pet;
  return {
    ...obj,
    id: obj.id || obj._id?.toString(),
    animalType: obj.species,
    dateOfBirth: formatDate(obj.dateOfBirth),
    photo: obj.photo || obj.imageUrl || '',
    imageUrl: obj.imageUrl || '',
  };
};

const getPets = async (req, res, next) => {
  try {
    const pets = await Pet.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return sendSuccess(res, 'Pets fetched.', pets.map(formatPet));
  } catch (error) {
    next(error);
  }
};

const getPetById = async (req, res, next) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, userId: req.user.id });
    if (!pet) return sendError(res, 'Pet not found.', 404);
    return sendSuccess(res, 'Pet fetched.', formatPet(pet));
  } catch (error) {
    next(error);
  }
};

const createPet = async (req, res, next) => {
  try {
    const {
      name,
      species,
      animalType,
      breed,
      gender,
      dateOfBirth,
      approximateAge,
      weight,
      color,
      ownerContact,
      allergies,
      notes,
      photo,
      imageUrl,
    } = req.body;

    const type = (animalType || species || '').trim();
    if (!name || !type) {
      return sendError(res, 'Pet name and animal type are required.');
    }

    const pet = await Pet.create({
      userId: req.user.id,
      name: name.trim(),
      species: type,
      breed: breed || '',
      gender: gender || '',
      dateOfBirth: dateOfBirth || null,
      approximateAge: approximateAge || '',
      weight: weight || '',
      color: color || '',
      ownerContact: ownerContact || '',
      allergies: allergies || '',
      notes: notes || '',
      photo: photo || '',
      imageUrl: imageUrl || '',
    });

    return sendSuccess(res, 'Pet added successfully.', formatPet(pet), 201);
  } catch (error) {
    next(error);
  }
};

const updatePet = async (req, res, next) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, userId: req.user.id });
    if (!pet) return sendError(res, 'Pet not found.', 404);

    const fields = [
      'name',
      'species',
      'breed',
      'gender',
      'dateOfBirth',
      'approximateAge',
      'weight',
      'color',
      'ownerContact',
      'allergies',
      'notes',
      'photo',
      'imageUrl',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        pet[field] = req.body[field];
      }
    });

    if (req.body.animalType) {
      pet.species = req.body.animalType;
    }

    if (!pet.name || !pet.species) {
      return sendError(res, 'Pet name and animal type are required.');
    }

    await pet.save();
    return sendSuccess(res, 'Pet updated successfully.', formatPet(pet));
  } catch (error) {
    next(error);
  }
};

const deletePet = async (req, res, next) => {
  try {
    const pet = await Pet.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!pet) return sendError(res, 'Pet not found.', 404);
    await deleteRecordsForPet(pet._id);
    return sendSuccess(res, 'Pet deleted successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = { getPets, getPetById, createPet, updatePet, deletePet, formatPet };
