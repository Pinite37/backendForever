import jwt from "jsonwebtoken"

const authUser = async (req, res, next) => {
    const { token } = req.headers
    console.log(token)
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.body.userId = token_decode.id
        next()
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export default authUser