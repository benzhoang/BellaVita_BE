const AdminLog = require('../models/adminLogModel');

const AdminLogController = {
  // Lấy tất cả admin log
  getAllAdminLogs: async (req, res) => {
    try {
      const logs = await AdminLog.findAll();
      res.json(logs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Lấy admin log theo id
  getAdminLogById: async (req, res) => {
    try {
      const log = await AdminLog.findByPk(req.params.id);
      if (!log) return res.status(404).json({ error: 'Admin log not found' });
      res.json(log);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Tạo admin log mới
  createAdminLog: async (req, res) => {
    try {
      const log = await AdminLog.create(req.body);
      res.status(201).json(log);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Cập nhật admin log
  updateAdminLog: async (req, res) => {
    try {
      const log = await AdminLog.findByPk(req.params.id);
      if (!log) return res.status(404).json({ error: 'Admin log not found' });
      await log.update(req.body);
      res.json(log);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Xóa admin log
  deleteAdminLog: async (req, res) => {
    try {
      const log = await AdminLog.findByPk(req.params.id);
      if (!log) return res.status(404).json({ error: 'Admin log not found' });
      await log.destroy();
      res.json({ message: 'Admin log deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = AdminLogController;