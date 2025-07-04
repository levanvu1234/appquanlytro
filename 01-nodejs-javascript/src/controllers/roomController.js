const roomService = require('../services/roomService');

// Hàm dùng chung để định dạng dữ liệu phòng
const formatRoom = (room) => ({
  _id: room._id,
  name: room.name,
  activity: room.activity,
  building: {
    _id: room.building?._id,
    name: room.building?.name || 'Chưa gán tòa nhà'
  },
  users: (room.users || []).map(user => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    phonenumber: user.phonenumber 
  })),
  startDate: room.startDate,
  endDate: room.endDate,
  createdAt: room.createdAt,
  updatedAt: room.updatedAt
});

const roomController = {
  // Tạo mới phòng
  create: async (req, res) => {
    try {
      const room = await roomService.createRoom(req.body);
      res.status(201).json(formatRoom(room));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Lấy tất cả phòng
  getAll: async (req, res) => {
    try {
      const rooms = await roomService.getAllRooms();
      res.status(200).json(rooms.map(formatRoom));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Lấy phòng theo ID
  getById: async (req, res) => {
    try {
      const room = await roomService.getRoomById(req.params.id);
      if (!room) return res.status(404).json({ message: 'Room not found' });

      res.json(formatRoom(room));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Cập nhật phòng
  update: async (req, res) => {
    try {
      const room = await roomService.updateRoom(req.params.id, req.body);
      if (!room) return res.status(404).json({ message: 'Room not found' });

      res.json(formatRoom(room));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Xóa phòng
  delete: async (req, res) => {
    try {
      await roomService.deleteRoom(req.params.id);
      res.status(204).end(); // Không cần trả body khi xóa thành công
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = roomController;
