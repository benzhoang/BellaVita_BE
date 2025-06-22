const express = require('express');
const router = express.Router();
const FinancialReportController = require('../controllers/financialReportController');
const { authenticateToken, authorizeRole } = require('../middlewares/authetication');

// All routes require admin role
router.use(authenticateToken, authorizeRole('admin'));

router.get('/', FinancialReportController.getAllFinancialReports);
router.get('/:id', FinancialReportController.getFinancialReportById);
router.post('/', FinancialReportController.createFinancialReport);
router.put('/:id', FinancialReportController.updateFinancialReport);
router.delete('/:id', FinancialReportController.deleteFinancialReport);

module.exports = router; 