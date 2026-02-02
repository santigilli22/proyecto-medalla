import Rental from '../models/Rental.js';
import Keg from '../models/Keg.js';
import Customer from '../models/Customer.js';

export const getDashboardStats = async (req, res) => {
    try {
        const [
            totalIncomeResult,
            activeRentalsCount,
            totalKegsCount,
            lowStockKegsCount
        ] = await Promise.all([
            Rental.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
            Rental.countDocuments({ status: 'Retirado' }),
            Keg.countDocuments({}),
            Keg.countDocuments({ stock: { $lt: 5 } })
        ]);

        res.json({
            totalIncome: totalIncomeResult[0]?.total || 0,
            activeRentals: activeRentalsCount,
            totalKegs: totalKegsCount,
            lowStockKegs: lowStockKegsCount
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getSalesOverTime = async (req, res) => {
    try {
        const sales = await Rental.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$pickupDate" } },
                    total: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.json(sales);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getProductMix = async (req, res) => {
    try {
        const mix = await Rental.aggregate([
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "kegs",
                    localField: "items.keg",
                    foreignField: "_id",
                    as: "kegDetails"
                }
            },
            {
                $lookup: {
                    from: "beers",
                    localField: "items.beer",
                    foreignField: "_id",
                    as: "beerDetails"
                }
            },
            {
                $project: {
                    quantity: "$items.quantity",
                    kegSize: { $arrayElemAt: ["$kegDetails.size", 0] },
                    beerName: { $arrayElemAt: ["$beerDetails.name", 0] }
                }
            },
            {
                $group: {
                    _id: { beer: "$beerName", size: "$kegSize" },
                    value: { $sum: "$quantity" }
                }
            },
            { $sort: { value: -1 } }
        ]);

        const formatted = mix.map(m => ({
            name: `${m._id.beer || 'Cerveza'} ${m._id.size || ''}`,
            value: m.value
        }));

        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
// Breakdown by Payment Method
export const getPaymentMethodStats = async (req, res) => {
    try {
        const stats = await Rental.aggregate([
            { $group: { _id: "$paymentMethod", value: { $sum: 1 }, totalAmount: { $sum: "$amount" } } },
            { $sort: { value: -1 } }
        ]);
        const formatted = stats.map(s => ({
            name: s._id || 'Desconocido',
            value: s.value,
            totalAmount: s.totalAmount
        }));
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Top Customers by Revenue
export const getTopCustomers = async (req, res) => {
    try {
        const stats = await Rental.aggregate([
            { $group: { _id: "$customerName", totalSpent: { $sum: "$amount" }, count: { $sum: 1 } } },
            { $sort: { totalSpent: -1 } },
            { $limit: 5 }
        ]);
        const formatted = stats.map(s => ({
            name: s._id || 'Anónimo',
            totalSpent: s.totalSpent,
            count: s.count
        }));
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
