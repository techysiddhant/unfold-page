const { check, validationResult } = require('express-validator');
const User = require('../models/User');

exports.validateUser = [
    check('firstname').trim().isLength({ min: 3, max: 10 }).withMessage('First name must be 3 to 10 Character long!'),
    check('lastname').trim().isLength({ min: 3, max: 10 }).withMessage('Last name must be 3 to 10 Character long!'),
    check('username').trim().isLength({ min: 3 }).withMessage('User name must be unique & min 3 Char').custom(async(username) => {
        const existingusername = await User.findOne({ username })
        if (existingusername) {
            console.log(existingusername);
            throw new Error('Username already taken');
        }
    }),
    check('email').isEmail().withMessage('Enter a valid email!').custom(async(email) => {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            throw new Error('Email already in use');
        }
    }),
    check('password').trim().isLength({ min: 6 }).withMessage('Password Must be 6 character long!'),
    check('about').trim().isLength({ max: 30 }).withMessage('About max 30 charcater long!')
]

exports.validateForgotPassword = [
    check('email').isEmail().withMessage('Enter a valid email!').custom(async(email) => {
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            throw new Error('Email is not registered');
        }
    })
]
exports.forgotvalidation = (req, res, next) => {
    const err̥ors = validationResult(req).array();
    console.log("🚀 ~ file: authMiddleware.js ~ line 34 ~ err̥ors", err̥ors.length)
    if (!err̥ors.length) return next();
    return res.status(400).json({ errors: err̥ors, success: 'false' });
}

exports.validateResetPassword = [
    check('password').trim().isLength({ min: 6 }).withMessage('Password Must be 6 character long!'),
    check('password2').custom(async(confirmPassword, { req }) => {
        if (confirmPassword !== req.body.password) {
            throw new Error('Password do not match');
        }
        return true;
    })
]
exports.resetPasswordValidation = (req, res, next) => {
    const err̥ors = validationResult(req).array();
    console.log("🚀 ~ file: authMiddleware.js ~ line 34 ~ err̥ors", err̥ors.length)
    if (!err̥ors.length) return next();
    return res.status(400).json({ errors: err̥ors, success: 'false' });
}

exports.validatetitle = [
    check('title').trim().isLength({ max: 20 }).withMessage('Title must be 20 character long!'),
]
exports.titleValidation = (req, res, next) => {
    const err̥ors = validationResult(req).array();
    console.log("🚀 ~ file: authMiddleware.js ~ line 57 ~ err̥ors", err̥ors)
    if (!err̥ors.length) return next();
    return res.status(400).json({ errors: err̥ors, success: 'false' });
}
exports.userValidation = (req, res, next) => {
    const errors = validationResult(req).array();
    console.log(errors.length);
    console.log();

    if (!errors.length) return next();
    res.status(422).json({ errors: errors, success: 'false' });
    // if (!errors.isEmpty()) {
    //     console.log('inside');
    //     res.status(422).json({ errors: errors.array() });
    //     return;
    // }
    // next();
}