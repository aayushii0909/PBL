const mongoose = require('mongoose');
const { addIdVirtual } = require('../utils/modelHelpers');

const vaccinationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: true,
    },
    vaccineName: { type: String, required: [true, 'Vaccine name is required'], trim: true },
    dateGiven: { type: Date, required: [true, 'Date given is required'] },
    nextDueDate: { type: Date, required: [true, 'Next due date is required'] },
    veterinarian: { type: String, trim: true, default: '' },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

addIdVirtual(vaccinationSchema);

module.exports = mongoose.model('Vaccination', vaccinationSchema);
