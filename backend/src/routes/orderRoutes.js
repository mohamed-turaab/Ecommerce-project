const express = require('express');
const orderController = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { createOrderSchema } = require('../validations/orderValidation');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(authorize('admin'), orderController.getAllOrders)
  .post(validate(createOrderSchema), orderController.createOrder);

router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrder);
router.patch('/:id/pay', orderController.markOrderPaid);
router.patch('/:id/deliver', authorize('admin'), orderController.markOrderDelivered);

module.exports = router;
