import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: true
    },
    avatar: {
        type: String,
    },
    addresses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address"
        }
    ],
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Carts"
        }
    ],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        }
    ],
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    otp: {
        type: String,
        default: null
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.matchOTP = async function (enteredOTP) {
    return await bcrypt.compare(enteredOTP, this.otp)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ _id: this._id, name: this.name, email: this.email, role: this.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ _id: this._id, }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

const Users = mongoose.model("Users", userSchema);

export default Users