const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');
const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');

/////////////////////////////////////////
// review route handlers
exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews: reviews,
    },
  });
});

exports.getTourReviews = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ _id: req.params.tourId });
  if (!tour) return next(new AppError('Invalid tour Id'), 400);
  const reviews = await Review.find({ tour: req.params.tourId });
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews: reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;

  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});
