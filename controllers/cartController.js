import userModel from "../models/userModel.js"

// add products to user cart
const  addToCart = async (req, res) => {
    try {
        const { userId, itemId, size } = req.body

        const userData = await userModel.findById(userId) 

        let cartData = await userData.cartData

        if(cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1
            } else {
                cartData[itemId][size] = 1 
            }
        } else {
            cartData[itemId] = {} 
            cartData[itemId][size] = 1 
        }

        await userModel.findByIdAndUpdate(userId, { cartData })
        res.status(200).json({ success: true, message: "Added to cart" })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
    
}

// upadate products to user cart
const updateToCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body

        const userData = await userModel.findById(userId)

        let cartData = await userData.cartData

        cartData[itemId][size] = quantity 

        
        await userModel.findByIdAndUpdate(userId, { cartData })
        res.status(200).json({ success: true, message: "Updated to cart" }) 
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

// get products to user cart

const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId)
        const cartData = await userData.cartData
        res.status(200).json({ success: true, cartData  }) 
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export {
    addToCart,
    updateToCart,
    getUserCart
}