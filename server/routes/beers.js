import express from 'express';
import { getBeers, getBeerById, createBeer, updateBeer, deleteBeer } from '../controllers/beerController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getBeers);
router.get('/:id', getBeerById);

// Admin
router.post('/', verifyToken, createBeer);
router.put('/:id', verifyToken, updateBeer);
router.delete('/:id', verifyToken, deleteBeer);

export default router;
