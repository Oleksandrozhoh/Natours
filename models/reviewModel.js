const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// review schema static method to calc ratings avg
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRatings,
      ratingsAverage: stats[0].averageRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

/////////////////////////
// caclulating average ratings every time review document created
reviewSchema.post('save', function (document, next) {
  this.constructor.calcAverageRatings(this.tour);
  next();
});
// caclulating average ratings every time review document updated / deleted
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.doc = await this.findOne();
  next();
});
reviewSchema.post(/^findOneAnd/, async function (query, next) {
  await this.doc.constructor.calcAverageRatings(this.doc.tour); // calculating average ratings only after new doc saved to the DB => doing it in post query middleware
  next();
});

//////////////////////////
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name photo' });
  next();
});

const Review = new mongoose.model('Reviews', reviewSchema);

module.exports = Review;
