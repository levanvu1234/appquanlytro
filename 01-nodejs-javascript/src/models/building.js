const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  activity: String,
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
}, { timestamps: true });

const Building = mongoose.model('Building', buildingSchema);
module.exports = Building;


