import express from 'express';
import { recommendBeer } from '../controllers/sommelierController.js';

const router = express.Router();

router.post('/recommend', recommendBeer);

export default router;
