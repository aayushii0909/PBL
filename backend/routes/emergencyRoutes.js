const express = require('express');
const {
  getEmergency,
  createEmergency,
  updateEmergency,
} = require('../controllers/emergencyController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.post('/', createEmergency);
router.get('/:petId', getEmergency);
router.put('/:petId', updateEmergency);

module.exports = router;
