const express = require('express');

const viewsController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');

const router = express.Router();

router.get('/', authController.isLoggedIn, (req, res) => {
    res.status(200).render('homepage');
});

router.get('/overview', bookingController.createBookingCheckout, authController.isLoggedIn, viewsController.getOverview);

router.get('/overview/tour/:slug', authController.isLoggedIn, viewsController.getTour);

router.get('/overview/login', authController.isLoggedIn, viewsController.getLoginForm);

router.get('/overview/signup', authController.isLoggedIn, viewsController.getSignUpForm)

router.get('/overview/me', authController.protect, viewsController.getAccount);

router.get('/my-tours', authController.protect, viewsController.getAccount);

router.get('/manage-bookings', authController.protect, viewsController.getAdminAccount);

router.get('/manage-tours', authController.protect, viewsController.getAdminAccount);

router.get('/manage-users', authController.protect, viewsController.getAdminAccount);

router.get('/billing', authController.protect, viewsController.getAccount);

router.post('/submit-user-data', authController.protect, viewsController.updateUserData);

module.exports = router;