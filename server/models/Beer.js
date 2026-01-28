import mongoose from 'mongoose';

const BeerSchema = new mongoose.Schema({
    id: { type: Number, unique: true }, // Legacy ID
    name: { type: String, required: true },
    titleImg: String,
    persona: String,
    category: String,
    style: String,
    specs: {
        abv: String,
        ibu: Number,
        srm: Number
    },
    color: String, // Tailwind class
    images: {
        main: String,
        detail: String
    },
    tags: [String]
}, { timestamps: true });

export default mongoose.model('Beer', BeerSchema);
