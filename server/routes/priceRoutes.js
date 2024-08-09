// server/routes/priceRoutes.js
const express = require('express');
const router = express.Router();
const Price = require('../models/Price');
const User = require('../models/User');

router.post('/', async (req, res) => {
  try {
    const { value, remainingQuantity } = req.body;
    const newPrice = new Price({ value, remainingQuantity });
    await newPrice.save();

    // Reset all user positions and update PNL
    const users = await User.find();
    for (const user of users) {
      const pnlChange = user.position * (value - (await Price.findOne().sort({ timestamp: -1 }).skip(1)).value);
      user.pnl += pnlChange;
      user.position = 0;
      await user.save();
    }

    res.status(201).json({ message: 'Price updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating price' });
  }
});

router.get('/current', async (req, res) => {
  try {
    const currentPrice = await Price.findOne().sort({ timestamp: -1 });
    res.json(currentPrice);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching current price' });
  }
});

module.exports = router;