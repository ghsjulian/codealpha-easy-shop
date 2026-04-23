const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        price: {
            type: String,
            required: true
        },
        stok: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true,
            
        }
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
