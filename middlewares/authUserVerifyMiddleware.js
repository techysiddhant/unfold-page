const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt

    //check json web token exist & verified
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                console.log(decodedToken);
                // res.render('home');
                next();
            }
        })
    } else {
        res.redirect('/login');
    }
}

//check user
// const checkUser = (req, res, next) => {
//     const token = req.cookies.jwt;
//     if (token) {
//         jwt.verify(token, process.env.JWT_SECRET, async(err, decodedToken) => {
//             if (err) {
//                 console.log(err.message);
//                 res.locals.user = null

//                 next();
//             } else {
//                 console.log(decodedToken);
//                 let user = await User.findById(decodedToken.id);
//                 res.locals.user = user;
//                 next();
//             }
//         });
//     } else {
//         res.locals.user = null
//         next();
//     }
// }
// const ensureGuest = (req, res, next) => {
//     const token = req.cookies.jwt;
//     if (token) {
//         jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
//             if (err) {
//                 console.log(err);
//                 res.redirect('/login');
//                 // next();
//             } else {
//                 res.redirect('/');
//                 next();

//             }
//         })
//     } else {
//         res.render('login');
//         // next();
//     }
// }
module.exports = { requireAuth };