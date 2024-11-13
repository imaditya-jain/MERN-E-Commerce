import Users from "../models/user.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { sendOtpVerificationMail } from '../utils/sendOtpVerificationMail.js';
import { generateAccessAndRefreshToken } from '../utils/generateAccessAndRefreshToken.js';
import jwt from 'jsonwebtoken';

export const createUser = asyncHandler(async (req, res, next) => {
    if (req.method !== 'POST') throw new ApiError(405, 'Method not allowed')

    const { name, email, password, role, avatar } = req.body;
    if (!name || !email || !password || !role || !avatar) throw new ApiError(400, 'All fields are required.')

    const existingUser = await Users.findOne({ email })
    if (existingUser) throw new ApiError(409, 'User already exists.')

    const user = await Users.create({ name, email, password, role, avatar })

    const createdUser = await Users.findById(user._id).select('-password -refreshToken -otp')
    if (!createdUser) throw new ApiError(500, 'User creation error: Something went wrong.')

    return res.status(201).json(new ApiResponse(200, createdUser, 'User created successfully.'))
})

export const loginUser = asyncHandler(async (req, res, next) => {
    if (req.method !== "POST") throw new ApiError(405, 'Method not allowed.')

    const { email, password } = req.body
    if (!email || !password) throw new ApiError(400, 'All fields are required.')

    const user = await Users.findOne({ email })
    if (!user) throw new ApiError(404, 'User not found.')

    const isPasswordMatch = await user.matchPassword(password)
    if (!isPasswordMatch) throw new ApiError(401, 'Invalid credentials.')

    sendOtpVerificationMail(user._id, user.email, res)
})

export const verifyOTP = asyncHandler(async (req, res, next) => {
    if (req.method !== "POST") throw new ApiError(405, 'Method not allowed.')

    const { email, otp } = req.body
    if (!email || !otp) throw new ApiError(400, 'All fields are required.')

    const user = await Users.findOne({ email }).select('-password -refreshToken')
    if (!user) throw new ApiError(404, 'User not found.')

    const isOtpMatch = await user.matchOTP(otp)
    if (!isOtpMatch) throw new ApiError(401, 'Invalid OTP.')

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await Users.findByIdAndUpdate(user._id, { otp: null }).select('-password -refreshToken')
    if (!loggedInUser) throw new ApiError(500, 'User login error: Something went wrong.')

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200).cookie('refreshToken', refreshToken, options).cookie('accessToken', accessToken, options).json(new ApiResponse(200, loggedInUser, 'User logged in successfully.', refreshToken, accessToken))
})

export const logoutUser = asyncHandler(async (req, res, next) => {
    await Users.findByIdAndUpdate(req.user._id, { $set: { refreshToken: null } })
    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200).clearCookie('refreshToken', options).clearCookie('accessToken', options).json(new ApiResponse(200, 'User logged out successfully.'))
})

export const refreshAccessToken = asyncHandler(async (req, res, next) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
        if (!incomingRefreshToken) throw new ApiError(401, 'Unauthorized access.')

        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await Users.findById(decodedToken._id).select('-password -otp')
        if (!user) throw new ApiError(401, 'Invalid refresh token.')

        if (incomingRefreshToken !== user.refreshToken) throw new ApiError(401, 'Refresh token expired or used. Please login again.')

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

        const options = {
            httpOnly: true,
            secure: true,
        }

        return res.status(200).cookie('refreshToken', refreshToken, options).cookie('accessToken', accessToken, options).json(new ApiResponse(200, user, 'Access token refreshed successfully.', refreshToken, accessToken))
    } catch (error) {
        console.error('Error refreshing access token', error.message)
        throw new ApiError(500, 'Error refreshing access token')
    }
})

