import mongoose from 'mongoose';

const RentalSchema = new mongoose.Schema({
    pickupDate: Date,
    returnDate: Date,
    customerName: { type: String, required: true },
    contact: String,

    items: [{
        keg: { type: mongoose.Schema.Types.ObjectId, ref: 'Keg', required: true },
        beer: { type: mongoose.Schema.Types.ObjectId, ref: 'Beer' }, // Cerveza elegida
        quantity: { type: Number, required: true, min: 1 },
        barrelIds: [{ type: String }] // N° de Barril (puede ser más de uno)
    }],

    amount: Number,
    isPaid: { type: Boolean, default: false },
    paymentMethod: { type: String, enum: ['Efectivo', 'Transferencia', 'Otro'], default: 'Efectivo' },
    notes: String,
    status: { type: String, enum: ['Reservado', 'Retirado', 'Devuelto'], default: 'Reservado' }
}, { timestamps: true });

export default mongoose.model('Rental', RentalSchema);
