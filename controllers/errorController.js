const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate fields value: ${value}. Please use a different value.`;
    
    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = err => new AppError('Invalid token. Please login again!', 401);

const handleJWTExpiredError = err => new AppError('Your token has expired! Please login again.', 401);

const sendErrorForDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    // Programming or other unknown error: don't leak error details to the client
    } else {
        // Log error
        console.error('Error', err);

        // Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorForDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);

        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

        if (error.name === 'JsonWebTokenError') error = handleJWTError(error);

        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError(error);

        sendErrorProd(err, res);
    }
};