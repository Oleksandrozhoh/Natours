const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

////////////////////////////////////////////////////////////////
// middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

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
