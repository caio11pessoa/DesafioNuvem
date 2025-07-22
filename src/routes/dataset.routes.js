const express = require('express');
const router = express.Router();
const { upload, getUserDatasets, getDatasetRecords } = require('../controllers/dataset/dataset.controller');
const auth = require('../middlewares/auth.midddleware');
const uploadMidlleware = require('../middlewares/upload.middleware');

router.post('/upload', auth, uploadMidlleware.single('file'), upload);
router.get('/:id/records', auth, getDatasetRecords);
router.get('/', auth, getUserDatasets);

module.exports = router;
