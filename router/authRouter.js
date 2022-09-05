const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateUser, userValidation } = require('../middlewares/authMiddleware');
const { requireAuth, checkUser } = require('../middlewares/authUserVerifyMiddleware');

router.get('/login', authController.login_get);
router.post('/login', validateUser, authController.login_post);
router.get('/signup', authController.signup_get);
router.post('/signup', validateUser, userValidation, authController.signup_post);

router.get('/', requireAuth, authController.home_get);


module.exports = router;