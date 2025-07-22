const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/datasets', require('./dataset.routes'));
router.use('/records', require('./records.routes'));
router.use('/queries', require('./query.routes'));

module.exports = router;
