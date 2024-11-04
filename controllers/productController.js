import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// API for add product
const addProduct = async(req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter(image => image !== undefined) 
        if (!images || images.length === 0) {
            return res.status(400).json({ success: false, message: "Please upload at least one image" })
        }
        if(!name || !description || !price || !category || !subCategory || !sizes) {
            return res.status(400).json({ success: false, message: "Please fill all the fields" })
        }

        let imagesUrl = await Promise.all(images.map(async(item) => {
            let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" }) 
            return result.secure_url 
        }))

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()
        }

        console.log(productData) 

        const product = new productModel(productData)
        await product.save()

        res.status(200).json({ success: true, message: "Product added successfully", product }) 
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Internal server error" }) 
    }
}


// API for listing product
const listProducts = async(req, res) => {
    try {
        const products = await productModel.find({})
        res.status(200).json({ success: true, message: "Products fetched successfully", products }) 
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

// API for removing product
const removeProduct = async(req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.status(200).json({ success: true, message: "Product removed successfully" }) 
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Internal server error" }) 
    }
}

// API for single product info
const singleProduct = async(req, res) => {
    try {
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.status(200).json({ success: true, message: "Product fetched successfully", product })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export {
    addProduct, 
    listProducts,
    removeProduct,
    singleProduct
}