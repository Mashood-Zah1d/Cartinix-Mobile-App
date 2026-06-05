import Product from '../Model/Product.Model.js'
import { asyncFuction } from '../Utils/asyncFunction.js'
import apiError from '../Utils/apiError.js'
import { uploadonCloudinary } from '../Utils/Cloudinary.js'
import apiResponse from '../Utils/apiResponse.js'
import mongoose, { Mongoose } from 'mongoose'
export const viewProduct = asyncFuction(async(res, req) => {
    const { title, description, price, brand } = req.body;

    if ([title, description, price, brand].some((feild) => feild?.trim() === "")) {
        throw new apiError(400, "Incomplete Details");
    }

    let images = req.files?.images

    if (!images) {
        throw new apiError(400, "Image Missing!")
    }

    if (Array.isArray(images)) {
        image = await uploadonCloudinary(images)

        if (!image) {
            throw new apiError(500, "System Haulted Uploading File Retry")
        }
    }

    for (let i = 0; i < images.length; i++) {
       image = await uploadonCloudinary(images[i]);

        if (!image) {
            throw new apiError(500, "System Haulted Uploading File Retry")
        }
    }

    const product = Product.create({
        title,description,price,image,brand
    })

    if(!product){
        throw new apiError(500,"Error Uploading Product");
    }

   const createdProduct = await Product.findOne({ _id: product._id })
    
    
        res.status(200).json(
            new apiResponse(200, createdProduct, "Product Created Successfully"))
})

export const getProducts = asyncFuction(async (req, res) => {
    const products = await Product.find()

    if (!products) {
        throw new apiError(404, "No Products Found")
    }

    return res.status(200).json(
        new apiResponse(200, products, "Products Fetched Successfully")
    )
})  

export const getProductDetail = asyncFuction(async (req, res) => {
    const { id } = req.params

    const product = await Product.findById(id)

    if (!product) {
        throw new apiError(404, "Product Not Found")
    }

    return res.status(200).json(
        new apiResponse(200, product, "Product Fetched Successfully")
    )
})

