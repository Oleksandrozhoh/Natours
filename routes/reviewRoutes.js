const express = require('express');
const reviewController = require('../controllers/reviewController');
const authenticationController = require('../controllers/authenticationController');

const router = express.Router({ mergeParams: true });

////////////////////////////////////////
// routes
// user route
router.route('/createReview').post(authenticationController.protect, reviewController.createReview);
router.route('/').get(authenticationController.protect, reviewController.getAllReviews);
router.route('/:tourId').get(authenticationController.protect, reviewController.getTourReviews);

module.exports = router;
