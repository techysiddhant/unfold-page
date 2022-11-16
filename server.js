const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const router = require('./router/authRouter');
const storyRouter = require('./router/storyRouter');
const adminRouter = require('./router/adminRouter');
const cookieparser = require('cookie-parser');
const moment = require('moment');
const methodOverride = require('method-override')
const Emitter = require('events');
const stripTags = require('striptags');

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
app.use(methodOverride('_method'));
// setup helpers
//event emmiter
const eventEmitter = new Emitter();
app.set('eventEmitter', eventEmitter);
app.locals.formatDate = (date, format) => {
    return moment(date).format(format)
}
app.locals.trimBody = (str, len) => {
    if (str.length > len && str.length > 0) {
        let newStr = str + ''
        newStr = str.substr(0, len);
        newStr = str.substr(0, newStr.lastIndexOf(''))
        newStr = newStr.length > 0 ? newStr : str.substr(0, len)
        return newStr + '...';
    }
    return str;
}
app.locals.stripTag = (input) => {
    return input.replace(/<(?:.|\n)*?>/gm, '');
    // return input.replace(/<[^>]*>/g, ' ').replace(/\s{2,}/g, ' ');
}
app.locals.striptag = (input) => {
    return stripTags(input, [], '\n');
}
app.locals.displayName = (str1, str2) => {
    let r1 = str1.slice(0, 1);
    let r2 = str2.slice(0, 1);
    let result = r1.concat(r2);
    return result.toUpperCase();
}
app.get('*', checkUser);
app.use(router);
app.use(storyRouter);
app.use('/admin', adminRouter);
const PORT = process.env.PORT || 5000

const server = app.listen(PORT, (req, res) => {
    console.log(`Server is Running at PORT: ${PORT}`);
});

// Socket
const io = require('socket.io')(server)
io.on('connection', (socket) => {
    //join
    socket.on('join', (admin) => {
        socket.join(admin);
    });
})
eventEmitter.on('userRegistered', (data) => {
    io.to('adminRoom').emit('userRegistered', data);
})
eventEmitter.on('spamStory', (data) => {
    io.to('spamRoom').emit('spamStory', data);
})