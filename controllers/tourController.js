const fs = require('fs');
const Tour = require('../models/tourModel')



////////////////////////////////////////
// route middleware

////////////////////////////////////////
// route handlers
exports.getAllTours = async (req, res) => {
  try{
    const allTours = await Tour.find();
    res.status(200).json({
      status: "success",
      data: {
        allTours
      }
    })
  }catch(err){
    res.status(404).json({
      status: 'Bad request',
      message: err.message
    })
  }
  };
  
exports.getTour = async (req, res) => {
  try{
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        tour
      }
    })
  }catch(err){
    res.status(404).json({
      status: 'Bad request',
      message: err.message
    })
  }
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
      status: 'Bad request',
      message: err.message
    })
  }

  };

exports.patchTour = async (req, res) => {
  try{
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
    res.status(200).json({
      status: 'Updated',
      data: {updatedTour}
    })
  }catch(err){
    res.status(400).json({
      status: 'Bad request',
      message: err.message
    })
  }
  
};

exports.deleteTour = (req, res) => {
  // TODO code to update the tour record by id
  res.status(204).json({ status: 'success', data: { tour: null } });
};
