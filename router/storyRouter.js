const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/authUserVerifyMiddleware');
const { validatetitle, titleValidation } = require('../middlewares/authMiddleware');
const storyController = require('../controllers/storyController');
const upload = require('../middlewares/upload');
//home
router.get('/', requireAuth, storyController.home_get);

router.get('/add/story', requireAuth, storyController.addstory_get);
router.post('/add/story', upload.single('image'), storyController.addstory_post);

//story
router.get('/searchResults', storyController.searchResults_get);









module.exports = router;