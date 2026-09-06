const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require("../src/middlewares/error.middleware");
const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());

app.use('/auth', require('./routes/auth.routes'));
app.use('/trees', require('./routes/tree.routes'));

app.get("/health", (req, res) => {
    res.status(200).json({ success: true, message: "RootedIn API is running" });
});

app.use(errorHandler);

module.exports = app;