const express = require('express');
const auth = require('../middlewares/auth.midddleware');
const { searchRecords } = require('../controllers/record.controller');

const router = express.Router();

router.get('/search', auth, searchRecords); // 👈 Nova rota

module.exports = router;
