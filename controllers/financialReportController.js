const FinancialReport = require('../models/financialReportModel');

const FinancialReportController = {
  // Get all financial reports
  getAllFinancialReports: async (req, res) => {
    try {
      const reports = await FinancialReport.findAll();
      res.json(reports);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get financial report by ID
  getFinancialReportById: async (req, res) => {
    try {
      const report = await FinancialReport.findByPk(req.params.id);
      if (!report) return res.status(404).json({ error: 'Financial report not found' });
      res.json(report);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Create new financial report
  createFinancialReport: async (req, res) => {
    try {
      const report = await FinancialReport.create(req.body);
      res.status(201).json(report);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Update financial report
  updateFinancialReport: async (req, res) => {
    try {
      const report = await FinancialReport.findByPk(req.params.id);
      if (!report) return res.status(404).json({ error: 'Financial report not found' });
      await report.update(req.body);
      res.json(report);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Delete financial report
  deleteFinancialReport: async (req, res) => {
    try {
      const report = await FinancialReport.findByPk(req.params.id);
      if (!report) return res.status(404).json({ error: 'Financial report not found' });
      await report.destroy();
      res.json({ message: 'Financial report deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = FinancialReportController; 