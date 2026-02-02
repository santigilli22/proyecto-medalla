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

export const createBeer = async (req, res) => {
    try {
        const beer = new Beer(req.body);
        const newBeer = await beer.save();
        res.status(201).json(newBeer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateBeer = async (req, res) => {
    try {
        const updatedBeer = await Beer.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        res.json(updatedBeer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteBeer = async (req, res) => {
    try {
        await Beer.findOneAndDelete({ id: req.params.id });
        res.json({ message: 'Beer deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
