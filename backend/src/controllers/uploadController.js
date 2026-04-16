const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

const uploadToCloudinary = (fileBuffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'ecommerce-products', resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError('Please upload an image', 400);

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new ApiError('Cloudinary environment variables are not configured', 500);
  }

  const result = await uploadToCloudinary(req.file.buffer);

  res.status(201).json({
    status: 'success',
    data: { image: { url: result.secure_url, publicId: result.public_id } },
  });
});

module.exports = { uploadImage };
