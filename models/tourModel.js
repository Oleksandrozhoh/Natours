const mongoose = require('mongoose');
const slugify = require('slugify');

//creating schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'Tour name length must be less than 40 characters'],
      minlength: [10, 'Tour name length must be at least 10 characters'],
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A trip must have difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: "Not valid difficulty value, choose from: ['easy', 'medium', 'difficult']",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Min rating is 1'],
      max: [5, 'Max rating is 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have image cover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // hiding the field ( for internal use only )
    },
    startDates: [Date],
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// mongoose midleware
// document middleware ( save(), create() will trigger the func )
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('Saving the document...');
//   next();
// });
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// query middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.executionStartedAt = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  this.executionEndedAt = Date.now();
  console.log(`Query execution took: ${this.executionEndedAt - this.executionStartedAt}`);
  console.log(docs);
  next();
});

// aggregation middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
