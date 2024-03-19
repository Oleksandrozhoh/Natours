const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

////////////////////////////////////////////////////////////////
// global middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// set the rate limit
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again in 1 hour',
});
app.use('/api', limiter); // will allow 100 req from the same IP in 1 hour

// will parse req body
app.use(express.json());
// serves static files from public folder to clients browser
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime);
  next();
});

////////////////////////////////////////////////////////////////
// routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// affter all defined routes req is still unhandled => catching all req past this point and returning an error
app.all('*', (req, res, next) => {
  next(new AppError(`Route: ${req.originalUrl} is NOT defined`, 404)); // any arg will be recognized by express as an error and will go straight to the err handling middleware
});

// global err handling middleware
app.use(globalErrorHandler);

module.exports = app;
