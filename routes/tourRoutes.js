const express = require('express');
const tourController = require('../controllers/tourController');
const authenticationController = require('../controllers/authenticationController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// middleware

// nested review route
router.use('/:tourId/reviews', reviewRouter);

////////////////////////////////////////
// routes
router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router.route('/').get(authenticationController.protect, tourController.getAllTours).post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.patchTour)
  .delete(
    authenticationController.protect,
    authenticationController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

////////////////////////////////////////
// export
module.exports = router;
