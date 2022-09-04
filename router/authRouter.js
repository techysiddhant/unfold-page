const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateUser } = require('../middlewares/authMiddleware');

router.get('/login', authController.login_get);
router.post('/login', validateUser, authController.login_post);
router.get('/signup', authController.signup_get);

router.post('/signup', authController.signup_post);


router.post('/signup', validateUser, authController.signup_post);

router.get('/', authController.home_get);


module.exports = router;