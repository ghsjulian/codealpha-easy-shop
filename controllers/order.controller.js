const Order = require("../models/order.model");

const createOrder = async (req, res) => {
    try {
        const { payData } = req.body;
        if (!payData) throw new Error("Mising data from client");

        const newOrder = await new Order(payData);
        await newOrder.save()
        
        return res.status(201).json({
            success: true,
            message: "New Order Created Successfully",
            newOrder
        });
    } catch (error) {
        console.log("Error on create order controller : ", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = createOrder;
