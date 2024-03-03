const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

// middleware

////////////////////////////////////////
// routes
router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/').get(tourController.getAllTours).post(tourController.createTour);
router.route('/:id').get(tourController.getTour).patch(tourController.patchTour).delete(tourController.deleteTour);

////////////////////////////////////////
// export
module.exports = router;
