const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

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

exports.getAccount = (req, res) => {
  res.status(200).render('account', { title: 'Your account' });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).render('account', { title: 'Your account', user: updatedUser });
});
