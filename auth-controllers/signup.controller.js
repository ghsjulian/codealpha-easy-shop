const userModel = require("../models/user.model");
const { createHash } = require("../functions/password-hashing");
const { createJWT, setCookie } = require("../functions/jwt-token-generator");

const signupController = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name && !email && !phone && !password)
            throw new Error("All fields are required");
        const existUser = await userModel.findOne({
            email: email.trim()
        });
        if (existUser) throw new Error("User Already Registered");
        const hash = await createHash(password.trim());

        const newUser = new userModel({
            name,
            email,
            phone,
            password: hash,
            role: "USER"
        });
        const token = await createJWT({ _id: newUser._id, name, email });
        setCookie(res, token);
        await newUser.save();

        const user = await userModel.findOne({ email }).select("-password");
        return res.status(201).json({
            success: true,
            token,
            user,
            message: "Account Created Successfully"
        });
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: error.message || "Server Error - 403"
        });
    }
};

module.exports = signupController;
