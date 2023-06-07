const { Router } = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const subGredditController = require('../controllers/subGredditControllers');

const router = Router();

router.post('/get-greddit', requireAuth, subGredditController.get_greddit);
router.post('/create-post', requireAuth, subGredditController.create_post);
router.post('/upvote', requireAuth, subGredditController.add_upvote);
router.post('/downvote', requireAuth, subGredditController.add_downvote);
router.post('/add-report', requireAuth, subGredditController.add_report);
router.post('/add-follow', requireAuth, subGredditController.add_follow);
router.post('/save-post', requireAuth, subGredditController.save_post);
router.post('/add-comment', requireAuth, subGredditController.add_comment);

module.exports = router;