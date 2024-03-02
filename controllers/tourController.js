const fs = require('fs');
const Tour = require('../models/tourModel')



////////////////////////////////////////
// route middleware

////////////////////////////////////////
// route handlers
exports.getAllTours = async (req, res) => {
  const allTours = await Tour.find();
  res.status(200).json({
    status: "success",
    data: allTours
  })
};

exports.getTour = (req, res) => {
  const id = Number(req.params.id);
  // res.status(200).json({ status: 'success', data: { tour: tours.find((tour) => tour.id === id) } });
};

exports.createTour = async (req, res) => {
  try{
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'created',
      data:{
        tour:newTour
      }
    })
  }catch(err){
    res.status(400).json({
      status: 'fail',
      message: err.message
    })
  }

  };

exports.patchTour = (req, res) => {
  // TODO code to update the tour record by id
  res.status(200).json({ status: 'success', data: { tour: '<Updated tour here ...>' } });
};

exports.deleteTour = (req, res) => {
  // TODO code to update the tour record by id
  res.status(204).json({ status: 'success', data: { tour: null } });
};
