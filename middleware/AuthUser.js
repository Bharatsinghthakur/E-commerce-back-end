const jwt = require("jsonwebtoken");
const catchAsyncError = require("./catchAsyncError");
const User = require("../models/UserModel");
const ErrorHandler = require("../utils/ErrorHandler");

exports.isAuthenticatedUser = catchAsyncError(
    async (req, res, next) => {
        const { token } = req.cookies; // as we know we have token but we can use destructing 

        if (!token) {
            return next(new ErrorHandler("Please login to access this resource",401));
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.user = await User.findById(decodedData.id);
        next();

    }
)

// arguments are params
exports.authorizeRoles = (...roles) => {
    return (req, res,next) => {

        if (!roles.includes(req.user.role)) {
            return next(
            new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resources`)
            ,403
            )
        }
        next();

    };
}