const mongoose = require('mongoose');

const monthlyBillSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
 
  month: { type: Number, required: true }, // 1 - 12
  year: { type: Number, required: true },
  roomPrice: { type: Number, default: 0 },
  electricityUnitPrice: { type: Number, default: 3000 },
  electricityUsage: { type: Number, default: 0 },  //số điện
  waterUnitPrice: { type: Number, default: 7000 },
  waterUsage: { type: Number, default: 0 }, //số nước
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Virtual tính tổng tiền tháng
monthlyBillSchema.virtual('totalCost').get(function () {
  return (
    (this.roomPrice || 0) +
    (this.electricityUnitPrice || 0) * (this.electricityUsage || 0) +
    (this.waterUnitPrice || 0) * (this.waterUsage || 0)
  );
});

monthlyBillSchema.set('toJSON', { virtuals: true });
monthlyBillSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.MonthlyBill || mongoose.model("MonthlyBill", monthlyBillSchema);

