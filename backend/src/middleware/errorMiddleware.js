const ApiError = require('../utils/apiError');

const notFound = (req, res, next) => {
  next(new ApiError(`Route not found: ${req.originalUrl}`, 404));
};

const handleCastErrorDB = () => new ApiError('Resource not found', 404);

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue || {})[0] || 'field';
  return new ApiError(`${field} already exists`, 400);
};

const handleValidationErrorDB = (err) => {
  const message = Object.values(err.errors)
    .map((val) => val.message)
    .join('. ');
  return new ApiError(message, 400);
};

const handleJWTError = () => new ApiError('Invalid token. Please log in again', 401);
const handleJWTExpiredError = () => new ApiError('Token expired. Please log in again', 401);

const errorHandler = (err, req, res, next) => {
  let error = err;
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (err.name === 'CastError') error = handleCastErrorDB();
  if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  if (error.statusCode === 401) {
    console.warn(`[AUTH] ${req.method} ${req.originalUrl} - Unauthorized (No valid session)`);
  } else {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} - ${error.statusCode}: ${error.message}`);
    if (error.statusCode === 500) {
      console.error(err.stack);
    }
  }

  res.status(error.statusCode || 500).json({
    status: error.status || 'error',
    message: error.isOperational ? error.message : 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
