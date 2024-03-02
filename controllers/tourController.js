const Tour = require('../models/tourModel');

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
  console.log(req.query);
  try {
    // filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);
    // advanced filtering ( ?fieldName[gte]=fieldName )
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // build query
    let query = Tour.find(JSON.parse(queryStr));

    // sorting ( ?sort=fieldName (asc) || ?sort=-filedName (desc) )
    if (req.query.sort) {
      const sortByStr = JSON.stringify(req.query.sort).replace(',', ' ');
      const sortBy = JSON.parse(sortByStr);
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // limiting fields ( ?fields=name, price (show name and price only) || ?fields=-price (do not show price field) )
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v'); // by default excluding __v field
    }

    // pagination
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 10;
    query.skip((page - 1) * limit).limit(Number(limit));
    if (req.query.page) {
      const numbOfTours = await Tour.countDocuments();
      if ((page - 1) * limit >= numbOfTours) {
        throw new Error('This page does NOT exist');
      }
    }

    // executing query
    const allTours = await query;

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
