const express = require('express');
const auth = require('../middlewares/auth.midddleware');
const { registerQuery, listQueries } = require('../controllers/query/query.controller');

const router = express.Router();

router.post('/', auth, registerQuery);
router.get('/', auth, listQueries);

module.exports = router;
