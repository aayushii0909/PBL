const express = require('express');
const {
  getMedicalRecords,
  getMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
} = require('../controllers/medicalController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.route('/').get(getMedicalRecords).post(createMedicalRecord);
router.route('/:id').get(getMedicalRecordById).put(updateMedicalRecord).delete(deleteMedicalRecord);

module.exports = router;
