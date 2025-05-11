const Leaderboard = require('../model/leaderboardModel');

// get
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find().sort({ score: -1 }).populate('userId', 'username');
    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// post
exports.postLeaderboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { score } = req.body;

    await Leaderboard.findOneAndUpdate(
      { userId },
      { score, lastUpdated: Date.now() },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Leaderboard updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
