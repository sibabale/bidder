const path = require('path');
const express = require('express');
const multer = require('multer');
const admin = require('../../config/firebase-admin');
const verifyToken = require('../../middleware/auth/verifyToken');
const { uploadLimiter } = require('../../middleware/rateLimits');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image uploads are allowed'));
      return;
    }
    cb(null, true);
  },
});

function getStorageBucket() {
  const bucketName =
    process.env.FIREBASE_STORAGE_BUCKET ||
    `${process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID}.appspot.com`;
  return admin.storage().bucket(bucketName);
}

router.post('/', uploadLimiter, verifyToken, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Image file is required' });
  }

  try {
    const bucket = getStorageBucket();
    const safeName = `${req.auth.uid}/${Date.now()}-${path.basename(req.file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const objectPath = `images/${safeName}`;
    const file = bucket.file(objectPath);

    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype },
    });

    await file.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${objectPath}`;

    res.status(201).json({ url: publicUrl });
  } catch (error) {
    console.error('Image upload failed:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
});

module.exports = router;
