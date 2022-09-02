const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
//config file
dotenv.config({ path: './config/config.env' });
//connect DB
connectDB();
const app = express();
// setting json data
app.use(express.json())
    //setting body parser
app.use(bodyParser.urlencoded({ extended: false }))
    // add public folder
app.use(express.static('public'));
// setup the ejs engine
app.set('view engine', 'ejs')
app.get('/', (req, res) => {
    res.send('Hello From Node!!');
})

const PORT = process.env.PORT || 5000
app.listen(PORT, (req, res) => {
    console.log(`Server is Running at PORT: ${PORT}`);
});