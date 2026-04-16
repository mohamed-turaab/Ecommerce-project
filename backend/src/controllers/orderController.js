const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

const calcPrices = (items) => {
  const itemsPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const taxPrice = Number((itemsPrice * 0.05).toFixed(2));
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const totalPrice = Number((itemsPrice + taxPrice + shippingPrice).toFixed(2));
  return { itemsPrice, taxPrice, shippingPrice, totalPrice };
};

const createOrder = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) throw new ApiError('Cart is empty', 400);

  for (const item of cart.items) {
    if (!item.product) throw new ApiError('A product in your cart no longer exists', 404);
    if (item.product.countInStock < item.quantity) {
      throw new ApiError(`${item.product.name} does not have enough stock`, 400);
    }
  }

  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    quantity: item.quantity,
    image: item.product.images?.[0]?.url,
    price: item.price,
  }));

  const prices = calcPrices(cart.items);
  
  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod,
    ...prices,
  });

  await Promise.all(
    cart.items.map((item) =>
      Product.findByIdAndUpdate(item.product._id, { $inc: { countInStock: -item.quantity } })
    )
  );

  cart.items = [];
  await cart.save();

  res.status(201).json({ status: 'success', data: { order } });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
});

const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) throw new ApiError('Order not found', 404);

  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError('You cannot access this order', 403);
  }

  res.status(200).json({ status: 'success', data: { order } });
});

const markOrderPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError('Order not found', 404);

  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError('You cannot update this order', 403);
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  await order.save();

  res.status(200).json({ status: 'success', data: { order } });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
  res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
});

const markOrderDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError('Order not found', 404);

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  await order.save();

  res.status(200).json({ status: 'success', data: { order } });
});

module.exports = { createOrder, getMyOrders, getOrder, markOrderPaid, getAllOrders, markOrderDelivered };
