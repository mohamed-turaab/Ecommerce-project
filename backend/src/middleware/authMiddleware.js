const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; 
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt; 
  }

  if (!token) {
    throw new ApiError('You are not logged in', 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id).select('+passwordChangedAt');
  if (!currentUser) {
    throw new ApiError('The user belonging to this token no longer exists', 401);
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    throw new ApiError('Password changed recently. Please log in again', 401);
  }

  req.user = currentUser;
  next();
});

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ApiError('You do not have permission to perform this action', 403));
  }
  next();
};

module.exports = { protect, authorize };
