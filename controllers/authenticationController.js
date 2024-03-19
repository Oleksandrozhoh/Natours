const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { appendFile } = require('fs');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const createTocken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const createSendTocken = (user, statusCode, res) => {
  const token = createTocken(user._id);

  // add jwt as a cookie
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true; // if prod env use https only
  res.cookie('jwt', token, cookieOptions);

  // remove password before sending user data as output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token: token,
    data: { user: user },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  createSendTocken(newUser, 201, res);
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
  createSendTocken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // get the jwt token and check if it exist
  let token = '';
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return next(new AppError('You are not logged in, please log in to get access.', 401));

  // verification token ( check if the token payload wasnt manipulated )
  const tokenData = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user still exists
  const currentUser = await User.findById(tokenData.id);
  if (!currentUser) return next(new AppError('The user belonging to provided token is no longer exist', 401));

  // check if user changed password after jwt was issued
  if (currentUser.changePasswordAfter(tokenData.iat))
    return next(new AppError('Authentication failed due to password change, please log in again'));

  // proceed to the next middleware (Grant access to protected route)
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Not authorized, your role does not have an access to this resource', 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError('There is no user with provided email address'));

  // generate random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // send it back as an email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to ${resetURL}. \nIf you didn't forget your password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token ( valid for 10 mins )',
      message: message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token send to your email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was an error sending the emial. Try again later!'), 500);
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // get user based on token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

  // if token is not expired and there is a user => set new password
  if (!user) {
    return next(new AppError('Token is invalid or expired'), 400);
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // update changedPasswordAt property

  // if everything is ok, send jwt back to the client
  createSendTocken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // check if posted password is correct
  if (!(await user.correctPassword(req.body.password, user.password)))
    return next(new AppError('Provided current password is not correct, please provide valid password'));

  // update the password
  user.password = req.body.passwordUpdate;
  user.passwordConfirm = req.body.passwordUpdateConfirm;
  await user.save();

  // log the user in (send JWT back to user)
  createSendTocken(user, 200, res);
});
