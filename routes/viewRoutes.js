const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

////////////////////////////////////////////////////////////////
// routes pug
router.get('/', viewController.getOverview);
router.get('/tour/:slug', viewController.getTourview);

module.exports = router;