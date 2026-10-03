const mongoose = require('mongoose');
const { addIdVirtual } = require('../utils/modelHelpers');

const websiteContentSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: 'homepage' },
    heroHeadline: { type: String, default: 'Smart care for every pet, in one place' },
    heroSubtext: {
      type: String,
      default:
        'SmartPet Health helps you organize pet profiles, vaccinations, health notes, appointments, and reminders — so important care details are ready when you need them.',
    },
    aboutText: {
      type: String,
      default:
        'SmartPet Health is a pet healthcare management platform for owners who want organized records. It does not diagnose pets or replace a licensed veterinarian.',
    },
    contactEmail: { type: String, default: 'hello@smartpethealth.local' },
    contactPhone: { type: String, default: '+91 90000 00000' },
    contactAddress: { type: String, default: 'Pet Care Hub, Your City' },
    careTips: {
      type: [
        {
          title: String,
          body: String,
        },
      ],
      default: [
        { title: 'Keep vaccine dates handy', body: 'Log each vaccine and its next due date so clinic visits are easier.' },
        { title: 'Track weight over time', body: 'Sudden weight changes are useful context for your veterinarian.' },
        { title: 'Store clinic contacts', body: 'Save your regular clinic and an emergency contact in one profile.' },
      ],
    },
    faqs: {
      type: [
        {
          question: String,
          answer: String,
        },
      ],
      default: [
        {
          question: 'Does SmartPet Health replace a veterinarian?',
          answer: 'No. This app stores records you enter. Always consult a licensed veterinarian for medical advice.',
        },
        {
          question: 'Who can see my pet records?',
          answer: 'Only your logged-in account can access your pets. Admins can manage platform records from the admin panel.',
        },
      ],
    },
  },
  { timestamps: true }
);

addIdVirtual(websiteContentSchema);

module.exports = mongoose.model('WebsiteContent', websiteContentSchema);
