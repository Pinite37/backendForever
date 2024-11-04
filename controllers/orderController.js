import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"

// PLacing order using COD Method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now(), 
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, { cartData: {} } )

        res.status(200).json({ success: true, message: "Order Placed Successfully" })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Internal server error" }) 
    }
}

// PLacing order using Fedapay Method
const placeOrderFedapay = async (req, res) => {

}

// All orders data for Admin Panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.status(200).json({ success: true, orders })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

// User orders data for frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId })
        res.status(200).json({ success: true, orders }) 
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

// update orders status for Admin Panel
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.status(200).json({ success: true, message: "Order status updated successfully" })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
} 

export {
    placeOrder,
    placeOrderFedapay,
    allOrders,
    userOrders,
    updateOrderStatus
}