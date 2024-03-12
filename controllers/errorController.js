const AppError = require('../utils/appError');

/////////////////////////////////////////////
// error helper functions
const sendErrorDev = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (res, err) => {
  // opperational error that we understand
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // unknown error
  } else {
    // logging error
    console.log('Error 😮😮😮 :', err);
    // send generic message for the client
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

const handleCastErrorDB = (err) => {
  const errorMessage = `'${err.value}' is NOT a valid value for '${err.path}' parameter`;
  return new AppError(errorMessage, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const string = err.keyValue.name;
  const errorMessage = `Duplicate field value: '${string}', please use another value`;
  return new AppError(errorMessage, 400);
};

const handleValidationErrors = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const errorMessage = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(errorMessage, 400);
};

const handleJWTErrors = () => {
  const errorMessage = `Invalid authentication token. Please log in again`;
  return new AppError(errorMessage, 401);
};

const handleExpiredTokenErrors = () => {
  const errorMessage = `Expired authentication token. Please log in again`;
  return new AppError(errorMessage, 401);
};

/////////////////////////////////////
// global error handling function
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(res, err);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrors(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTErrors();
    if (err.name === 'TokenExpiredError') error = handleExpiredTokenErrors();
    sendErrorProd(res, error);
  }
};
