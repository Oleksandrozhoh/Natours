const express = require('express');
const userController = require('../controllers/userController');
const authenticationController = require('../controllers/authenticationController');

const router = express.Router();

////////////////////////////////////////
// routes
// user route
router.route('/signup').post(authenticationController.signup);
router.route('/login').post(authenticationController.login);
router.route('/forgotPassword').post(authenticationController.forgotPassword);
router.route('/resetPassword/:token').patch(authenticationController.resetPassword);
router.route('/updateMyPassword').patch(authenticationController.protect, authenticationController.updatePassword);
router.route('/updateMe').patch(authenticationController.protect, userController.updateMe);
// admin route
router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

////////////////////////////////////////
// export
module.exports = router;
