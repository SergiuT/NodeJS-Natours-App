const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
    // 1.Get tour data from collection
    const tours = await Tour.find();

    // 2.Build template

    // 3.Render template using data
    res.status(200).render('overview', {
        title: 'All tours',
        tours
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    // 1.Get the data for the requested tour
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });
    const bookings = await Booking.find();

    if (!tour) {
        return next(new AppError('There is no tour with that name.', 404));
    }

    // 2.Built the template

    // 3.Render the data
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour,
        bookings
    });
});

exports.getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: 'Log into your account'
    });
};

exports.getSignUpForm = (req, res) => {
    res.status(200).render('signup', {
        title: 'Sign Up'
    })
}

exports.getAccount = catchAsync(async (req, res) => {
    const route = req.route.path;
    const bookings = await Booking.find({
        user: req.user.id
    });
    const tourIDs = bookings.map(el => el.tour.id);
    const tours = await Tour.find({ _id: { $in: tourIDs } });

    res.status(200).render('account', {
        title: 'Your account',
        route,
        tours
    });
});

exports.getAdminAccount = catchAsync(async (req, res, next) => {
    let userData = {
        route: req.route.path,
        bookings: await Booking.find(),
        tours: await Tour.find(),
        users: await User.find()
    }

    res.status(200).render('account', {
        title: 'Your account',
        userData
    })
});

exports.deleteTour = catchAsync(async (req, res, next) => {
    const document = await Tour.findByIdAndDelete(req.params.id);

    if (!document) {
        return next(new AppError('No document found with this ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
})

exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            email: req.body.email
        },
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).render('account', {
        title: 'Your account',
        user: updatedUser
    });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
    // 1.Find all bookings
    const bookings = await Booking.find({
        user: req.user.id
    });

    // 2.Find tours with the returned id's
    const tourIDs = bookings.map(el => el.tour.id);
    const tours = await Tour.find({ _id: { $in: tourIDs } });

    res.status(200).render('overview', {
        title: 'My Tours',
        tours
    });
});