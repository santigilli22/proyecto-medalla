import express from 'express';
import { getPartners, getPartnersNear } from '../controllers/partnerController.js';

const router = express.Router();

router.get('/', getPartners);
router.get('/near', getPartnersNear);

export default router;
