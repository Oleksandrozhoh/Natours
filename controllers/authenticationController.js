const { promisify } = require('util');
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
    passwordChangedAt: req.body.passwordChangedAt,
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

exports.protect = catchAsync(async (req, res, next) => {
  // get the jwt token and check if it exist
  let token = '';
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return next(new AppError('You are not logged in, please log in to get access.', 401));

  // verification token
  const tokenData = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user still exists
  const freshUser = await User.findById(tokenData.id);
  if (!freshUser) return next(new AppError('The user belonging to provided token is no longer exist', 401));

  // check if user changed password after jwt was issued
  if (freshUser.changePasswordAfter(tokenData.iat))
    return next(new AppError('Authentication failed due to password change, please log in again'));

  // proceed to the next middleware (Grant access to protected route)
  req.user = freshUser;
  next();
});
