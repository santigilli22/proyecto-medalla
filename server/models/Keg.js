import mongoose from 'mongoose';

const KegSchema = new mongoose.Schema({
    size: { type: String, required: true }, // "10 Litros", etc.
    serves: String, // "~20 Pintas"
    ideal: String, // "Pequeñas Reuniones"
    price: { type: String, default: "Consultar" },
    stock: { type: Number, default: 0 },
    iconSize: Number,
    img: String, // URL
    description: String,
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Keg', KegSchema);
