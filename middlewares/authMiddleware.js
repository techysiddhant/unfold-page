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
        check('about').trim().isLength({ min: 10 }).withMessage('About must be min 10 charcater long!')
    ]
    // exports.validateLoginUser = [
    //     check('email').isEmail().withMessage('Enter a valid email!').custom(async(email) => {
    //         const existingUser = await User.findOne({ email })
    //         if (!existingUser) {
    //             throw new Error('Email is not registered');
    //         }
    //     }),
    //     check('password').trim().isLength({ min: 6 }).withMessage('Password Must be 6 character long!'),

// ]

// exports.validationResult = (req,next)=>{

// }

exports.userValidation = (req, res, next) => {
    const errors = validationResult(req).array();
    console.log(errors.length);
    console.log();

    if (!errors.length) return next();
    res.status(422).json({ errors: errors, success: 'ok' });
    // if (!errors.isEmpty()) {
    //     console.log('inside');
    //     res.status(422).json({ errors: errors.array() });
    //     return;
    // }
    // next();
}