const User = require('../models/User');
const Story = require('../models/Story');
const jwt = require('jsonwebtoken');
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
module.exports.home_get = (req, res) => {
    res.render('home');
}
module.exports.addstory_get = (req, res) => {
    res.render('addstory', { title: '', storybody: '', error: '', status: '', errorImg: '' });
}

module.exports.addstory_post = async(req, res) => {
    const { title, storybody, status } = req.body;
    if (title.length > 41) {
        res.render('addstory', { error: "Title Must be 40 Characater long!", title, status, storybody });
        return;
        // error = "Title must be 40 char long!";
    }
    // res.redirect('/');
    if (req.file === undefined) {
        res.render('addstory', { errorImg: "You must Select a file", error: '', title, status, storybody });
        return;
        // return res.send("you must select a file.")
    }
    // res.redirect('/');
    const token = req.cookies.jwt;
    let dtoken;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            dtoken = decodedToken;
        });
    }
    try {
        // console.log(req.file);
        const imgid = req.file.id.toString();

        const story = await Story.create({ title: title, storybody: storybody, status: status, user: dtoken.id, imageId: imgid });
        if (story) {

            res.redirect('/');
        } else {
            res.send(`<h1>Something Went Wrong Try again</h1>`);
        }
    } catch (error) {
        console.log(error);
    }
}



//for search results

module.exports.searchResults_get = (req, res) => {
    res.render('searchResults');
}


module.exports.dashboard_get = (req, res) => {
    res.render('dashboard');
}

module.exports.show_get = (req, res) => {
    res.render('show');
}