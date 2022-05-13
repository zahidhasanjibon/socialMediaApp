/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCodde || 500;
    err.message = err.message || 'internal server error';

    res.status(err.statusCode).json({
        success: false,
        error: err.message,
    });
};
