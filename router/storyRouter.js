const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/authUserVerifyMiddleware');

const storyController = require('../controllers/storyController');

router.get('/addstory', requireAuth, storyController.addstory_get);
router.post('/addstory', storyController.addstory_post);










module.exports = router;