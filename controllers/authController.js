const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleErrors = (err) => {
    let errors = { email: '', username: '' }
    if (err.code === '11000') {

    }
}
module.exports.login_get = (req, res) => {
    res.render('home');
}

module.exports.login_post = (req, res) => {
    res.send('Login Post Request');
}
module.exports.signup_get = (req, res) => {
    res.render('signup');
}
module.exports.signup_post = (req, res) => {
    res.send('Sign Up Request');
}