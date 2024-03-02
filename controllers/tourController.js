const fs = require('fs');
const Tour = require('../models/tourModel')



////////////////////////////////////////
// route middleware

////////////////////////////////////////
// route handlers
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'sucsess',
    requestedAt: req.requestTime,
    // results: tours.length,
    // data: { tours: tours },
  });
};

exports.getTour = (req, res) => {
  const id = Number(req.params.id);
  // res.status(200).json({ status: 'success', data: { tour: tours.find((tour) => tour.id === id) } });
};

exports.createTour = (req, res) => {
  // const newTour = new Tour({});
  // newTour.save();

};

exports.patchTour = (req, res) => {
  // TODO code to update the tour record by id
  res.status(200).json({ status: 'success', data: { tour: '<Updated tour here ...>' } });
};

exports.deleteTour = (req, res) => {
  // TODO code to update the tour record by id
  res.status(204).json({ status: 'success', data: { tour: null } });
};
