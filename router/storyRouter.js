const express = require('express');
const router = express.Router();
const { requireAuth, requireAdminViewStory } = require('../middlewares/authUserVerifyMiddleware');
const { validatetitle, titleValidation } = require('../middlewares/authMiddleware');
const storyController = require('../controllers/storyController');
const upload = require('../middlewares/upload');
//home
// router.get('/', requireAuth, storyController.home_get);

// ADD STORY PAGE GET REQUEST
router.get('/add', requireAuth, storyController.addstory_get);
//ADD STORY PAGE POST REQUEST
router.post('/add', requireAuth, upload.single('image'), storyController.addstory_post);
//image url
router.get('/image/:filename', requireAdminViewStory, storyController.image_get);
//image files testing route
// router.get('/files', storyController.imageall_get);
//story
router.get('/searchResults', requireAuth, storyController.searchResults_get);
// SHOW USER'S DASHBOARD
router.get('/', requireAuth, storyController.dashboard_get);
// edit page get request
router.get('/edit/:id', requireAuth, storyController.edit_get);
//edit page post request
router.post('/edit/:id', requireAuth, storyController.edit_post);
//delete the one story/data
router.delete('/delete/:id', requireAuth, storyController.delete_post);

//show all public posts
router.get('/posts', requireAuth, storyController.posts_get);
// router.get('/:id', storyController.show_get);

//show single post
router.get('/posts/:id', requireAdminViewStory, storyController.post_get);

//show search results
router.post('/searchresults', requireAuth, storyController.searchResults_get);
//show user's story
router.get('/user/:userid', requireAuth, storyController.userStory_get);
//report the story
router.post('/report/:id', storyController.reportStory_post);




module.exports = router;