const mongoose = require('mongoose');
const { addIdVirtual } = require('../utils/modelHelpers');

const reminderSchema = new mongoose.Schema(
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
      default: null,
    },
    title: { type: String, required: [true, 'Title is required'], trim: true },
    date: { type: Date, required: [true, 'Date is required'] },
    description: { type: String, trim: true, default: '' },
    type: {
      type: String,
      enum: ['vaccination', 'appointment', 'care', 'medical', 'vet', 'custom'],
      default: 'custom',
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

addIdVirtual(reminderSchema);

module.exports = mongoose.model('Reminder', reminderSchema);
