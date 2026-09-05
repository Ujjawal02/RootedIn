require("dotenv").config({ path: ".env" });

const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 3000;

connectDB().then(() =>{
    app.listen(PORT, () => {
        console.log(`RootedIn API listening on port ${PORT}`);
    });
});

