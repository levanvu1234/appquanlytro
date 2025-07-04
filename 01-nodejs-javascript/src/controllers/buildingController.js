const buildingService = require('../services/buildingService');

const buildingController = {
  // Tạo mới tòa nhà
  create: async (req, res) => {
    try {
      const building = await buildingService.createBuilding(req.body);
      res.status(201).json(building);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Lấy tất cả tòa nhà
  getAll: async (req, res) => {
    try {
      const buildings = await buildingService.getAllBuildings();
      res.status(200).json(buildings);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Lấy tòa nhà theo ID (kèm danh sách phòng)
  getById: async (req, res) => {
    try {
      const building = await buildingService.getBuildingById(req.params.id);
      if (!building) return res.status(404).json({ message: 'Building not found' });

      const formattedBuilding = {
        _id: building._id,
        name: building.name,
        address: building.address,
        activity: building.activity,
        rooms: building.rooms?.map(room => ({
          _id: room._id,
          name: room.name,
          activity: room.activity
        })) || [],
        createdAt: building.createdAt,
        updatedAt: building.updatedAt
      };

      res.json(formattedBuilding);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Cập nhật tòa nhà
  update: async (req, res) => {
    try {
      const building = await buildingService.updateBuilding(req.params.id, req.body);
      res.json(building);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Xóa tòa nhà
  delete: async (req, res) => {
    try {
      await buildingService.deleteBuilding(req.params.id);
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  //  API trả về doanh thu theo tòa nhà và theo tháng
  getRevenue: async (req, res) => {
    try {
      const data = await buildingService.getBuildingsWithRevenue();
      return res.status(200).json(data);
    } catch (err) {
      console.error("Lỗi doanh thu:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
};

module.exports = buildingController;
