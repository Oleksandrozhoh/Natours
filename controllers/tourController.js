const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

////////////////////////////////////////
// route handlers
exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.patchTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

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

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng)
    return next(new AppError('Please provide latitude and langitude in the correct format: lat,lng', 400));

  // console.log(lat, lng, distance, unit);
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  const tours = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});
