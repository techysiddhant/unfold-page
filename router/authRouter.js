const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authForgotController = require('../controllers/authForgotController');
const { validateUser, userValidation, validateForgotPassword, forgotvalidation, validateResetPassword, resetPasswordValidation } = require('../middlewares/authMiddleware');
const { requireAuth } = require('../middlewares/authUserVerifyMiddleware');

router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/signup', authController.signup_get);
router.post('/signup', validateUser, userValidation, authController.signup_post);
router.get('/logout', authController.logout_get);

router.get('/forgot-password', authForgotController.forgot_get);
router.post('/forgot-password', validateForgotPassword, forgotvalidation, authForgotController.forgot_post);
router.get('/reset-password/:id/:token', authForgotController.reset_get);
router.post('/reset-password/:id/:token', authForgotController.reset_post);
router.get('/emailsend/:accept', (req, res) => {
    res.render('emailsend');
})
module.exports = router;