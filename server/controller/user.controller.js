import Users from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createAccessToken, createRefreshToken } from "../utils/auth.js"

export const registerUserController = async (req, res) => {
    try {
        if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed', success: false })

        const { name, email, password } = req.body

        if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required.', success: false })

        const existingUser = await Users.findOne({ email })

        if (existingUser) return res.status(409).json({ message: "User already exists.", success: false })

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new Users({ name, email, password: hashedPassword })

        await newUser.save()

        const accessToken = await createAccessToken({ id: newUser._id })
        const refreshToken = await createRefreshToken({ id: newUser._id })

        res.cookie('refreshToken', refreshToken, { httpOnly: true, path: "/" })

        return res.status(201).json({ message: 'User registered successfully.', success: true, accessToken })

    } catch (error) {
        console.error('Error registering user:', error.message)
        return req.status(500).json({ message: 'Internal Server Error' })
    }
}

export const refreshTokenController = async (req, res) => {
    try {
        if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed', success: false })

        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) return res.status(401).json({ message: 'Unauthorized', success: false })

        const userVerified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

        if (!userVerified) return res.status(403).json({ message: 'Forbidden', success: false })

        const accessToken = await createAccessToken({ id: userVerified.id })

        return res.status(200).json({ user: userVerified, accessToken, success: true })
    } catch (error) {
        console.error('Error refreshing token:', error.message)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const loginController = async (req, res) => {
    try {
        if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed', success: false })

        const { email, password } = req.body

        if (!email || !password) return res.status(400).json({ message: 'All fields are required.', success: false })

        const user = await Users.findOne({ email })

        if (!user) return res.status(404).json({ message: 'User not found.', success: false })

        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if (!isPasswordMatch) return res.status(401).json({ message: 'Invalid credentials.', success: false })

        const accessToken = await createAccessToken({ id: user._id })
        const refreshToken = await createRefreshToken({ id: user._id })

        res.cookie('refreshToken', refreshToken, { httpOnly: true, path: "/" })

        res.status(200).json({ message: 'User logged in successfully.', accessToken, success: true })

    } catch (error) {
        console.error('Error logging in user:', error.message)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const logoutController = async (req, res) => {
    try {
        if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed', success: false })
        res.clearCookie('refreshToken', { path: '/' })
        return res.status(200).json({ message: 'User logged out successfully.', success: true })
    } catch (error) {
        console.error('Error logging out user:', error.message)
        return res.status(500).json({ message: 'Internal Server Error', success: false })
    }
}

export const getUserController = async (req, res) => {
    try {
        const user = await Users.findById(req.user.id).select('-password')

        if (!user) return res.status(404).json({ message: 'User not found', success: false })

        return res.status(200).json({ user, success: true })

    } catch (error) {
        console.error('Error getting user:', error.message)
        return res.status(500).json({ message: 'Internal Server Error', success: false })
    }
}