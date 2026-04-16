const Product = require('../models/Product');
const Review = require('../models/Review');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

const addReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) throw new ApiError('Product not found', 404);

  const review = await Review.create({
    rating: req.body.rating,
    comment: req.body.comment,
    product: req.params.productId,
    user: req.user._id,
  });

  res.status(201).json({ status: 'success', data: { review } });
});

const getProductReviews = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) throw new ApiError('Product not found', 404);

  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name')
    .sort('-createdAt');

  res.status(200).json({ status: 'success', results: reviews.length, data: { reviews } });
});

const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate('user', 'name')
    .populate('product', 'name')
    .sort('-createdAt');

  res.status(200).json({ status: 'success', results: reviews.length, data: { reviews } });
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) throw new ApiError('Review not found', 404);
  res.status(204).json({ status: 'success', data: null });
});

module.exports = { addReview, getProductReviews, getAllReviews, deleteReview };
