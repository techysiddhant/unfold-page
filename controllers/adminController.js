const User = require('../models/User');
const Story = require('../models/Story');
const mongoose = require('mongoose');
module.exports.home_get = async(req, res) => {
    const users = await User.find({});
    // console.log(users);
    if (req.xhr) {
        return res.json(users);
    }
    res.render('adminHome');
}
module.exports.story_get = async(req, res) => {
    try {
        const story = await Story.find({ "$and": [{ "spam.0": { "$exists": true } }, { markSafe: false }] }).populate('user');
        // const eventEmitter = req.app.get('eventEmitter');
        // eventEmitter.emit('spamStory', story);
        // console.log(story);
        if (req.xhr) {
            return res.json(story);
        }
        res.render('adminStory');

    } catch (error) {
        console.log(error);
    }
}
module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/login');
}
module.exports.blockUser_post = async(req, res) => {
    const userid = req.params.id;
    try {
        const stories = await Story.updateMany({ user: userid }, { status: 'private' });
        const user = await User.findByIdAndUpdate(userid, { state: 'block' });
        // console.log(user);
        res.redirect('/admin/home');
    } catch (error) {
        console.log(error);
    }
}
module.exports.notSpamStory_post = async(req, res) => {
    const storyId = req.params.id;
    console.log('Inside not spam');
    try {
        const story = await Story.findByIdAndUpdate({ _id: storyId }, { markSafe: true }, { new: true });
        res.redirect('/admin/story');
    } catch (error) {
        console.log(error);
    }
}