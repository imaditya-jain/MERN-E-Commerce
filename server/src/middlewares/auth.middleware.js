import jwt from 'jsonwebtoken'
import Users from '../models/user.model.js'
import { ApiError } from "../utils/index.js"

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req.header("Authorization")?.replace('Bearer ', '')
        if (!token) throw new ApiError(401, 'Unauthorized access.')

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await Users.findById(decodedToken._id).select('-password -refreshToken -otp')
        if (!user) throw new ApiError(401, 'Invalid access token.')

        req.user = user
        next()
    } catch (error) {
        console.error('Auth Middleware Error:', error.message)
        throw new ApiError(401, 'Invalid access token.')
    }
}

export default authMiddleware