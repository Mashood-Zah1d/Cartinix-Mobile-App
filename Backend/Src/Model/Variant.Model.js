import mongoose from 'mongoose'

const variantSchema = mongoose.Schema({
    productid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    color:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    image:[{
        type:String
    }]
},{timestamps:true})

const Variant = mongoose.model("Variant",variantSchema) 

export default Variant