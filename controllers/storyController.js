const User = require('../models/User');
const Story = require('../models/Story');
const jwt = require('jsonwebtoken');
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
module.exports.home_get = (req, res) => {
    res.render('home');
}
module.exports.addstory_get = (req, res) => {
    res.render('addstory');
}

module.exports.addstory_post = async(req, res) => {
    const { title, storybody, status } = req.body;
    const token = req.cookies.jwt;
    let dtoken;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            dtoken = decodedToken;
        });
    }
    try {
        const story = await Story.create({ title: title, storybody: storybody, status: status, user: dtoken.id });
        if (story) {

            res.redirect(`/add/story/image/${story._id}`);
        } else {
            res.send(`<h1>Something Went Wrong Try again</h1>`);
        }
    } catch (error) {
        console.log(error);
    }

}

module.exports.addstoryimage_get = (req, res) => {
    res.render('image');
}

module.exports.addstoryimage_post = async(req, res) => {
    const id = req.params.id;
    console.log("🚀 ~ file: storyController.js ~ line 39 ~ module.exports.addstoryimage_post=async ~ id", id)
    if (req.file === undefined) return res.send("you must select a file.");
    try {
        const imgid = req.file.id.toString();
        console.log("🚀 ~ file: storyController.js ~ line 43 ~ module.exports.addstoryimage_post=async ~ imgid", imgid)
        const story = await Story.findByIdAndUpdate({ _id: id }, { imageId: imgid });
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
}