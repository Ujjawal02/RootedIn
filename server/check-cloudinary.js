require("dotenv").config();
const path = require("path");
const cloudinary = require("./src/config/cloudinary");

console.log("cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("key length:", process.env.CLOUDINARY_API_KEY?.length);
console.log("secret length:", process.env.CLOUDINARY_API_SECRET?.length);

cloudinary.api
    .ping()
    .then((result) => console.log("ping:", result))
    .catch((error) => console.log("ping failed:", error));

// const cloudinary = require("./src/config/cloudinary");

// async function checkUpload() {
//     try {
//         const result = await cloudinary.uploader.upload(
//             "https://res.cloudinary.com/demo/image/upload/sample.jpg",
//             {
//                 folder: "rootedin/test"
//             }
//         );

//         console.log("Upload successful:", result.secure_url);

//     } catch (error) {
//         console.log("Upload failed:", error);
//     }
// }

// checkUpload();


async function checkUpload2() {
  try {
    const result = await cloudinary.uploader.upload(
      path.join(__dirname, "test.png"),
      { folder: "rootedin/test" }
    );

    console.log("Upload successful:", result.secure_url);
  } catch (error) {
    // console.log("Error name:", error.name);
    // console.log("Error message:", error.message);
    // console.log("HTTP code:", error.http_code);
    // console.log("Response:", error.response);
    // console.log("Error properties:", Object.getOwnPropertyNames(error));
    console.dir(error, { depth: 5 });
}
}
checkUpload2();

