const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Blocked = require('../models/Blocked'); // make sure you have this model

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
  const { url } = req.body;
  console.log('POST /api/blocked - Request body:', req.body);
  console.log('POST /api/blocked - User ID:', req.user.id);
  
  if (!url) return res.status(400).json({ msg: 'URL is required' });

  try {
    const newSite = new Blocked({
      url,
      user: req.user.id,
    });
    await newSite.save();
    console.log('Successfully saved new site:', newSite);
    res.json(newSite);
  } catch (err) {
    console.error('Error saving blocked site:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// DELETE /api/blocked/:id → delete a blocked site
router.delete('/:id', auth, async (req, res) => {
  try {
    const site = await Blocked.findById(req.params.id);
    if (!site) return res.status(404).json({ msg: 'Site not found' });

    // only owner can delete
    if (site.user.toString() !== req.user.id)
      return res.status(401).json({ msg: 'Not authorized' });

    await site.remove();
    res.json({ msg: 'Site removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;