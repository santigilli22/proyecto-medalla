import express from 'express';
import { getDashboardStats, getSalesOverTime, getProductMix, getPaymentMethodStats, getTopCustomers } from '../controllers/analyticsController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken); // Protect all analytics routes

router.get('/dashboard', getDashboardStats);
router.get('/sales', getSalesOverTime);
router.get('/products', getProductMix);
router.get('/payment-methods', getPaymentMethodStats);
router.get('/top-customers', getTopCustomers);

export default router;
