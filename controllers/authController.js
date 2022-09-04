const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const handleErrors = (err) => {
        console.log(err.message, err.code);
        let errors = { email: '', password: '' };
        if (err.code === 11000) {
            errors.email = 'that email is already registered';
            return errors;
        }
    }
    // 3days max age
const maxAge = 3 * 24 * 60 * 60;
//create token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    });
}
module.exports.login_get = (req, res) => {
    res.render('login');
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

module.exports.signup_post = async(req, res, next) => {

    const { firstname, lastname, username, email, password, about } = req.body;
    try {

        //validatio result
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            })
        }
        // const doesExist = await User.findOne({ email: req.body.email });
        // const errmsg = 'Email is already exist';
        // if (doesExist) {
        //     res.render('signup', { errmsg });
        // }
        //check duplicate email



        const user = await User.create({ firstname, lastname, username, email, password, about });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id, success: 'Ok' });
    } catch (err) {
        // const errors = handleErrors(err);
        // res.status(400).json({ errors });
        console.log(err);
    }

    console.log(req.body);
    next();

    // res.send('Sign Up Request');

}
