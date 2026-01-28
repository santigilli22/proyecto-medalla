import Beer from '../models/Beer.js';

export const recommendBeer = async (req, res) => {
    const { intensity, bitterness, sweetness, color } = req.body;

    try {
        // Fetch all beers to score them. 
        // In a larger DB, we might filter first, but for 6 beers, fetching all is fine.
        const beers = await Beer.find({});

        let bestMatch = null;
        let highestScore = -1;

        beers.forEach(beer => {
            let score = 0;

            // Simple Scoring Algorithm based on previous frontend logic maps
            // This can be enhanced significantly with more data attributes

            // 1. Bitterness Check
            // 'low' should match lower IBU, 'high' higher IBU
            if (bitterness === 'high' && beer.specs.ibu > 30) score += 2;
            else if (bitterness === 'low' && beer.specs.ibu <= 30) score += 2;

            // 2. Sweetness Check
            // 'sweet' matches Honey, Scottish, maybe Stout?
            // 'dry' matches Golden, IPAs
            const sweetnessTags = ['dulce', 'miel', 'choc', 'caramelo'];
            const isSweetBeer = beer.tags.some(t => sweetnessTags.some(st => t.toLowerCase().includes(st)));

            if (sweetness === 'sweet' && isSweetBeer) score += 2;
            else if (sweetness === 'dry' && !isSweetBeer) score += 2;

            // 3. Color Check
            // 'blonde' -> Golden, Honey
            // 'dark' -> Red, Rock (is dark-ish?), Scottish, Stout
            const isBlonde = ['rubias', 'golden'].includes(beer.category?.toLowerCase());
            if (color === 'blonde' && isBlonde) score += 3;
            else if (color === 'dark' && !isBlonde) score += 3;

            // 4. Intensity/Body Check
            // 'light' -> Golden, Honey
            // 'heavy' -> IPAs, Stout, Scottish
            // Using ABV as a proxy for body/intensity for now
            const abvVal = parseFloat(beer.specs.abv);
            if (intensity === 'light' && abvVal < 5.6) score += 2;
            else if (intensity === 'heavy' && abvVal >= 5.6) score += 2;

            if (score > highestScore) {
                highestScore = score;
                bestMatch = beer;
            }
        });

        if (!bestMatch) {
            // Fallback
            bestMatch = beers[0];
        }

        res.json(bestMatch);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
