const express = require('express');
const {
  getVaccinations,
  getVaccinationById,
  createVaccination,
  updateVaccination,
  deleteVaccination,
} = require('../controllers/vaccinationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.route('/').get(getVaccinations).post(createVaccination);
router.route('/:id').get(getVaccinationById).put(updateVaccination).delete(deleteVaccination);

module.exports = router;
