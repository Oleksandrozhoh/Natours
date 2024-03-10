const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

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
exports.createUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'This route is NOT defined yet' });
};
exports.getUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'This route is NOT defined yet' });
};
exports.updateUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'This route is NOT defined yet' });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'This route is NOT defined yet' });
};
