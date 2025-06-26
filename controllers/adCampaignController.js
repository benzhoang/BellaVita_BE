const AdCampaign = require('../models/adCampaignModel');

const AdCampaignController = {
  // Get all ad campaigns
  getAllAdCampaigns: async (req, res) => {
    try {
      const campaigns = await AdCampaign.findAll();
      res.json(campaigns);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get ad campaign by ID
  getAdCampaignById: async (req, res) => {
    try {
      const campaign = await AdCampaign.findByPk(req.params.id);
      if (!campaign) return res.status(404).json({ error: 'Ad campaign not found' });
      res.json(campaign);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Create a new ad campaign
  createAdCampaign: async (req, res) => {
    try {
      const campaign = await AdCampaign.create(req.body);
      res.status(201).json(campaign);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Update an ad campaign
  updateAdCampaign: async (req, res) => {
    try {
      const campaign = await AdCampaign.findByPk(req.params.id);
      if (!campaign) return res.status(404).json({ error: 'Ad campaign not found' });
      await campaign.update(req.body);
      res.json(campaign);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Delete an ad campaign
  deleteAdCampaign: async (req, res) => {
    try {
      const campaign = await AdCampaign.findByPk(req.params.id);
      if (!campaign) return res.status(404).json({ error: 'Ad campaign not found' });
      await campaign.destroy();
      res.json({ message: 'Ad campaign deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = AdCampaignController; 