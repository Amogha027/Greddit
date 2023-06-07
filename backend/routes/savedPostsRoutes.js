const { Router } = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const savedPostsController = require('../controllers/savedPostsControllers');

const router = Router();

router.post('/saved-posts', requireAuth, savedPostsController.saved_posts);
router.post('/remove-post', requireAuth, savedPostsController.remove_post);

module.exports = router;