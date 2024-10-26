import jwt from 'jsonwebtoken'

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")
        if (!token) return res.status(401).json({ message: 'Unauthorized', success: false })

        const userVerified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log(userVerified)

        if (!userVerified) return res.status(403).json({ message: 'Forbidden', success: false })
        req.user = userVerified
        next()

    } catch (error) {
        console.error(`Error authenticating user: ${error.message}`)
        res.status(500).json({ message: 'Internal Server Error', success: false })
    }
}

export default authMiddleware