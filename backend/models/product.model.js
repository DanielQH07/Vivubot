import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },

}, {
    timestamps: true// Create At and Update At
});

const Product = mongoose.model("Product", productSchema); // dislay products
export default Product;