const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const deletedDoc = await Model.findByIdAndDelete(req.params.id);
    if (!deletedDoc) return next(new AppError('No document found with that ID', 404));
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedDoc) {
      return next(new AppError('No document found with this Id', 404));
    }
    res.status(200).json({
      status: 'Updated',
      data: { updatedDoc },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const createdDoc = await Model.create(req.body);
    res.status(201).json({
      status: 'created',
      data: createdDoc,
    });
  });
