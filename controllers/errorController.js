const AppError = require('../utils/appError');

/////////////////////////////////////////////
// error helper functions
const sendErrorDev = (req, res, err) => {
  // API response
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // BROWSER response
  console.log('Error 😮😮😮 :', err);
  return res.status(err.statusCode).render('error', { title: 'Something went wrong!', msg: err.message });
};

const sendErrorProd = (req, res, err) => {
  // API response
  if (req.originalUrl.startsWith('/api')) {
    // opperational - trusted error
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // unknown error
    console.log('Error 😮😮😮 :', err);
    // send generic message for the client
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }

  // BROWSER response
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', { title: 'Something went wrong!', msg: err.message });
  }
  return res.status(err.statusCode).render('error', { title: 'Something went wrong!', msg: 'Please try again later' });
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
    sendErrorDev(req, res, err);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrors(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTErrors();
    if (err.name === 'TokenExpiredError') error = handleExpiredTokenErrors();
    sendErrorProd(req, res, error);
  }
};
