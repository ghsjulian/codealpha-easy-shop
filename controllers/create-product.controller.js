const Product = require("../models/product.moldel");
const { Uploader } = require("../functions/cloudinary.config");

const createProduct = async (req, res) => {
    try {
        const { name, category, price, stock, description, file } =
            req.body || {};
        // ---------- Basic Validation ----------
        if (!name)
            return res.status(400).json({ error: "productName is required" });
        if (!category)
            return res.status(400).json({ error: "category is required" });
        if (!price || isNaN(Number(price)))
            return res
                .status(400)
                .json({ error: "price must be a valid number" });
        if (!stock || isNaN(Number(stock)))
            return res
                .status(400)
                .json({ error: "stock must be a valid number" });
        if (!description)
            return res.status(400).json({ error: "fullDesc is required" });
        if (!file)
            return res.status(400).json({ error: "Product image required" });

        // ---------- Prepare document ----------
        const uploaded = await Uploader(file);
        const newProduct = new Product({
            name: name.trim(),
            category: category.trim(),
            price: Number(price),
            stok: Number(stock),
            description,
            image: uploaded?.secure_url || ""
        });

        // ---------- Save to DB ----------
        const saved = await newProduct.save();

        return res.status(201).json({
            message: "Product created successfully",
            product: saved
        });
    } catch (error) {
        console.error("Create Product Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = createProduct;
