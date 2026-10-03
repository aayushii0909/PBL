const Pet = require('../models/Pet');
const Vaccination = require('../models/Vaccination');
const MedicalHistory = require('../models/MedicalHistory');
const VetVisit = require('../models/VetVisit');
const Reminder = require('../models/Reminder');
const { sendSuccess } = require('../utils/response');
const { formatDate, getDueStatus } = require('../utils/dates');

const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [pets, vaccinations, medicalRecords, appointments, reminders] = await Promise.all([
      Pet.find({ userId }).sort({ createdAt: -1 }),
      Vaccination.find({ userId }).populate('petId', 'name').sort({ nextDueDate: 1 }),
      MedicalHistory.find({ userId }).populate('petId', 'name').sort({ date: -1 }),
      VetVisit.find({ userId }).populate('petId', 'name').sort({ visitDate: -1 }),
      Reminder.find({ userId }).populate('petId', 'name').sort({ date: 1 }),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueVaccinations = vaccinations.filter((v) => {
      if (!v.nextDueDate) return false;
      const due = new Date(v.nextDueDate);
      due.setHours(0, 0, 0, 0);
      return due < today;
    });

    const upcomingCustom = reminders.filter((r) => r.date && new Date(r.date) >= today);
    const upcomingAppointments = appointments.filter(
      (a) => a.status === 'Scheduled' && a.visitDate && new Date(a.visitDate) >= today
    );

    const upcomingVaccinations = vaccinations
      .filter((v) => v.nextDueDate)
      .map((v) => ({
        id: v._id.toString(),
        petId: v.petId?._id?.toString() || v.petId?.toString(),
        petName: v.petId?.name || '',
        vaccineName: v.vaccineName,
        dateGiven: formatDate(v.dateGiven),
        nextDueDate: formatDate(v.nextDueDate),
        status: getDueStatus(v.nextDueDate),
      }))
      .slice(0, 6);

    const dashboardReminders = [
      ...upcomingVaccinations.map((v) => ({
        id: `vac_${v.id}`,
        title: `${v.vaccineName} due`,      
        petName: v.petName,
        date: v.nextDueDate,
        status: v.status,
        type: 'vaccination',
      })),
      ...upcomingAppointments.slice(0, 5).map((a) => ({
        id: a._id.toString(),
        title: a.reason,
        petName: a.petId?.name || '',
        date: formatDate(a.visitDate),
        status: getDueStatus(a.visitDate),
        type: 'appointment',
      })),
      ...upcomingCustom.slice(0, 5).map((r) => ({
        id: r._id.toString(),
        title: r.title,
        petName: r.petId?.name || '',
        date: formatDate(r.date),
        status: getDueStatus(r.date),
        type: r.type,
      })),
    ]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 6);

    const recentActivity = [
      ...medicalRecords.slice(0, 5).map((m) => ({
        id: m._id.toString(),
        text: `Health note (${m.recordType || 'Other'}): ${m.description || m.diagnosis} · ${m.petId?.name || 'pet'}`,
        date: formatDate(m.date),
      })),
      ...appointments.slice(0, 5).map((v) => ({
        id: v._id.toString(),
        text: `Appointment: ${v.reason} · ${v.petId?.name || 'pet'}`,
        date: formatDate(v.visitDate),
      })),
      ...vaccinations.slice(0, 5).map((v) => ({
        id: v._id.toString(),
        text: `Vaccine: ${v.vaccineName} · ${v.petId?.name || 'pet'}`,
        date: formatDate(v.dateGiven),
      })),
    ]
      .filter((i) => i.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);

    return sendSuccess(res, 'Dashboard data fetched.', {
      totalPets: pets.length,
      totalVaccinations: vaccinations.length,
      totalMedicalRecords: medicalRecords.length,
      totalHealthRecords: medicalRecords.length,
      totalVetVisits: appointments.length,
      totalAppointments: appointments.length,
      upcomingReminders: dashboardReminders.length,
      overdueVaccinations: overdueVaccinations.length,
      pets: pets.map((p) => {
        const obj = p.toJSON();
        return {
          ...obj,
          animalType: obj.species,
          dateOfBirth: formatDate(obj.dateOfBirth),
        };
      }),
      upcomingVaccinations,
      upcomingAppointments: upcomingAppointments.slice(0, 5).map((a) => ({
        id: a._id.toString(),
        petName: a.petId?.name || '',
        reason: a.reason,
        date: formatDate(a.visitDate),
        time: a.visitTime || '',
        clinic: a.clinicName || a.veterinarianName,
        status: a.status,
      })),
      dashboardReminders,
      recentActivity,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };
