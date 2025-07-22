const express = require('express');
const auth = require('../middlewares/auth.midddleware');
const { searchRecords } = require('../controllers/record.controller');

const router = express.Router();

router.get('/search', auth, searchRecords);

module.exports = router;
