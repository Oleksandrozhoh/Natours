const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A user name must be specified'],
      trim: true,
      maxlength: [40, 'User name length must be less than 40 characters'],
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
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'PLease confirm a password'],
      validate: {
        // only workds for create or save requests
        validator: function (el) {
          return this.password === el;
        },
        message: 'Passwords do not match',
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// instance method will be avaliable on all the documents from the collection
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = new mongoose.model('User', userSchema);

module.exports = User;
