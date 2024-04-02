const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // get tour data from collection
  const tours = await Tour.find();

  // build template
  // render that template using tour data
  res.status(200).render('overview', { title: 'All tours', tours });
});

exports.getTourview = catchAsync(async (req, res, next) => {
  // get tour data
  const tour = (
    await Tour.find({ slug: req.params.slug }).populate({ path: 'reviews', fields: 'review rating user' })
  )[0];

  if (!tour) return next(new AppError('There is no tour with that name', 404));

  // build template
  // render that template using tour data
  res.status(200).render('tour', { title: `${tour.name} tour`, tour });
});

exports.getLoginForm = (req, res) => {
  // build template
  // render that template using tour data
  res.status(200).render('login', { title: 'Log into your account' });
};
