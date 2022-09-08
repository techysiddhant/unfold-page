const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/authUserVerifyMiddleware');

const storyController = require('../controllers/storyController');

router.get('/add/story', storyController.addstory_get);
router.post('/add/story', storyController.addstory_post);










module.exports = router;