import express from 'express';
import { getRentals, createRental, updateRental, deleteRental } from '../controllers/rentalController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All rentals routes are admin protected for now
router.get('/', verifyToken, getRentals);
router.post('/', verifyToken, createRental);
router.put('/:id', verifyToken, updateRental);
router.delete('/:id', verifyToken, deleteRental);

export default router;
