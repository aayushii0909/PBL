const { sendError } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    return sendError(res, message, 400);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return sendError(res, `${field} already exists.`, 400);
  }

  if (err.name === 'CastError') {
    return sendError(res, 'Invalid ID format.', 400);
  }

  return sendError(res, err.message || 'Server error', err.statusCode || 500);
};

const notFound = (req, res) => {
  sendError(res, `Route not found: ${req.originalUrl}`, 404);
};

module.exports = { errorHandler, notFound };
