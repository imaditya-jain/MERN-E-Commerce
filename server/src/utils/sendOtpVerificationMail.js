import transporter from "../config/nodemailer.config.js";
import Users from "../models/user.model.js";
import ApiError from "./ApiError.js"
import ApiResponse from "./apiResponse.js";
import bcrypt from "bcryptjs"

function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

export const sendOtpVerificationMail = async (id, email, res) => {
    const otp = `${generateOTP()}`;
    const mailOptions = {
        from: process.env.USER_EMAIL,
        to: email,
        subject: "Verify Your Email",
        html: `<p> Enter <b>${otp} </b> in the app to verify your email address and complete signup</p><p>This code <b> expires in 1 hour </b></p>`,
    };

    const hashedOTP = await bcrypt.hash(otp, 10);

    const user = await Users.findByIdAndUpdate(id, { otp: hashedOTP }).select('-password -refreshToken -otp')
    if (!user) throw new ApiError(500, 'Failed to send OTP')

    await transporter.sendMail(mailOptions)

    return res.status(200).json(new ApiResponse(200, 'Otp sent.'))
}