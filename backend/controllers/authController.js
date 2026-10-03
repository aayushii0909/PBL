const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/response');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const formatUser = (user) => ({
  id: user._id.toString(),
  fullName: user.name,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role || 'user',
  createdAt: user.createdAt,
});

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, fullName, email, phone, password } = req.body;
    const userName = (name || fullName || '').trim();

    if (!userName || !email || !phone || !password) {
      return sendError(res, 'Please fill all required fields.');
    }

    if (password.length < 6) {
      return sendError(res, 'Password must be at least 6 characters.');
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return sendError(res, 'An account with this email already exists.');
    }

    const user = await User.create({
      name: userName,
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password,
      role: 'user',
    });

    return sendSuccess(
      res,
      'Registration successful! Please login.',
      { user: formatUser(user) },
      201
    );
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email and password are required.');
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return sendError(res, 'Invalid email or password.', 401);
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return sendError(res, 'Invalid email or password.', 401);
    }

    const token = generateToken(user._id);

    return sendSuccess(res, 'Login successful.', {
      token,
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return sendError(res, 'User not found.', 404);
    }
    return sendSuccess(res, 'User profile fetched.', { user: formatUser(user) });
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, fullName, email, phone } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return sendError(res, 'User not found.', 404);
    }

    const nextName = (name || fullName || '').trim();
    if (!nextName || !email || !phone) {
      return sendError(res, 'Please fill all required fields.');
    }

    const emailNorm = email.toLowerCase().trim();
    if (emailNorm !== user.email) {
      const exists = await User.findOne({ email: emailNorm });
      if (exists) {
        return sendError(res, 'An account with this email already exists.');
      }
    }

    user.name = nextName;
    user.email = emailNorm;
    user.phone = phone.trim();
    await user.save();

    return sendSuccess(res, 'Profile updated successfully.', { user: formatUser(user) });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/setup-admin  { setupSecret, name, email, phone, password }
const setupAdmin = async (req, res, next) => {
  try {
    const expected = process.env.ADMIN_SETUP_SECRET;
    if (!expected) {
      return sendError(res, 'Admin setup is not enabled on this server.', 403);
    }

    const { setupSecret, name, email, phone, password } = req.body;
    if (!setupSecret || setupSecret !== expected) {
      return sendError(res, 'Invalid setup secret.', 403);
    }

    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount > 0) {
      return sendError(res, 'An admin account already exists. Use environment bootstrap if needed.', 400);
    }

    const userName = (name || 'SmartPet Admin').trim();
    const adminEmail = (email || '').toLowerCase().trim();
    if (!adminEmail || !password || !phone) {
      return sendError(res, 'Name, email, phone and password are required.');
    }
    if (password.length < 6) {
      return sendError(res, 'Password must be at least 6 characters.');
    }

    const exists = await User.findOne({ email: adminEmail });
    if (exists) {
      exists.role = 'admin';
      exists.name = userName;
      exists.phone = phone.trim();
      exists.password = password;
      await exists.save();
      return sendSuccess(res, 'Existing user promoted to admin. You can now login.', { user: formatUser(exists) });
    }

    const user = await User.create({
      name: userName,
      email: adminEmail,
      phone: phone.trim(),
      password,
      role: 'admin',
    });

    return sendSuccess(res, 'Admin account created. You can now login.', { user: formatUser(user) }, 201);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateProfile, setupAdmin };
