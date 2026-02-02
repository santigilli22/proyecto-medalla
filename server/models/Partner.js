import mongoose from 'mongoose';

const PartnerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: {
        type: String,
        required: true
    },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true } // [lng, lat]
    },
    locationDetails: {
        address: String,
        city: String,
        province: String,
        region: String // "Zona Santa Fe", "Zona Córdoba"
    },
    contact: {
        phone: String,
        instagram: String,
        facebook: String,
        mail: String,
        website: String
    },
    features: [String],
    varieties: [String],
    isOfficial: { type: Boolean, default: false },
    logo: String,
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

PartnerSchema.index({ location: '2dsphere' });

export default mongoose.model('Partner', PartnerSchema);
