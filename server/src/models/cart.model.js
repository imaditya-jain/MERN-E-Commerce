import mongoose from "mongoose";

const cartSchems = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    totalPrice: {
        type: Number,
        default: 0
    },
    totalItems: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const Carts = mongoose.model("Carts", cartSchems)

export default Carts