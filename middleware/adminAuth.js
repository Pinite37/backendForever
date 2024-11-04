import jwt from "jsonwebtoken"
import crypto from "crypto"

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers
        console.log(token)
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const credentialsHash = crypto.createHash('sha256')
            .update(process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD)
            .digest('hex');

        if (decoded.credentialsHash !== credentialsHash) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        next();
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export default adminAuth