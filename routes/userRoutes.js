const express = require('express');
const userController = require('../controllers/userController');
const authenticationController = require('../controllers/authenticationController');

const router = express.Router();

////////////////////////////////////////
// routes
// user route
router.route('/signup').post(authenticationController.signup);
router.route('/login').post(authenticationController.login);
router.route('/logout').get(authenticationController.logout);
router.route('/forgotPassword').post(authenticationController.forgotPassword);
router.route('/resetPassword/:token').patch(authenticationController.resetPassword);
router.route('/updateMyPassword').patch(authenticationController.protect, authenticationController.updatePassword);

// protect every route below from unauthenticated users
router.route(authenticationController.protect);

router.route('/updateMe').patch(userController.updateMe);
router.route('/deleteMe').delete(userController.deleteMe);
router.route('/me').get(userController.getMe, userController.getUser);

// restrict every route below to everyone but admin
router.route(authenticationController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

////////////////////////////////////////
// export
module.exports = router;
