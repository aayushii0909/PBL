const mongoose = require('mongoose');
const { addIdVirtual } = require('../utils/modelHelpers');

const petSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: { type: String, required: [true, 'Pet name is required'], trim: true },
    species: { type: String, required: [true, 'Animal type is required'], trim: true },
    breed: { type: String, trim: true, default: '' },
    gender: { type: String, trim: true, default: '' },
    dateOfBirth: { type: Date, default: null },
    approximateAge: { type: String, trim: true, default: '' },
    weight: { type: String, trim: true, default: '' },
    imageUrl: { type: String, trim: true, default: '' },
    color: { type: String, trim: true, default: '' },
    ownerContact: { type: String, trim: true, default: '' },
    allergies: { type: String, trim: true, default: '' },
    notes: { type: String, trim: true, default: '' },
    photo: { type: String, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

addIdVirtual(petSchema);

module.exports = mongoose.model('Pet', petSchema);
