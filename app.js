const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

// use pug templates, specifying root location for the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

// serves static files from public folder to clients browser
app.use(express.static(path.join(__dirname, '/public')));

////////////////////////////////////////////////////////////////
// global middleware

// security HTTP headers
const scriptSrcUrls = [
  'https://api.tiles.mapbox.com/',
  'https://api.mapbox.com/',
  'https://cdnjs.cloudflare.com/',
  'ws://127.0.0.1:65431/',
];
const styleSrcUrls = [
  'https://api.mapbox.com/',
  'https://api.tiles.mapbox.com/',
  'https://fonts.googleapis.com/',
  'ws://127.0.0.1:65431/',
];
const connectSrcUrls = [
  'ws://127.0.0.1:65431/',
  'https://api.mapbox.com/',
  'https://a.tiles.mapbox.com/',
  'https://b.tiles.mapbox.com/',
  'https://events.mapbox.com/',
];
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: [],
      imgSrc: ["'self'", 'blob:', 'data:'],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  }),
);

// set the rate limit
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again in 1 hour',
});
app.use('/api', limiter); // will allow 100 req from the same IP in 1 hour

// body parser
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // parse form data

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// data sanitization against XSS (Cross-site scripting attacks)
app.use(xss());

// prevent parameter polution
app.use(hpp({ whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 'maxGroupSize', 'difficulty', 'price'] }));

// dev logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// logging req time, cookies
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.requestTime);
  // console.log(req.cookies);
  next();
});

// routes api
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// affter all defined routes req is still unhandled => catching all req past this point and returning an error
app.all('*', (req, res, next) => {
  next(new AppError(`Route: ${req.originalUrl} is NOT defined`, 404)); // any arg will be recognized by express as an error and will go straight to the err handling middleware
});

// global err handling middleware
app.use(globalErrorHandler);

module.exports = app;
