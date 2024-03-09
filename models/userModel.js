const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A user name must be specified'],
      trim: true,
      maxlength: [40, 'User name length must be less than 40 characters'],
      minlength: [10, 'User name length must be at least 10 characters'],
    },
    email: {
      type: String,
      required: [true, 'A user must have an email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: {
      type: String,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [10, 'User name length must be at least 10 characters'],
    },
    passwordConfirm: {
      type: String,
      required: [true, 'PLease confirm a password'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const User = new mongoose.Model('User', userSchema);

module.exports = User;
