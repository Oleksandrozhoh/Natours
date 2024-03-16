const crypto = require('crypto');
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
    role: {
      type: String,
      enum: ['user', 'guide', 'lead-gude', 'admin'],
      default: 'user',
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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000; // substracting 1s to avoid any issues because DB save have some latency
  next();
});

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

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const passwordChangedTime = Math.floor(new Date(this.passwordChangedAt).getTime() / 1000);
    return JWTTimestamp < passwordChangedTime;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  console.log({ resetToken });
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  console.log(this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  console.log(this.passwordResetExpires);
  return resetToken;
};

const User = new mongoose.model('User', userSchema);

module.exports = User;
