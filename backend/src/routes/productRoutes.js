const express = require('express');
const productController = require('../controllers/productController');
const reviewController = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { productSchema, updateProductSchema, reviewSchema } = require('../validations/productValidation');

const router = express.Router();

router
  .route('/')
  .get(productController.getProducts)
  .post(protect, authorize('admin'), validate(productSchema), productController.createProduct);

router
  .route('/:productId/reviews')
  .get(reviewController.getProductReviews)
  .post(protect, validate(reviewSchema), reviewController.addReview);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(protect, authorize('admin'), validate(updateProductSchema), productController.updateProduct)
  .delete(protect, authorize('admin'), productController.deleteProduct);

module.exports = router;
