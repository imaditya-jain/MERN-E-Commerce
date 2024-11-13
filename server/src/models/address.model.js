import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    flat: {
        type: String,
        trim: true,
        required: true
    },
    street: {
        type: String,
        trim: true,
        required: true
    },
    landmark: {
        type: String,
        trim: true,
        required: true
    },
    city: {
        type: String,
        trim: true,
        required: true
    },
    state: {
        type: String,
        trim: true,
        required: true
    },
    country: {
        type: String,
        trim: true,
        required: true
    },
    pincode: {
        type: String,
        trim: true,
        required: true
    }
}, { timestamps: true });

const Address = mongoose.model("Address", addressSchema);

export default Address