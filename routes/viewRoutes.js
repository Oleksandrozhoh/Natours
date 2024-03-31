const express = require('express');
const viewController = require('../controllers/viewController');
const authenticationController = require('../controllers/authenticationController');

const router = express.Router();

////////////////////////////////////////////////////////////////
// routes pug
router.get('/', viewController.getOverview);
router.get('/tour/:slug', authenticationController.protect, viewController.getTourview);

router.get('/login', viewController.getLoginForm);

module.exports = router;
