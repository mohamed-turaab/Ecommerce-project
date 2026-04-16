const User = require('../models/User');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ status: 'success', data: { user: req.user } });
});

const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true });
  res.status(200).json({ status: 'success', data: { user } });
});

const deleteMe = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  res.clearCookie('jwt');
  res.status(204).json({ status: 'success', data: null });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort('-createdAt');
  res.status(200).json({ status: 'success', results: users.length, data: { users } });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError('User not found', 404);
  res.status(204).json({ status: 'success', data: null });
});

module.exports = { getMe, updateMe, deleteMe, getAllUsers, deleteUser };
