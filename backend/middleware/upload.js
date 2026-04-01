const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter (optional - to restrict types)
const fileFilter = (req, file, cb) => {
  // Allow images and pdfs
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter
});

module.exports = upload;
