const factory = require('./HandlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
/////

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) newObj[key] = obj[key];
  });
  return newObj;
};

////////////////////////////////////////
// route handlers
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // create error if user updating passowrd
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError('This route is NOT for password updates. Please use /updateMyPassword', 400));
  // filltered out unwanted fields that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  // update document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });

  res.status(200).json({
    status: 'success',
    data: { updatedUser },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'This route is NOT defined yet' });
};
exports.getUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'This route is NOT defined yet' });
};
exports.updateUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'This route is NOT defined yet' });
};
exports.deleteUser = factory.deleteOne(User);
