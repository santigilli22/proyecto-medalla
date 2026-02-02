import express from 'express';
import { getCustomers, createCustomer, updateCustomer, getCustomerHistory, deleteCustomer } from '../controllers/customerController.js';

const router = express.Router();

router.get('/', getCustomers);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.get('/:id/history', getCustomerHistory);
router.delete('/:id', deleteCustomer);

export default router;
