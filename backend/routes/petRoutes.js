const express = require('express');
const {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
} = require('../controllers/petController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.route('/').get(getPets).post(createPet);
router.route('/:id').get(getPetById).put(updatePet).delete(deletePet);

module.exports = router;
