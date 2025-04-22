const mongoose = require('mongoose');

const EmergencySchema = new mongoose.Schema({
  description: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  reportedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Emergency', EmergencySchema);
