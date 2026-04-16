const express = require('express');
const productController = require('../controllers/productController');
const userController = require('../controllers/userController');
const reviewController = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { productSchema, updateProductSchema } = require('../validations/productValidation');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.route('/users').get(userController.getAllUsers);
router.route('/users/:id').delete(userController.deleteUser);

router.route('/reviews').get(reviewController.getAllReviews);
router.route('/reviews/:id').delete(reviewController.deleteReview);

router
  .route('/products')
  .get(productController.getProducts)
  .post(validate(productSchema), productController.createProduct);

router
  .route('/products/:id')
  .patch(validate(updateProductSchema), productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
