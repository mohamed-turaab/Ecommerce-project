const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

const addToCart = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.body.productId);
  if (!product) throw new ApiError('Product not found', 404);
  
  if (product.countInStock < req.body.quantity) throw new ApiError('Not enough stock', 400);

  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.find((cartItem) => cartItem.product.toString() === product._id.toString());

  if (item) {
    if (product.countInStock < item.quantity + req.body.quantity) {
      throw new ApiError('Not enough stock', 400);
    }
    item.quantity += req.body.quantity;
  } else {
    cart.items.push({
      product: product._id,
      quantity: req.body.quantity,
      price: product.discountPrice || product.price,
    });
  }

  await cart.save();
  await cart.populate('items.product', 'name price discountPrice images countInStock');

  res.status(200).json({ status: 'success', data: { cart } });
});

const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  await cart.populate('items.product', 'name price discountPrice images countInStock');

  const initialLength = cart.items.length;
  cart.items = cart.items.filter((item) => item.product != null);
  if (cart.items.length !== initialLength) {
    await cart.save();
  }

  res.status(200).json({ status: 'success', data: { cart } });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || cart.items.length === 0) throw new ApiError('Cart is empty', 400);

  const item = cart.items.find((cartItem) => cartItem.product.toString() === req.params.productId);
  if (!item) throw new ApiError('Product is not in cart', 404);

  const product = await Product.findById(req.params.productId);
  if (!product) throw new ApiError('Product not found', 404);
  if (product.countInStock < req.body.quantity) throw new ApiError('Not enough stock', 400);

  item.quantity = req.body.quantity;
  item.price = product.discountPrice || product.price;
  await cart.save();
  await cart.populate('items.product', 'name price discountPrice images countInStock');

  res.status(200).json({ status: 'success', data: { cart } });
});

const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { items: { product: req.params.productId } } },
    { new: true }
  ).populate('items.product', 'name price discountPrice images countInStock');

  if (!cart) {
    return res.status(200).json({ status: 'success', data: { cart: { items: [] } } });
  }

  res.status(200).json({ status: 'success', data: { cart } });
});

const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();
  res.status(200).json({ status: 'success', data: { cart } });
});

module.exports = { addToCart, getCart, updateCartItem, removeCartItem, clearCart };
