import express from 'express';
import { getEvents, getAllEvents, createEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/', getEvents);

// Admin (Protected)
router.get('/all', verifyToken, getAllEvents);
router.post('/', verifyToken, createEvent);
router.put('/:id', verifyToken, updateEvent);
router.delete('/:id', verifyToken, deleteEvent);

export default router;
