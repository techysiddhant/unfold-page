const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/home', authController.home_get);


module.exports = router;