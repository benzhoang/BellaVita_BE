const InventoryAlert = require('../models/inventoryAlertModel');

const InventoryAlertController = {
  // Get all inventory alerts
  getAllInventoryAlerts: async (req, res) => {
    try {
      const alerts = await InventoryAlert.findAll();
      res.json(alerts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get inventory alert by ID
  getInventoryAlertById: async (req, res) => {
    try {
      const alert = await InventoryAlert.findByPk(req.params.id);
      if (!alert) return res.status(404).json({ error: 'Inventory alert not found' });
      res.json(alert);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Create new inventory alert
  createInventoryAlert: async (req, res) => {
    try {
      const alert = await InventoryAlert.create(req.body);
      res.status(201).json(alert);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Update inventory alert
  updateInventoryAlert: async (req, res) => {
    try {
      const alert = await InventoryAlert.findByPk(req.params.id);
      if (!alert) return res.status(404).json({ error: 'Inventory alert not found' });
      await alert.update(req.body);
      res.json(alert);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Delete inventory alert
  deleteInventoryAlert: async (req, res) => {
    try {
      const alert = await InventoryAlert.findByPk(req.params.id);
      if (!alert) return res.status(404).json({ error: 'Inventory alert not found' });
      await alert.destroy();
      res.json({ message: 'Inventory alert deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = InventoryAlertController; 