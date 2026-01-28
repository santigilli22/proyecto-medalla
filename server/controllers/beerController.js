import Beer from '../models/Beer.js';

export const getBeers = async (req, res) => {
    try {
        const beers = await Beer.find({}).sort({ id: 1 });
        res.json(beers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getBeerById = async (req, res) => {
    try {
        const beer = await Beer.findOne({ id: req.params.id });
        if (!beer) return res.status(404).json({ message: 'Beer not found' });
        res.json(beer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
