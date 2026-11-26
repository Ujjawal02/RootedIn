const cloudinary = require('../config/cloudinary');

module.exports.uploadImage = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            folder: `rootedin/${folder}`, 
            resource_type: "image"
        },
        (error, result) =>{
            if(error){
                console.log("Cloudinary response:", error.response);
                console.log("Cloudinary headers:", error.http_headers);
                return reject(error);
            }
            resolve({url: result.secure_url, public_id: result.public_id});
        }
    );
    stream.end(buffer);
    })
}

module.exports.deleteImage = async (publicId) =>{
    if(!publicId){
        return;
    }
    await cloudinary.uploader.destroy(publicId);
}