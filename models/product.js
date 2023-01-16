const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        maxLength:160,
    },
    slug:{
        type:String,
        lowercase:true,
    },
    description:{
        type:{},
        required:true,
        maxLength:2000,
    },
    price:{
        type:Number,
        trim:true,
        required:true,
    },
    category:{
        type:ObjectId,
        ref:'Category',
        required:true,
    },
    quantity:{
        type:Number,
    },
    sold:{
        type:Number,
        default: 0,
    },
    photo:{
        data:Buffer,
        contentType:String,
    },
    shipping:{
        type:boolean,
        required:false,
    },
},
    { timestamps: true, versionKey: false }

);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;