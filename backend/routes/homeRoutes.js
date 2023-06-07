const { Router } = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const homeController = require('../controllers/homeControllers');

const router = Router();

router.post('/all-greddit', requireAuth, homeController.all_greddit);
router.post('/join-greddit', homeController.join_greddit);
router.post('/leave-greddit', homeController.leave_greddit);

module.exports = router;