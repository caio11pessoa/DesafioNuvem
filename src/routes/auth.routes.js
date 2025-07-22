const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controllers/auth/auth.controller');
const auth = require('../middlewares/auth.midddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, me);

module.exports = router;
