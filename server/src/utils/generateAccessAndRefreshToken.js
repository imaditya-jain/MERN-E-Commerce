import Users from "../models/user.model.js"
import ApiError from "./ApiError.js"

export const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await Users.findById(userId)
        const refreshToken = user.generateRefreshToken()
        const accessToken = user.generateAccessToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        console.error('Error generating access and refresh token', error.message)
        throw new ApiError(500, 'Error generating access and refresh token')
    }
}