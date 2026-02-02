import express from 'express';
import { getPartners, getPartnersNear, getAllPartnersAdmin, createPartner, updatePartner, deletePartner } from '../controllers/partnerController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPartners);
router.get('/near', getPartnersNear);

// Admin
router.get('/all', verifyToken, getAllPartnersAdmin);
router.post('/', verifyToken, createPartner);
router.put('/:id', verifyToken, updatePartner);
router.delete('/:id', verifyToken, deletePartner);

export default router;
