const multer = require('multer');
const path = require('path');
const upload = multer({ dest: 'uploads/' })

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.csv', '.pdf'];
  console.log({file})
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos .csv e .pdf são permitidos'));
  }
};

const uploadMiddleware = multer({ storage, fileFilter });

module.exports = uploadMiddleware;
