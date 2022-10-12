const jwt = require('jsonwebtoken');
const User = require('../models/User');
const requireAdmin = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async(err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                // console.log('admin middlware');
                // console.log(decodedToken);
                try {
                    const user = await User.findById({ _id: decodedToken.id });
                    // console.log(user);
                    // console.log(user.role);
                    if (user.role === 'admin') {
                        next();
                    } else {
                        res.redirect('/');
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        })
    }
    // next();

}
module.exports = requireAdmin;