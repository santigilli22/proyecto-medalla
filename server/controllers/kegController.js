import Keg from '../models/Keg.js';

// Get all Kegs
export const getKegs = async (req, res) => {
    try {
        const kegs = await Keg.find({ isActive: true });
        res.json(kegs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Admin: Create Keg
export const createKeg = async (req, res) => {
    try {
        const keg = new Keg(req.body);
        await keg.save();
        res.status(201).json(keg);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Admin: Update Keg
export const updateKeg = async (req, res) => {
    try {
        const keg = await Keg.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!keg) return res.status(404).json({ message: 'Keg not found' });
        res.json(keg);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Admin: Delete Keg (Soft Delete)
export const deleteKeg = async (req, res) => {
    try {
        // We'll just hard delete for simplicity as per other controllers, or soft delete if preferred.
        // Let's hard delete to match others for now.
        const keg = await Keg.findByIdAndDelete(req.params.id);
        if (!keg) return res.status(404).json({ message: 'Keg not found' });
        res.json({ message: 'Keg deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
