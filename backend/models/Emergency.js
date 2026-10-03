const mongoose = require('mongoose');
const { addIdVirtual } = require('../utils/modelHelpers');

const emergencySchema = new mongoose.Schema(
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
    bloodGroup: { type: String, trim: true, default: '' },
    allergies: { type: String, trim: true, default: '' },
    currentMedication: { type: String, trim: true, default: '' },
    importantMedicalNotes: { type: String, trim: true, default: '' },
    veterinarianName: { type: String, trim: true, default: '' },
    clinicName: { type: String, trim: true, default: '' },
    veterinarianPhone: { type: String, trim: true, default: '' },
    clinicAddress: { type: String, trim: true, default: '' },
    emergencyContactName: { type: String, trim: true, default: '' },
    emergencyContactRelationship: { type: String, trim: true, default: '' },
    emergencyContactPhone: { type: String, trim: true, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

emergencySchema.index({ userId: 1, petId: 1 }, { unique: true });

addIdVirtual(emergencySchema);

module.exports = mongoose.model('Emergency', emergencySchema);
