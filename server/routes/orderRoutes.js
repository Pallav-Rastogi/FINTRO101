// server/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Price = require('../models/Price');

router.post('/', async (req, res) => {
  try {
    const { userId, quantity, action } = req.body;
    const user = await User.findById(userId);
    const currentPrice = await Price.findOne().sort({ timestamp: -1 });

    if (!user || !currentPrice) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    if (currentPrice.remainingQuantity < quantity) {
      return res.status(400).json({ message: 'Insufficient quantity available' });
    }

    const orderValue = quantity * currentPrice.value;
    const newPosition = action === 'buy' ? user.position + quantity : user.position - quantity;
    const pnlChange = action === 'buy' ? -orderValue : orderValue;

    user.position = newPosition;
    user.pnl += pnlChange;
    await user.save();

    currentPrice.remainingQuantity -= quantity;
    await currentPrice.save();

    res.json({ message: 'Order executed successfully', newPosition: user.position, newPnl: user.pnl });
  } catch (error) {
    res.status(500).json({ message: 'Error executing order' });
  }
});

module.exports = router;