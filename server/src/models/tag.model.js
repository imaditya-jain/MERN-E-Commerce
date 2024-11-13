import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    slug: { type: String, unique: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Tag', tagSchema);
