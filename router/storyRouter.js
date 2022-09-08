const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/authUserVerifyMiddleware');

const storyController = require('../controllers/storyController');

router.get('/add/story', storyController.addstory_get);
router.post('/add/story', storyController.addstory_post);
router.get('/add/story/image/:id', storyController.addstoryimage_get);









module.exports = router;