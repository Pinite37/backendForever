import express from 'express'

import { placeOrder, placeOrderFedapay, allOrders, userOrders, updateOrderStatus } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'


const orderRouter = express.Router()


// Admin Features
orderRouter.get("/list",adminAuth, allOrders)
orderRouter.post("/status", adminAuth, updateOrderStatus)

// Payment Features
orderRouter.post("/place",authUser,  placeOrder)
orderRouter.post("/place/fedapay", authUser, placeOrderFedapay)

// User Features
orderRouter.get("/userorders", authUser, userOrders)


export default orderRouter