
const express = require('express');
const router = express.Router();
const { getLeaderboard, postLeaderboard } = require('../controller/leaderboardController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', getLeaderboard);
router.post('/', verifyToken, postLeaderboard);

module.exports = router;
