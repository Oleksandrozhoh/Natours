const express = require('express');
const reviewController = require('../controllers/reviewController');
const authenticationController = require('../controllers/authenticationController');

const router = express.Router({ mergeParams: true });

////////////////////////////////////////
// routes
// user route
router
  .route('/createReview')
  .post(
    authenticationController.protect,
    authenticationController.restrictTo('user'),
    reviewController.setTourAndUserIds,
    reviewController.createReview,
  );
router.route('/').get(authenticationController.protect, reviewController.getAllReviews);
router
  .route('/:id')
  .delete(authenticationController.protect, reviewController.deleteReview)
  .patch(authenticationController.protect, reviewController.updateReview);

module.exports = router;
