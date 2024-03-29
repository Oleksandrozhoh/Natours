const express = require('express');
const reviewController = require('../controllers/reviewController');
const authenticationController = require('../controllers/authenticationController');

const router = express.Router({ mergeParams: true });

////////////////////////////////////////
// routes

// protect all routes from unauthorized users
router.use(authenticationController.protect);

router.route('/createReview').post(
  // authenticationController.protect,
  authenticationController.restrictTo('user'),
  reviewController.setTourAndUserIds,
  reviewController.createReview,
);
router.route('/').get(reviewController.getAllReviews);
router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(authenticationController.restrictTo('user', 'admin'), reviewController.deleteReview)
  .patch(authenticationController.restrictTo('user', 'admin'), reviewController.updateReview);

module.exports = router;
