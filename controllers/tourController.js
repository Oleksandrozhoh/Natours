const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

////////////////////////////////////////
// route handlers

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query);
  features.filter().sort().limitFields().paginate();
  const allTours = await features.query;

  res.status(200).json({
    status: 'success',
    results: allTours.length,
    data: {
      allTours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError('No tour found with this Id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'created',
    data: {
      tour: newTour,
    },
  });
});

exports.patchTour = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!updatedTour) {
    return next(new AppError('No tour found with this Id', 404));
  }
  res.status(200).json({
    status: 'Updated',
    data: { updatedTour },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const deletedTour = await Tour.findByIdAndDelete(req.params.id);
  if (!deletedTour) {
    return next(new AppError('No tour found with this Id', 404));
  }

  // Check if deletedTour is null (meaning no document was found)
  if (!deletedTour) {
    return res.status(404).json({
      status: 'fail',
      message: 'No tour found with that ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }, // select only ratings 4.5 and up
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' }, // group by difficulty
        averageRating: { $avg: '$ratingsAverage' },
        numberOfRatings: { $count: {} },
        averagePrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { averagePrice: 1 },
    },
    //{
    // $match: { _id: { $ne: 'EASY' } }, // excluding easy
    //},
  ]);
  res.status(200).json({
    status: 'Updated',
    results: stats.length,
    data: { stats },
  });
});

exports.getMonthlyPlan = async (req, res, next) => {
  const year = Number(req.params.year);

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01T12:00:00`),
          $lte: new Date(`${year}-12-31T12:00:00`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numOfTours: { $count: {} },
        tours: { $push: '$name' }, // agregate grouped tour names into an array
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numOfTours: -1 },
    },
    {
      $limit: 12, // limiting the number of results
    },
  ]);

  res.status(200).json({
    status: 'Updated',
    results: plan.length,
    data: { plan },
  });
};
