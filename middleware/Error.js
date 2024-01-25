const ErrorHandler = require("../utils/ErrorHandler");

module.exports = function ErrorMiddleWare(error, request, response, next) {
    error.status = error.status || 500;
    error.message = error.message || "Internal Server Issue";
    
    // wrong MongoDb ID Error 
    if (error.name === "CastError") {
        const message = `Resources not Found. Invalid: ${error.path}`;
        error = new ErrorHandler(message, 400)
    }

    // moongoose dublicate key error
    if (error.code === 11000) {
        const message = `Duplicate ${Object.keys(error.keyValue)} Entered`;
        error = new ErrorHandler(message, 400);
    }

    // Wrong JWT error
    if (error.name === "JsonWebTokenError") {
        const message = "Json web Token is invalid";
        error = new ErrorHandler(message, 400);
    }
    if (error.name === "TokenExpireError") {
        const message = "Json web Token is Expired, Try again";
        error = new ErrorHandler(message, 400);
    }

    response.status(error.status).json({
        success: false,
        error: error.message
    })
}