const globalErrorHandler = async (err, req, res, next) => {

    if (err.name === 'ValidationError' || err.name === 'MongoServerError' && err.code === 11000) {
        const shortError = err.name === 'ValidationError'
            ? Object.values(err.errors).map(e => e.message)
            : ['A record with this value already exists'];

        return res.status(400).json({
            success: false,
            message: "Validation Error",
            errors: shortError
        });
    }

    const statusCode = err.statusCode || 500;

    return res
        .status(statusCode)
        .json({
            success: false,
            data: null,
            message: err.message || "Internal server error",
            errors: err.errors || []
        })
}

module.exports = {globalErrorHandler}