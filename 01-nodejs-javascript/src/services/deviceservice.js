const Device = require('../models/device');
const Room = require("../models/room");
const deviceService = {
  createDevice: async (data) => {
    const device = await Device.create(data);
  return await Device.findById(device._id)
    .populate({
      path: 'room',
      select: 'name building',
      populate: {
        path: 'building',
        select: 'name address'
      }
    });
  },

  getAllDevices: async () => {
    return await Device.find()
      .populate({
        path: 'room',
        select: 'name building',
        populate: {
          path: 'building',
          select: 'name address'
        }
      });
  },

  getDevicesByRoom: async (roomId) => {
    return await Device.find({ room: roomId })
      .populate({
        path: 'room',
        select: 'name building',
        populate: {
          path: 'building',
          select: 'name address'
        }
      });
  },

  updateDevice: async (id, data) => {
    return await Device.findByIdAndUpdate(id, data, { new: true })
      .populate({
        path: 'room',
        select: 'name building',
        populate: {
          path: 'building',
          select: 'name address'
        }
      });
  },

  deleteDevice: async (id) => {
    return await Device.findByIdAndDelete(id)
      .populate({
        path: 'room',
        select: 'name building',
        populate: {
          path: 'building',
          select: 'name address'
        }
      });
  }
};

module.exports = deviceService;
