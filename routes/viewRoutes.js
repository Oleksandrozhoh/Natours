const express = require('express');
const viewController = require('../controllers/viewController');
const authenticationController = require('../controllers/authenticationController');

const router = express.Router();

////////////////////////////////////////////////////////////////
// routes pug
router.get('/', authenticationController.isLoggedIn, viewController.getOverview);
router.get('/login', authenticationController.isLoggedIn, viewController.getLoginForm);
router.get('/tour/:slug', authenticationController.protect, viewController.getTourview);
router.get('/me', authenticationController.protect, viewController.getAccount);

module.exports = router;
