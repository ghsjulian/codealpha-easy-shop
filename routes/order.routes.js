const express = require("express");
const router = express.Router();
const isUser = require("../middlewares/is.user");
const createOrder = require("../controllers/order.controller")

router.post("/orders/create-order",isUser, createOrder);

module.exports = router