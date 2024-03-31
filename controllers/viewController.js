const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

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
  console.log(tour);
  // build template
  // render that template using tour data
  res.status(200).render('tour', { title: `${tour.name} tour`, tour });
});

exports.getLoginForm = (req, res) => {
  // build template
  // render that template using tour data
  res.status(200).render('login', { title: 'Log into your account' });
};
