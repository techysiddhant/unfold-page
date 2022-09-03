const { check, validationResult } = require('express-validator')

exports.validateUser = [
    check('firstname').not().isEmpty().isLength({ min: 3, max: 10 }).withMessage('first name contain min 3 & max 10 character'),
    check('lastname').not().isEmpty().isLength({ min: 3, max: 10 }).withMessage('last name contain min 3 & max 10 character'),
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail().isLowercase().withMessage('Email is not valid'),
    check('password').trim().not().isEmpty().isLength({ min: 8, max: 20 }).withMessage('password must be 8 to 20 Character long!')
]

exports.uservalidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        })
    }
    next();
    res.status(202).json({
        success: 'Ok'
    });
    console.log(req.body);
}