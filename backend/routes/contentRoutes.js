const express = require('express');
const { getPublicContent, submitContact } = require('../controllers/contentController');

const router = express.Router();

router.get('/', getPublicContent);
router.post('/contact', submitContact);

module.exports = router;
