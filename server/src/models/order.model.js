import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
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
            },
            price: {
                type: Number
            }
        }
    ],
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    },
    billingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    },
    paymentMethod: { type: String, enum: ['credit_card', 'paypal', 'cash_on_delivery'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    orderStatus: { type: String, enum: ['pending', 'processed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    totalAmount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
})

const orders = mongoose.model("Orders", orderSchema)

export default orders