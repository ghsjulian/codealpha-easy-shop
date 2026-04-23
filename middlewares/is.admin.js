const userModel = require("../models/user.model");
const { decodeJWT } = require("../functions/jwt-token-generator");

const isAdmin = async (req, res, next) => {
  try {
    const token = req?.headers.token || null;
    if (!token) throw new Error("No token provided");

    // Decode token
    const decoded = await decodeJWT(token);
    if (!decoded || !decoded._id) {
      throw new Error("Unauthorized - invalid user token");
    }

    // Check user exists
    const user = await userModel.findById(decoded._id).select("-password");
    if (!user) throw new Error("User not found");

    // Check role
    if (user.role !== "ADMIN") {
      throw new Error("Access denied - not an admin");
    }

    // Attach admin user to request
    req.admin = user;

    // Allow access
    next();
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = isAdmin;
