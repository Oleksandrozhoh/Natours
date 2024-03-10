const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const createTocken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = createTocken(newUser._id);

  res.status(201).json({
    status: 'success',
    token: token,
    data: { user: newUser },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // if email and password provided
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // check if user exist and password correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Email or password is incorrect'));

  // if everything is ok, send jwt back to the client
  const token = createTocken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
