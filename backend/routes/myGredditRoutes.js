const { Router } = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const myGredditController = require('../controllers/myGredditControllers');

const router = Router();

router.post('/new-greddit', requireAuth, myGredditController.new_greddit);
router.post('/sub-greddit', requireAuth, myGredditController.sub_greddit);
router.post('/delete-greddit', requireAuth, myGredditController.delete_greddit);
router.post('/greddit-join', requireAuth, myGredditController.join_greddit);
router.post('/greddit-reject', requireAuth, myGredditController.reject_greddit);
router.post('/get-reports', requireAuth, myGredditController.get_reports);
router.post('/ignore-report', requireAuth, myGredditController.ignore_report);
router.post('/delete-report', requireAuth, myGredditController.delete_report);
router.post('/block-report', requireAuth, myGredditController.block_report);

module.exports = router;