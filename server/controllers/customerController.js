import Customer from '../models/Customer.js';
import Rental from '../models/Rental.js';

// Get all customers
export const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.aggregate([
            {
                $lookup: {
                    from: 'rentals',
                    let: { c_phone: '$phone', c_name: '$name' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [
                                        { $eq: ['$contact', '$$c_phone'] },
                                        { $eq: ['$customerName', '$$c_name'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'rentals'
                }
            },
            {
                $addFields: {
                    totalRentals: { $size: '$rentals' }, // Overwrite stored value with computed
                    totalSpent: { $sum: '$rentals.amount' },
                    lastRentalDate: { $max: '$rentals.createdAt' }
                }
            },
            { $project: { rentals: 0 } },
            { $sort: { updatedAt: -1 } }
        ]);
        res.status(200).json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create or Update (Upsert) - Helper for internal use mainly
export const upsertCustomerInternal = async (customerData) => {
    const { name, phone, email, address } = customerData;
    if (!phone) return null;

    try {
        const customer = await Customer.findOneAndUpdate(
            { phone },
            {
                $set: { name, email, ...(address && { address }) },
                $inc: { totalRentals: 1 },
                $max: { lastRentalDate: new Date() }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        return customer;
    } catch (err) {
        console.error("Error upserting customer:", err);
        return null; // Don't block flow if tracking fails
    }
};

// Manual Create
export const createCustomer = async (req, res) => {
    try {
        const newCustomer = new Customer(req.body);
        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update
export const updateCustomer = async (req, res) => {
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get History
export const getCustomerHistory = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: "Cliente no encontrado" });

        // Search rentals by contact (phone) or name match
        // Note:Ideally we should link Rental to Customer ID, but for existing system we use contact match
        const history = await Rental.find({
            $or: [
                { contact: customer.phone },
                { customerName: customer.name } // Fallback
            ]
        }).sort({ pickupDate: -1 }).populate('items.keg').populate('items.beer');

        res.status(200).json(history);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete
export const deleteCustomer = async (req, res) => {
    try {
        await Customer.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Cliente eliminado" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
