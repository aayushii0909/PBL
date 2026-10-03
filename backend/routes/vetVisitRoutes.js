const express = require('express');
const {
  getVetVisits,
  getVetVisitById,
  createVetVisit,
  updateVetVisit,
  deleteVetVisit,
} = require('../controllers/vetVisitController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.route('/').get(getVetVisits).post(createVetVisit);
router.route('/:id').get(getVetVisitById).put(updateVetVisit).delete(deleteVetVisit);

module.exports = router;
