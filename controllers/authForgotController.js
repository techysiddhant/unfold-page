const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

// 3days max age for jwt 
const maxAge = 3 * 24 * 60 * 60;
module.exports.forgot_get = (req, res) => {
    res.render('forgot-password');
}
module.exports.forgot_post = async(req, res) => {
    const { email } = req.body;
    console.log(email);
    //make sure user exist or not
    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.send('User is not registered');
            return;
        }
        // create a one time link
        const secret = process.env.JWT_SECRET + user.password;
        const payload = {
            id: user._id
        }
        const token = jwt.sign(payload, secret, { expiresIn: '15m' });
        const link = `http://localhost:3000/reset-password/${user._id}/${token}`
        console.log(link);

        // Now Send mail to the user
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS

            }
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: 'Reset Link',
            html: `<a href=${link}>Click Here</a>`
        }
        transporter.sendMail(mailOptions, (err, result) => {
            if (err) {
                console.log(err)
                res.send('Opps error occured, Please retry after some time');
            } else {
                res.send('thanks for e-mailing me, check your inbox, or spam folder...');
            }
        });
        res.cookie('jwt', '', { maxAge: 1 });
        // res.send('Password link send successfully');
    } catch (error) {
        console.log(error.message);
        // res.send(error.message);
    }


}
module.exports.reset_get = async(req, res) => {
    const { id, token } = req.params;
    // res.send(req.params);
    // check if user exist or not
    try {
        const user = await User.findById({ _id: id });
        if (!user) {
            res.send('Invalid Id');
            return;
        }
        //we have avalid id and valid user with this id
        const secret = process.env.JWT_SECRET + user.password;
        const payload = jwt.verify(token, secret)
        res.render('reset-password', { email: user.email });

    } catch (error) {
        console.log(error.message);
    }

}
module.exports.reset_post = async(req, res) => {
    const { id, token } = req.params;
    const { password, password2 } = req.body;
    try {
        const user = await User.findById({ _id: id });
        if (!user) {
            res.send('Invalid Id');
            return;
        }
        const secret = process.env.JWT_SECRET + user.password;
        const payload = jwt.verify(token, secret);
        //validate password and confirm password
        //we can simply find the user with the payload email and id
        const salt = await bcrypt.genSalt();
        const pass = await bcrypt.hash(password, salt);
        const newUser = await User.findOneAndUpdate({ _id: id }, { $set: { password: pass } });
        // console.log(newUser);
        // res.send(newUser);
        res.cookie('jwt', '', { maxAge: 1 });
        res.redirect('/login');
        // console.log(pass);
    } catch (error) {
        console.log(error);

    }



    // res.send('reset-post');
}
