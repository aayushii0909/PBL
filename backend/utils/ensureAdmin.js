const User = require('../models/User');

const ensureAdminFromEnv = async () => {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = (process.env.ADMIN_NAME || 'SmartPet Admin').trim();
  const phone = (process.env.ADMIN_PHONE || '9999999999').trim();

  if (!email || !password) {
    console.log('Admin bootstrap skipped: set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env to create an admin.');
    return;
  }

  if (password.length < 6) {
    console.log('Admin bootstrap skipped: ADMIN_PASSWORD must be at least 6 characters.');
    return;
  }

  const existing = await User.findOne({ email });
  if (!existing) {
    await User.create({ name, email, phone, password, role: 'admin' });
    console.log(`Admin account ready for ${email}.`);
    return;
  }

  if (existing.role !== 'admin') {
    existing.role = 'admin';
    await existing.save();
    console.log(`Existing account ${email} was promoted to admin.`);
  }
};

module.exports = { ensureAdminFromEnv };
