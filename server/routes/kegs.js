import express from 'express';
import { getKegs, createKeg, updateKeg, deleteKeg } from '../controllers/kegController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/', getKegs);

// Admin Protected
router.post('/', verifyToken, createKeg);
router.put('/:id', verifyToken, updateKeg);
router.delete('/:id', verifyToken, deleteKeg);

export default router;
