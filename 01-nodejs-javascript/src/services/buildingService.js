require("dotenv").config();
const Building = require("../models/building");
const MonthlyBill = require("../models/monthlyBill");

const buildingService = {
  // Tạo tòa nhà mới
  createBuilding: async (buildingData) => {
    const building = new Building(buildingData);
    return await building.save();
  },

  // Lấy tất cả tòa nhà
  getAllBuildings: async () => {
    return await Building.find();
  },

  // Lấy tòa nhà theo ID
  getBuildingById: async (id) => {
    return await Building.findById(id).populate("rooms");
  },

  // Cập nhật tòa nhà theo ID
  updateBuilding: async (id, updatedData) => {
    return await Building.findByIdAndUpdate(id, updatedData, { new: true });
  },

  // Xóa tòa nhà theo ID
  deleteBuilding: async (id) => {
    return await Building.findByIdAndDelete(id);
  },

  //  Thống kê doanh thu theo từng tòa nhà và từng tháng
  getBuildingsWithRevenue: async () => {
    const buildings = await Building.find().populate("rooms");
    const allRoomIds = buildings.flatMap((b) => b.rooms.map((r) => r._id));

    const bills = await MonthlyBill.find({ room: { $in: allRoomIds } });

    const buildingRevenueMap = {};

    buildings.forEach((b) => {
      buildingRevenueMap[b._id.toString()] = {
        building: b,
        revenueByMonth: {},
        total: 0,
      };
    });

    bills.forEach((bill) => {
      const billTotal =
        (bill.roomPrice || 0) +
        (bill.electricityUnitPrice || 0) * (bill.electricityUsage || 0) +
        (bill.waterUnitPrice || 0) * (bill.waterUsage || 0);

      const building = buildings.find((b) =>
        b.rooms.some((r) => r._id.toString() === bill.room.toString())
      );
      if (!building) return;

      const buildingId = building._id.toString();
      const key = `${bill.year}-${bill.month.toString().padStart(2, "0")}`;

      if (!buildingRevenueMap[buildingId].revenueByMonth[key]) {
        buildingRevenueMap[buildingId].revenueByMonth[key] = 0;
      }

      buildingRevenueMap[buildingId].revenueByMonth[key] += billTotal;
      buildingRevenueMap[buildingId].total += billTotal;
    });

    return Object.values(buildingRevenueMap).map((entry) => ({
      _id: entry.building._id,
      name: entry.building.name,
      address: entry.building.address,
      total: entry.total,
      revenue: Object.entries(entry.revenueByMonth).map(([monthKey, amount]) => {
        const [year, month] = monthKey.split("-");
        return {
          month: parseInt(month),
          year: parseInt(year),
          totalAmount: amount,
        };
      }),
    }));
  },
};

module.exports = buildingService;
