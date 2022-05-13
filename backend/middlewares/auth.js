/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/errorHandler');
const User = require('../models/user');

const isAuthenticate = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return next(new ErrorHandler('please log in', 400));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id) {
            return next(new ErrorHandler('token is not authorized', 400));
        }

        req.user = await User.findById(decoded.id);

        next();
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

module.exports = isAuthenticate;
