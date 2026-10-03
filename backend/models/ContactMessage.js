const mongoose = require('mongoose');
const { addIdVirtual } = require('../utils/modelHelpers');

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

addIdVirtual(contactMessageSchema);

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
