const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  activity: String,
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Building', // tham chiếu tới Building
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user' // hoặc 'User' tùy theo bạn đặt tên model
  }],
  startDate:Date,
  endDate: Date,
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
