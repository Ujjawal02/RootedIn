const mongoose = require('mongoose')

const connectDB = async () =>{
    const dbUrl = process.env.DBURL;

    if (!dbUrl) {
        console.error("DBURL is not defined in environment variables");
        process.exit(1);
    }
    
    try {
        await mongoose.connect(dbUrl);
        console.log("Connected to Database");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;