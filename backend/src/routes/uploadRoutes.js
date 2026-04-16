const express = require('express');
const uploadController = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post(
  '/image',
  protect,
  authorize('admin'),
  upload.single('image'),
  uploadController.uploadImage
);

module.exports = router;
