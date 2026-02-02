import Rental from '../models/Rental.js';
import Keg from '../models/Keg.js';
import { upsertCustomerInternal } from './customerController.js';

// Get all rentals
export const getRentals = async (req, res) => {
    try {
        // Populate keg details in items
        const rentals = await Rental.find().populate('items.keg').sort({ pickupDate: -1 });
        res.json(rentals);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create Rental (Decreases Stock)
export const createRental = async (req, res) => {
    try {
        const { items } = req.body;

        // 1. Check availability
        for (const item of items) {
            const keg = await Keg.findById(item.keg);
            if (!keg) throw new Error(`Barril no encontrado`);
            if (keg.stock < item.quantity) throw new Error(`Stock insuficiente para ${keg.size}`);
        }

        // 2. Decrease Stock
        for (const item of items) {
            await Keg.findByIdAndUpdate(item.keg, { $inc: { stock: -item.quantity } });
        }

        // 3. Create Rental
        const rental = new Rental(req.body);
        await rental.save();

        // 4. Update Customer Stats (CRM)
        if (rental.contact) {
            await upsertCustomerInternal({
                name: rental.customerName,
                phone: rental.contact,
                // We could capture more if form had it, but this is minimal
            });
        }

        // Return populated rental
        const populatedRental = await Rental.findById(rental._id).populate('items.keg');
        res.status(201).json(populatedRental);
    } catch (err) {
        // Note: In a production standalone env, if step 3 fails, we might have inconsistent stock.
        // For this scale, it's an acceptable tradeoff vs setting up a replica set.
        res.status(400).json({ message: err.message });
    }
};

// Update Rental (Check for Return to Increase Stock)
export const updateRental = async (req, res) => {
    try {
        const { status, returnDate } = req.body;
        const rental = await Rental.findById(req.params.id).populate('items.keg');

        if (!rental) throw new Error('Alquiler no encontrado');

        const oldStatus = rental.status;

        // Update fields
        Object.assign(rental, req.body);

        // logic: If changing to 'Devuelto' from non-devuelto, restore stock
        if (status === 'Devuelto' && oldStatus !== 'Devuelto') {
            if (!returnDate) rental.returnDate = new Date();

            for (const item of rental.items) {
                const kegId = item.keg._id || item.keg;
                const quantity = item.quantity;
                await Keg.findByIdAndUpdate(kegId, { $inc: { stock: quantity } });
            }
        }

        // If reversing from 'Devuelto' to 'Retirado' (oops mistake), decrease stock again
        if (oldStatus === 'Devuelto' && status !== 'Devuelto') {
            rental.returnDate = null; // Clear return date
            for (const item of rental.items) {
                const kegId = item.keg._id || item.keg;
                const quantity = item.quantity;
                await Keg.findByIdAndUpdate(kegId, { $inc: { stock: -quantity } });
            }
        }

        await rental.save();

        res.json(rental);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteRental = async (req, res) => {
    try {
        // Warning: Deleting a rental does NOT automatically restore stock in this simple implementation
        // unless we add logic. For now, assume admin handles stock manually if deleting a mistake.
        await Rental.findByIdAndDelete(req.params.id);
        res.json({ message: 'Alquiler eliminado' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

import mongoose from 'mongoose';
