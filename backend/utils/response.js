const sendSuccess = (res, message, data = null, statusCode = 200) => {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  return res.status(statusCode).json(payload);
};

const sendError = (res, message, statusCode = 400) => {
  return res.status(statusCode).json({ success: false, message });
};

module.exports = { sendSuccess, sendError };
