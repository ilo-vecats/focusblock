const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Blocked = require('../models/Blocked');

// GET /api/blocked → get all blocked sites for user
router.get('/', auth, async (req, res) => {
  try {
    const sites = await Blocked.find({ user: req.user.id });
    res.json(sites);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/blocked → add a new blocked site
router.post('/', auth, async (req, res) => {
  const { url, schedule, category } = req.body;
  
  if (!url) return res.status(400).json({ msg: 'URL is required' });

  try {
    const newSite = new Blocked({
      url,
      user: req.user.id,
      schedule: schedule || { enabled: false },
      category: category || 'General'
    });
    await newSite.save();
    res.json(newSite);
  } catch (err) {
    console.error('Error saving blocked site:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// PUT /api/blocked/:id → update a blocked site (schedule, active status)
router.put('/:id', auth, async (req, res) => {
  try {
    const site = await Blocked.findById(req.params.id);
    if (!site) return res.status(404).json({ msg: 'Site not found' });

    if (site.user.toString() !== req.user.id)
      return res.status(401).json({ msg: 'Not authorized' });

    if (req.body.schedule !== undefined) site.schedule = req.body.schedule;
    if (req.body.isActive !== undefined) site.isActive = req.body.isActive;
    if (req.body.category !== undefined) site.category = req.body.category;

    await site.save();
    res.json(site);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE /api/blocked/:id → delete a blocked site
router.delete('/:id', auth, async (req, res) => {
  try {
    const site = await Blocked.findById(req.params.id);
    if (!site) return res.status(404).json({ msg: 'Site not found' });

    if (site.user.toString() !== req.user.id)
      return res.status(401).json({ msg: 'Not authorized' });

    await site.deleteOne();
    res.json({ msg: 'Site removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;