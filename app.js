const express = require('express');
const morgan = require('morgan');
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
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

module.exports = app;
