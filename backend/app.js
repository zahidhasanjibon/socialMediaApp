const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors")
const fileUpload = require("express-fileupload")
const path = require('path')

const app = express();
const errorHandler = require('./middlewares/error');

require('dotenv').config({ path: 'backend/config/config.env' });
app.use(cors())
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({ limit: "50mb",extended: true }));
app.use(cookieParser());
app.use(fileUpload())

const postRoute = require('./routes/postRoutes');
const userRoute = require('./routes/userRoutes');

app.use('/api/v1', postRoute);
app.use('/api/v1', userRoute);
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

app.use(errorHandler);

module.exports = app;
