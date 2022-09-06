const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authForgotController = require('../controllers/authForgotController');
const { validateUser, userValidation } = require('../middlewares/authMiddleware');
const { requireAuth } = require('../middlewares/authUserVerifyMiddleware');

router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/signup', authController.signup_get);
router.post('/signup', validateUser, userValidation, authController.signup_post);
router.get('/', requireAuth, authController.home_get);

router.get('/forgot-password', authForgotController.forgot_get);
router.post('/forgot-password', authForgotController.forgot_post);
router.get('/reset-password/:id/:token', authForgotController.reset_get);
router.post('/reset-password/:id/:token', authForgotController.reset_post);

module.exports = router;