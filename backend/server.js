require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const { ensureAdminFromEnv } = require('./utils/ensureAdmin');

const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');
const vaccinationRoutes = require('./routes/vaccinationRoutes');
const medicalRoutes = require('./routes/medicalRoutes');
const vetVisitRoutes = require('./routes/vetVisitRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contentRoutes = require('./routes/contentRoutes');

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SmartPet Health API is running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/vaccinations', vaccinationRoutes);
app.use('/api/medical-records', medicalRoutes);
app.use('/api/health-records', medicalRoutes);
app.use('/api/vet-visits', vetVisitRoutes);
app.use('/api/appointments', vetVisitRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/content', contentRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await ensureAdminFromEnv();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
