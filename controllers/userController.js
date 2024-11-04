import userModel from "../models/userModel.js"
import validator from "validator"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
}


// API for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        } 
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" })
        }
        const token = createToken(user._id)
        res.status(200).json({ success: true, message: "User logged in successfully", token })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Internal server error" }) 
    }
    
}

// API for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        // checking user aleady exist or not 
        const exits = await userModel.findOne({ email })

        if (exits) {
            return res.status(400).json({ success: false, message: "User aleady exist" })
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" })
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character" })
        }

        // hashing user password 
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({ name, email, password: hashedPassword })
        const user = await newUser.save()
        
        // creating jwt token
        const token = createToken(user._id)

        res.status(200).json({ success: true, message: "User created successfully", token })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
} 

// API for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ success: false, message: "Échec de la connexion" });
        }

        // Créer un hash basé sur email + password
        const credentialsHash = crypto.createHash('sha256').update(email + password).digest('hex');
        const token = jwt.sign({ credentialsHash }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        res.status(200).json({ success: true, message: "Admin connecté avec succès", token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Erreur interne du serveur" });
    }
};


export { loginUser, registerUser, adminLogin  }