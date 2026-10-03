const mongoose = require('mongoose');
const { addIdVirtual } = require('../utils/modelHelpers');

const medicalHistorySchema = new mongoose.Schema(
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
    date: { type: Date, required: [true, 'Date is required'] },
    recordType: {
      type: String,
      enum: ['Checkup', 'Illness', 'Injury', 'Surgery', 'Medication', 'Lab result', 'Other'],
      default: 'Other',
    },
    description: { type: String, trim: true, default: '' },
    diagnosis: { type: String, trim: true, default: '' },
    treatment: { type: String, trim: true, default: '' },
    medicine: { type: String, trim: true, default: '' },
    veterinarian: { type: String, trim: true, default: '' },
    clinicName: { type: String, trim: true, default: '' },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

addIdVirtual(medicalHistorySchema);

module.exports = mongoose.model('MedicalHistory', medicalHistorySchema);
