const multer = require('multer');
const path = require('path');


const uploadMiddleware = multer({
    storage: multer.diskStorage({
        destination: 'uploads/',
        filename: (_req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    }),
    fileFilter: (_req, file, cb) => {
        const allowedTypes = ['.csv', '.pdf'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Apenas arquivos .csv e .pdf são permitidos'));
        }
    }
})

module.exports = uploadMiddleware;
