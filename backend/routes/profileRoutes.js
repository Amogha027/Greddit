const { Router } = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const profileController = require('../controllers/profileControllers');

const router = Router();

router.post('/profile', requireAuth, profileController.get_profile);
router.post('/profile-update', requireAuth, profileController.profile_update);
router.post('/update-followers', requireAuth, profileController.update_followers);
router.post('/update-following', requireAuth, profileController.update_following);

module.exports = router;