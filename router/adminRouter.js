const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/authUserVerifyMiddleware');
const requireAdmin = require('../middlewares/authAdminMiddlware');
const adminController = require('../controllers/adminController');
router.get('/home', requireAdmin, adminController.home_get);
router.get('/story', requireAdmin, adminController.story_get);
router.get('/logout', requireAdmin, adminController.logout_get);
router.post('/blocked/:id', requireAdmin, adminController.blockUser_post);
router.post('/posts/notspam/:id', requireAdmin, adminController.notSpamStory_post);









module.exports = router;