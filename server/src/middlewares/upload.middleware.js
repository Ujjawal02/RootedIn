const multer = require("multer");
const ApiError = require("../utils/ApiError");

const ALLOWED_TYPE = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; //5 MB

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {fileSize: MAX_SIZE},
    fileFilter: (req, file, cb) =>{
        console.log("Received MIME type:", file.mimetype);
        if(!ALLOWED_TYPE.includes(file.mimetype)){
            return cb(new ApiError(400, "Only JPEG, PNG or WebP images are allowed"));
        }
        cb(null, true);
    }
})

module.exports = upload;