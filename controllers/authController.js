const User = require('../models/User');
const jwt = require('jsonwebtoken');
// const { validationResult } = require('express-validator');
const handleErrors = (err) => {
        console.log(err.message, err.code);
        let errors = { email: '', password: '' };
        // incorrect email in login
        if (err.message === 'incorrect Email') {
            errors.email = 'that email is not registered'
        }
        // incorrect password in login
        if (err.message === 'incorrect Password') {
            errors.password = 'that password is incorrect'
        }
        //validation errors
        if (err.message.includes('user validation failed')) {
            Object.values(err.errors).forEach(({ properties }) => {
                // console.log(properties);
                errors[properties.path] = properties.message;
            })
        }
        return errors;
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

module.exports.login_post = async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        if (user.state === 'block') {
            res.status(200).json({ user: user, success: 'Ok' });
            return;
        }
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        // if (user.role === 'admin') {
        //     return res.redirect('/admin/home');
        // }
        // console.log('User req:', user.role);
        res.status(200).json({ user: user, success: 'Ok' });

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors, success: 'fail' });
    }
    // res.send('Login Post Request');
}
module.exports.signup_get = (req, res) => {
    res.render('signup');
}



module.exports.signup_post = async(req, res) => {
    try {
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     console.log('inside');
        //     res.status(422).json({ errors: errors.array() });
        //     return;
        // }
        // next();
        const { firstname, lastname, username, email, password, about } = req.body;
        const user = await User.create({ firstname, lastname, username, email, password, about });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        //event emit
        const eventEmitter = req.app.get('eventEmitter');
        eventEmitter.emit('userRegistered', user);
        res.status(201).json({ user: user._id, success: 'Ok' });
    } catch (err) {
        console.log(err);
    }
    console.log(req.body);

}
module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/login');
}