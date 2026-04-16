const crypto = require('crypto');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const { sendTokenResponse } = require('../utils/jwt');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError('Email already exists', 400);

  const user = await User.create({ name, email, password });
  sendTokenResponse(user, 201, res);
});

const authenticateUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new ApiError('Incorrect email or password', 401);
  }
  return user;
};

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await authenticateUser(email, password);
  sendTokenResponse(user, 200, res);
});

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await authenticateUser(email, password);
  if (user.role !== 'admin') throw new ApiError('This account is not an admin', 403);
  sendTokenResponse(user, 200, res);
});

const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};

const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new ApiError('No user found with that email', 404);

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ status: 'success', message: 'Password reset token generated.', resetToken });
});

const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });
  if (!user) throw new ApiError('Token is invalid or has expired', 400);

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

module.exports = { register, login, adminLogin, logout, forgotPassword, resetPassword };
