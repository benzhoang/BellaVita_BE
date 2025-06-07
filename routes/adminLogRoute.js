const express = require('express');
const router = express.Router();
const AdminLogController = require('../controllers/adminLogController');
const { authenticateToken, authorizeRole } = require('../middlewares/authetication');

router.get('/', authenticateToken, authorizeRole('admin'), AdminLogController.getAllAdminLogs);
router.get('/:id', authenticateToken, authorizeRole('admin'), AdminLogController.getAdminLogById);
router.post('/', authenticateToken, authorizeRole('admin'), AdminLogController.createAdminLog);
router.put('/:id', authenticateToken, authorizeRole('admin'), AdminLogController.updateAdminLog);
router.delete('/:id', authenticateToken, authorizeRole('admin'), AdminLogController.deleteAdminLog);

module.exports = router;