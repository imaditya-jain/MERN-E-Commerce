import Users from "../models/user.model.js";

export const adminAuthMiddleware = async (req, res, next) => {
    try {
        const user = await Users.findById(req.user.id)

        if (!user) return res.status(404).json({ message: 'User not found', success: false })

        if (user.role !== 0) return res.status(403).json({ message: 'Forbidden', success: false })

        req.user = user
        next()
    } catch (error) {
        console.error(`Error authenticating admin: ${error.message}`)
        res.status(500).json({ message: 'Internal Server Error', success: false })
    }
}