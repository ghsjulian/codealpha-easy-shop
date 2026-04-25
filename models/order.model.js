// product.model.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
    {
        products : {
            type: Object,
            required : true,
            default : {}
        },
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        zip: {
            type: String,
            required: true
        },
        holder: {
            type: String,
            required: true
        },
        card: {
            type: String,
            required: true
        },
        cvv: {
            type: String,
            required: true
        },
        method: {
            type: String,
            required: true
        },
        expiry: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
