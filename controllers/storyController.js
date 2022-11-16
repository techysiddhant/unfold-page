const User = require('../models/User');
const Story = require('../models/Story');
const jwt = require('jsonwebtoken');
const Grid = require("gridfs-stream");
const { GridFsStorage } = require('multer-gridfs-storage');
const dotenv = require('dotenv');
const path = require('path');
const multer = require("multer");
dotenv.config({ path: './config/config.env' });
const mongoose = require("mongoose");
const { setPriority } = require('os');
const striptags = require('striptags');
// const connectDB = require('../config/db');
// connectDB();
const MONGOURI = process.env.MONGO_URI;
// console.log(MONGOURI);

const conn = mongoose.createConnection(MONGOURI);

let gfs, gridfsBucket;
conn.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'photos'
    });
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('photos');
});


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
        const imgname = req.file.filename;
        // console.log(imgname);
        // 6338a3f37e4bd7e13d3cf22b
        const story = await Story.create({ title: title, storybody: storybody, status: status, user: dtoken.id, imageId: imgid, imgname, markdown: req.body.markdown });
        if (story) {
            console.log(story);
            res.redirect('/posts');
        } else {
            res.send(`<h1>Something Went Wrong Try again</h1>`);
        }
    } catch (error) {
        console.log(error);
    }
}



//for search results

// module.exports.searchResults_get = (req, res) => {
//     res.render('searchResults');
// }

// DASHBOARD
module.exports.dashboard_get = async(req, res) => {
        const token = req.cookies.jwt;
        let dtoken;
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
                dtoken = decodedToken;
            });
        }
        try {
            const stories = await Story.find({ user: dtoken.id }).lean();
            res.render('dashboard', { stories });
        } catch (error) {
            console.log(error);
        }
    }
    // edit page
module.exports.edit_get = async(req, res) => {
    const id = req.params.id;
    // console.log(id);
    try {
        const story = await Story.findById({ _id: id });
        res.render('edit', { story, error: '' });
    } catch (error) {
        console.log(error)
    }
}
module.exports.edit_post = async(req, res) => {
    const id = req.params.id;
    console.log(id);
    let { title, status, storybody } = req.body;
    // console.log("🚀 ~ file: storyController.js ~ line 91 ~ module.exports.edit_post=async ~ title", title)
    try {
        let story = await Story.findById({ _id: id }).lean();
        if (title.length > 41) {
            res.render('edit', { error: "Title Must be 40 Characater long!", story });
            return;
            // error = "Title must be 40 char long!";
        }
        story = await Story.findOneAndUpdate({ _id: id }, req.body);
        res.redirect('/posts');
    } catch (error) {
        console.log(error);

    }
}

//delete post
module.exports.delete_post = async(req, res) => {
    const storyid = req.params.id;
    try {
        const storyImg = await Story.findById(storyid);
        console.log(storyImg.imageId);
        gridfsBucket.delete(mongoose.Types.ObjectId(storyImg.imageId));
        const story = await Story.findByIdAndDelete({ _id: req.params.id });
        res.redirect('/');
    } catch (error) {
        console.log(error);

    }
}

//show all public posts
module.exports.posts_get = async(req, res) => {
    // get logged in user
    const token = req.cookies.jwt;
    let dtoken;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            dtoken = decodedToken;
        });
    }
    try {
        const userLogedIn = await User.findById({ _id: dtoken.id });
        console.log(userLogedIn);
        const stories = await Story.find({ status: 'public' }).populate('user').sort({ createdAt: 'desc' }).lean();
        const publicStoryNo = await Story.find({
            "$and": [
                { status: 'public' },
                { user: dtoken.id }
            ]
        });
        const privateStoryNo = await Story.find({
            "$and": [
                { status: 'private' },
                { user: dtoken.id }
            ]
        });
        // console.log(privateStoryNo.length);
        res.render('home', { stories, userLogedIn, publicStoryNo: publicStoryNo.length, privateStoryNo: privateStoryNo.length });
    } catch (error) {
        console.log(error);
    }
}

// testing image file route
// module.exports.imageall_get = (req, res) => {
//         gfs.files.find().toArray((err, files) => {
//             if (!files || files.length === 0) {
//                 return res.status(404).json({ err: 'No file Exist' })
//             }
//             return res.json(files);
//         })
//     }

// show image
module.exports.image_get = async(req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        if (!file) {
            return res.status(404).json({ err: 'No file exist' });
        }
        //check if image or not

        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            //Read output to the browser
            const readstream = gridfsBucket.openDownloadStream(file._id);
            readstream.pipe(res)
        } else {
            res.status(404).json({ err: 'Not an image' });
        }
    })
}

// single story
module.exports.post_get = async(req, res) => {
    try {
        const post = await Story.findById(req.params.id).populate('user').lean();
        console.log(post);
        // const body = post.storybody;
        // console.log(body);
        // console.log(JSON.stringify(body));
        // const user = await User.findById({ _id: post.user.toString() });
        const storyBody = striptags(post.storybody, [], '\n');
        res.render('show', { post: post, storyBody });
    } catch (error) {
        console.log(error);
    }
}

// show search results
module.exports.searchResults_get = async(req, res) => {
    const searchtag = req.body.searchname;
    if (!searchtag) {
        res.redirect('/');
        return;
    }
    try {
        const stories = await Story.find({
            "$and": [
                { title: { $regex: searchtag, $options: '$i' } },
                { status: 'public' }
            ]
        }).populate('user').sort({ createdAt: 'desc' }).lean();
        // console.log(stories);
        res.render("searchResults", { stories });
    } catch (error) {
        console.log(error);
    }
}

// show single users all story
module.exports.userStory_get = async(req, res) => {
    const userid = req.params.userid;
    try {
        const story = await Story.find({ user: userid, status: 'public' }).populate('user').lean();
        res.render('userStory', { stories: story, });
    } catch (error) {

    }
}

module.exports.reportStory_post = async(req, res) => {
    const storyId = req.params.id;
    try {
        const token = req.cookies.jwt;
        let dtoken;
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
                dtoken = decodedToken;
            });
        }
        const spam = { spamBy: dtoken.id }
        const story = await Story.findByIdAndUpdate({ _id: storyId }, { $push: { spam: spam } });
        const story1 = await Story.findByIdAndUpdate({ _id: storyId }, { markSafe: false });
        const storyspam = await Story.find({ "$and": [{ "spam.0": { "$exists": true } }, { markSafe: false }] });
        // console.log(storyspam);
        //event emit
        // console.log('Story emit event before');
        // console.log(story);

        const eventEmitter = req.app.get('eventEmitter');
        eventEmitter.emit('spamStory', story);
        res.redirect('/posts');
    } catch (error) {
        console.log(error);
    }

    // res.send('Success');
}