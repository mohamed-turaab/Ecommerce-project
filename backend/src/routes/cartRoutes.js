const express = require('express');
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { addCartItemSchema, updateCartItemSchema } = require('../validations/cartValidation');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(cartController.getCart)
  .post(validate(addCartItemSchema), cartController.addToCart)
  .delete(cartController.clearCart);

router
  .route('/:productId')
  .patch(validate(updateCartItemSchema), cartController.updateCartItem)
  .delete(cartController.removeCartItem);

module.exports = router;
