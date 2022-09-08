const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/authUserVerifyMiddleware');
const { validatetitle, titleValidation } = require('../middlewares/authMiddleware');
const storyController = require('../controllers/storyController');
const upload = require('../middlewares/upload');
//home
router.get('/', requireAuth, storyController.home_get);

router.get('/add/story', requireAuth, storyController.addstory_get);
router.post('/add/story', storyController.addstory_post);
//media routes
router.get('/add/story/image/:id', storyController.addstoryimage_get);
router.post('/add/story/image/:id', upload.single('image'), storyController.addstoryimage_post);









module.exports = router;