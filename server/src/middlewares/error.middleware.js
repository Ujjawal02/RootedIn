const ApiError = require('../utils/ApiError');
const multer = require("multer");

const errorHandler = (err, req, res, next) =>{
    if(err instanceof ApiError){
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
        });
    }

    if (err instanceof multer.MulterError) {
        const message = err.code === "LIMIT_FILE_SIZE" ? "Image must be 5 MB or smaller" : err.message;
        return res.status(400).json({ success: false, message });
    }

    console.log("Unhandled Error:", err);

    return res.status(500).json({
        success: false,
        message: "Internal Server error",
    });
};

module.exports = errorHandler;