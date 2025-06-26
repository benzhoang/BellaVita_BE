const express = require('express');
const router = express.Router();
const AdCampaignController = require('../controllers/adCampaignController');
const { authenticateToken, authorizeRole } = require('../middlewares/authetication');

// Public routes
router.get('/', AdCampaignController.getAllAdCampaigns);
router.get('/:id', AdCampaignController.getAdCampaignById);

// Admin-only routes
router.post('/', authenticateToken, authorizeRole('admin'), AdCampaignController.createAdCampaign);
router.put('/:id', authenticateToken, authorizeRole('admin'), AdCampaignController.updateAdCampaign);
router.delete('/:id', authenticateToken, authorizeRole('admin'), AdCampaignController.deleteAdCampaign);

module.exports = router; 