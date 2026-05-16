const AppError = require('./appError');

const notFoundHandler = (req, res, next) => {
  next(new AppError('Route not found', 404, 'NOT_FOUND'));
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';

  res.status(status).json({
    success: false,
    message: err.message || 'Something went wrong',
    code
  });
};

module.exports = { notFoundHandler, errorHandler };
