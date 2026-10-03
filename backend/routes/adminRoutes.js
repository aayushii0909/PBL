const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const admin = require('../controllers/adminController');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/overview', admin.getOverview);
router.get('/users', admin.listUsers);
router.delete('/users/:id', admin.deleteUser);
router.get('/pets', admin.listPets);
router.put('/pets/:id', admin.adminUpdatePet);
router.delete('/pets/:id', admin.adminDeletePet);
router.get('/health-records', admin.listHealthRecords);
router.delete('/health-records/:id', admin.adminDeleteHealth);
router.get('/vaccinations', admin.listVaccinations);
router.delete('/vaccinations/:id', admin.adminDeleteVaccination);
router.get('/appointments', admin.listAppointments);
router.put('/appointments/:id', admin.adminUpdateAppointment);
router.delete('/appointments/:id', admin.adminDeleteAppointment);
router.get('/content', admin.getContent);
router.put('/content', admin.updateContent);
router.get('/messages', admin.listMessages);
router.get('/settings', admin.getSettings);

module.exports = router;
