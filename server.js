const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const router = require('./router/authRouter');
const cookieparser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middlewares/authUserVerifyMiddleware');
//config file
dotenv.config({ path: './config/config.env' });

//connect DB
connectDB();


const app = express();

// setting json data
app.use(express.json())
app.use(cookieparser());
//setting body parser
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }));
// add public folder
app.use(express.static(path.join(__dirname, 'public')));

// setup the ejs engine


// app.get('*', checkUser);
app.use(router);

const PORT = process.env.PORT || 5000
app.listen(PORT, (req, res) => {
    console.log(`Server is Running at PORT: ${PORT}`);
});