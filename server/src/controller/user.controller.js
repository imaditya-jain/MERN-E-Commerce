import bcrypt from "bcryptjs"
import Users from "../models/user.model.js"
import { ApiError, asyncHandler, ApiResponse } from "../utils/index.js"

export const updateUser = asyncHandler(async (req, res, next) => {
    if (req.method !== "PATCH") throw new ApiError(405, 'Method not allowed.')

    const { name, email, password, avatar } = req.body

    const updatedFields = {}
    if (name) updatedFields.name = name
    if (email) updatedFields.email = email
    if (password) updatedFields.password = await bcrypt.hash(password, 10)
    if (avatar) updatedFields.avatar = avatar

    const updatedUser = await Users.findByIdAndUpdate(req.user._id, { $set: updatedFields }, { new: true, runValidators: true }).select('-password -refreshToken -otp')

    if (!updatedUser) throw new ApiError(404, 'User not found.')

    return res.status(200).json(new ApiResponse(200, updatedUser, 'User updated successfully.'))
})

export const getUser = asyncHandler(async (req, res, next) => {
    if (req.method !== "GET") throw new ApiError(405, 'Method not allowed.')

    const user = await Users.findById(req.user._id).select('-password -refreshToken -otp')
    if (!user) throw new ApiError(404, 'User not found.');

    return res.status(200).json(new ApiResponse(200, user, ''))
})

export const getAdminUsers = asyncHandler(async (req, res, next) => {
    if (req.method !== "GET") throw new ApiError(405, 'Method not allowed.')
    const users = await Users.find({ role: "admin" }).select('-password -refreshToken -otp')

    return res.status(200).json(new ApiResponse(200, users, ''))
})

export const deleteUser = asyncHandler(async (req, res, next) => {

})