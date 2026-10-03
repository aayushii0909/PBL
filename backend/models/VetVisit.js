const mongoose = require('mongoose');
const { addIdVirtual } = require('../utils/modelHelpers');

const vetVisitSchema = new mongoose.Schema(
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
    veterinarianName: { type: String, trim: true, default: '' },
    clinicName: { type: String, trim: true, default: '' },
    visitDate: { type: Date, required: [true, 'Appointment date is required'] },
    visitTime: { type: String, trim: true, default: '' },
    reason: { type: String, required: [true, 'Reason is required'], trim: true },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
    treatment: { type: String, trim: true, default: '' },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

addIdVirtual(vetVisitSchema);

module.exports = mongoose.model('VetVisit', vetVisitSchema);
