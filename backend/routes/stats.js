const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Stats = require('../models/Stats');

// GET /api/stats → get user statistics
router.get('/', auth, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const stats = await Stats.find({
      user: req.user.id,
      date: { $gte: startDate }
    }).sort({ date: -1 });

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/stats → record a blocked attempt
router.post('/blocked', auth, async (req, res) => {
  try {
    const { url } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let stats = await Stats.findOne({
      user: req.user.id,
      date: today
    });

    if (!stats) {
      stats = new Stats({
        user: req.user.id,
        date: today,
        blockedAttempts: 1,
        sitesBlocked: [url]
      });
    } else {
      stats.blockedAttempts += 1;
      if (!stats.sitesBlocked.includes(url)) {
        stats.sitesBlocked.push(url);
      }
    }

    await stats.save();
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;

