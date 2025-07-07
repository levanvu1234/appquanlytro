const MonthlyBill = require('../models/monthlybill');
const PDFDocument = require('pdfkit');
const path = require("path");
const fs = require('fs');
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
    return await MonthlyBill.findById(id).populate({
      path: 'room',
      populate: {
        path: 'building',
        model: 'Building',
      },
    });
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

  // In hóa đơn PDF
// generateBillPDF: async (billId, res) => {
//     const bill = await MonthlyBill.findById(billId).populate({
//       path: 'room',
//       populate: {
//         path: 'building',
//         model: 'Building',
//       },
//     });

//     if (!bill) {
//       return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
//     }
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `inline; filename="bill_${billId}.pdf"`);

//     const doc = new PDFDocument();
//     const fontPath = path.join(__dirname, "../font/Roboto-VariableFont_wdth,wght.ttf"); // chỉnh đường dẫn nếu cần
//     doc.font(fontPath);
    
//     doc.pipe(res);

//     doc.fontSize(18).text('HÓA ĐƠN THANH TOÁN', { align: 'center' });
//     doc.moveDown();

//     doc.fontSize(12).text(`Phòng: ${bill.room?.name || ''}`);
//     doc.text(`Khu nhà: ${bill.room?.building?.name || ''}`);
//     doc.text(`Tháng/Năm: ${bill.month}/${bill.year}`);
//     doc.text(`Tiền phòng: ${bill.roomPrice.toLocaleString()} VNĐ`);
//     doc.text(`Số điện: ${bill.electricityUsage} x ${bill.electricityUnitPrice.toLocaleString()} VNĐ`);
//     doc.text(`Số nước: ${bill.waterUsage} x ${bill.waterUnitPrice.toLocaleString()} VNĐ`);
//     doc.text(`Tổng tiền: ${bill.totalCost.toLocaleString()} VNĐ`);

//     doc.end();
//   }
};

module.exports = monthlyBillService;
