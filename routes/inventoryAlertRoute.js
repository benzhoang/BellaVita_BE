const express = require('express');
const router = express.Router();
const InventoryAlertController = require('../controllers/inventoryAlertController');
const { authenticateToken, authorizeRole } = require('../middlewares/authetication');

// All routes require admin role
router.use(authenticateToken, authorizeRole('admin'));

router.get('/', InventoryAlertController.getAllInventoryAlerts);
router.get('/:id', InventoryAlertController.getInventoryAlertById);
router.post('/', InventoryAlertController.createInventoryAlert);
router.put('/:id', InventoryAlertController.updateInventoryAlert);
router.delete('/:id', InventoryAlertController.deleteInventoryAlert);

module.exports = router; 