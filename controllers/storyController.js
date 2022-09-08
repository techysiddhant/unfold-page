const User = require('../models/User');


module.exports.addstory_get = (req, res) => {
    res.render('addstory');
}

module.exports.addstory_post = (req, res) => {
    res.send('addstory post request');
}

module.exports.addstoryimage_get = (req, res) => {
    res.render('image');
}