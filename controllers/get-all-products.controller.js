const productModel = require("../models/product.moldel");

const getAllProducts = async (req, res) => {
  try {
    const products = await productModel
      .find()
      .sort({ createdAt: -1 }) 
      .limit(10)
      .exec();

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("getLatestProducts error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Unexpected Server Error",
    });
  }
};

module.exports = getAllProducts;
