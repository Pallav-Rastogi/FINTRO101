// server/models/Price.js
const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  remainingQuantity: { type: Number, required: true },
});

module.exports = mongoose.model('Price', priceSchema);