const MonthlyBill = require('../models/monthlybill');

const monthlyBillService = {
  // Tạo mới bill
  create: async (data) => {
    const newBill = new MonthlyBill(data);
    return await newBill.save();
  },

  // Cập nhật bill theo ID
  update: async (id, data) => {
    return await MonthlyBill.findByIdAndUpdate(id, data, { new: true });
  },

  // Xóa bill
  delete: async (id) => {
    return await MonthlyBill.findByIdAndDelete(id);
  },

  // Lấy bill theo ID
  getById: async (id) => {
    return await MonthlyBill.findById(id).populate('room');
  },

  // Lấy tất cả bill theo phòng (hoặc toàn bộ)
 getAll: async (filter = {}) => {
  return await MonthlyBill.find(filter).populate({
    path: 'room',
    populate: {
      path: 'building',
      model: 'Building',
    },
  });
},

  // Thống kê tổng tiền theo tháng và năm
  getSummaryByMonthYear: async (month, year) => {
    const bills = await MonthlyBill.find({ month, year });

    const total = bills.reduce((sum, bill) => {
      return sum + bill.totalCost;
    }, 0);

    return {
      month,
      year,
      total,
      count: bills.length,
    };
  },
};

module.exports = monthlyBillService;
