import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
    options: {
        type: Map,
        of: String,
        required: true,
    },
    sku: { type: String, unique: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    brand: { type: String, required: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Categories' }],
    mainImage: { type: String, required: true },
    images: [{ type: String }],
    variants: [variantSchema],

    seo: {
        title: { type: String },
        description: { type: String },
        keywords: [String],
    },

    ratings: {
        totalReviews: { type: Number, default: 0 },
        averageRating: { type: Number, default: 0 },
    },
    details: {
        material: { type: String },
        weight: { type: String },
        dimensions: { type: String },
        additionalInfo: { type: Map, of: String },
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

productSchema.index({ 'variants.options': 1 }, { unique: true });

module.exports = mongoose.model('Product', productSchema);
