import Partner from '../models/Partner.js';

export const getPartners = async (req, res) => {
    try {
        const partners = await Partner.find({ isActive: true });
        res.json(partners);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getPartnersNear = async (req, res) => {
    const { lat, lng, dist } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ message: 'Latitude (lat) and Longitude (lng) are required.' });
    }

    try {
        // Distance in meters (default 50km if not specified, usually closer is better but let's be generous for rural areas)
        const distanceInMeters = (parseFloat(dist) || 50) * 1000;

        const partners = await Partner.find({
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
                    $maxDistance: distanceInMeters
                }
            },
            isActive: true
        });

        res.json(partners);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Admin Methods
export const getAllPartnersAdmin = async (req, res) => {
    try {
        const partners = await Partner.find({}).sort({ createdAt: -1 });
        res.json(partners);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createPartner = async (req, res) => {
    try {
        const partner = new Partner(req.body);
        const newPartner = await partner.save();
        res.status(201).json(newPartner);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updatePartner = async (req, res) => {
    try {
        const updatedPartner = await Partner.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPartner);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deletePartner = async (req, res) => {
    try {
        await Partner.findByIdAndDelete(req.params.id);
        res.json({ message: 'Partner deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
