const express = require("express");
const router = express.Router();
const isAdmin = require("../middlewares/is.admin");
const createProductController = require("../controllers/create-product.controller");
const getAllProducts = require("../controllers/get-all-products.controller");
const getSingleProduct = require("../controllers/get-single-product.controller");

router.post("/products/add-product", isAdmin, createProductController);
router.get("/products/get-products", getAllProducts);
router.get("/products/get-product", getSingleProduct);
module.exports = router;
