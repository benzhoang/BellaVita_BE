const express = require('express');
const router = express.Router();
const AdminLogController = require('../controllers/adminLogController');

router.get('/', AdminLogController.getAllAdminLogs);
router.get('/:id', AdminLogController.getAdminLogById);
router.post('/', AdminLogController.createAdminLog);
router.put('/:id', AdminLogController.updateAdminLog);
router.delete('/:id', AdminLogController.deleteAdminLog);

module.exports = router;