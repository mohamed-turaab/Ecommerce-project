const Product = require('../models/Product');
const Review = require('../models/Review');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const QueryFeatures = require('../utils/queryFeatures');

const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ status: 'success', data: { product } });
});

const getProducts = asyncHandler(async (req, res) => {
  const countFeatures = new QueryFeatures(Product.find(), req.query).search().filter();
  const total = await Product.countDocuments(countFeatures.query.getFilter());

  const features = new QueryFeatures(Product.find(), req.query).search().filter().sort().limitFields().paginate();
  const products = await features.query;

  res.status(200).json({
    status: 'success',
    results: products.length,
    pagination: { ...features.pagination, total, pages: Math.ceil(total / features.pagination.limit) },
    data: { products },
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError('Product not found', 404);
  res.status(200).json({ status: 'success', data: { product } });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) throw new ApiError('Product not found', 404);
  res.status(200).json({ status: 'success', data: { product } });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError('Product not found', 404);
  await Review.deleteMany({ product: req.params.id });
  res.status(204).json({ status: 'success', data: null });
});

module.exports = { createProduct, getProducts, getProduct, updateProduct, deleteProduct };
