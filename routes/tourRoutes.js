const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

// middleware
router.param('id', tourController.checkId);

////////////////////////////////////////
// routes
router.route('/').get(tourController.getAllTours).post(tourController.checkBody, tourController.postTour);
router.route('/:id').get(tourController.getTour).patch(tourController.patchTour).delete(tourController.deleteTour);

////////////////////////////////////////
// export
module.exports = router;
