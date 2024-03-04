const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

////////////////////////////////////////
// route handlers

exports.aliasTopTours = (req, res, next) => {
  console.log(req.query);
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // executing query
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
  } catch (err) {
    res.status(404).json({
      status: 'Bad request',
      message: err.message,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Bad request',
      message: err.message,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'created',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Bad request',
      message: err.message,
    });
  }
};

exports.patchTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({
      status: 'Updated',
      data: { updatedTour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Bad request',
      message: err.message,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);

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
  } catch (err) {
    res.status(400).json({
      status: 'Bad request',
      message: err.message,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'Bad request',
      message: err.message,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'Bad request',
      message: err.message,
    });
  }
};
