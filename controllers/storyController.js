const User = require('../models/User');
const Story = require('../models/Story');
const jwt = require('jsonwebtoken');
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