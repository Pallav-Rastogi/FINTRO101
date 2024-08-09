// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pnl: { type: Number, default: 0 },
  position: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', userSchema);