const WebsiteContent = require('../models/WebsiteContent');
const ContactMessage = require('../models/ContactMessage');
const { sendSuccess, sendError } = require('../utils/response');

const getPublicContent = async (req, res, next) => {
  try {
    let content = await WebsiteContent.findOne({ key: 'homepage' });
    if (!content) content = await WebsiteContent.create({ key: 'homepage' });
    return sendSuccess(res, 'Content fetched.', content.toJSON());
  } catch (error) {
    next(error);
  }
};

const submitContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return sendError(res, 'Name, email and message are required.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return sendError(res, 'Enter a valid email.');
    }
    await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });
    return sendSuccess(res, 'Message received. We will review it from the admin panel.', null, 201);
  } catch (error) {
    next(error);
  }
};

module.exports = { getPublicContent, submitContact };
