const userModel = require("../models/user.model");
const { createHash, compareHashed } = require("../functions/password-hashing");
const { createJWT, setCookie } = require("../functions/jwt-token-generator");

const loginController = async (req, res) => {
  try {
    const { email, password } = req?.body;
    if (!email || email === "") throw new Error("Email Address Required");
    if (!password || password === "") throw new Error("Password Required");
    const isEmailExist = await userModel.findOne({ email });
    if (!isEmailExist) throw new Error("Invalid Login Details");
    const isHashedMatched = await compareHashed(
      password,
      isEmailExist?.password
    );
    if (!isHashedMatched) throw new Error("Wrong Email Address Or Password");
    if (isHashedMatched && isEmailExist?.email === email) {
      let user = await userModel.findOne({ email }).select("-password");
      if (user.role === "USER")
        throw new Error("You aren't an admin - access denied");
      const token = await createJWT({ _id: user._id, name: user.name, email });
      setCookie(res, token);
      return res.status(200).json({
        success: true,
        error: false,
        user,
        token,
        message: "User Logged In Successfully",
      });
    } else {
      throw new Error("Unexpected Error! Try Again");
    }
  } catch (error) {
    //console.error("Error:", error);
    return res.status(403).json({
      success: false,
      error: true,
      message: error.message || "Unexpected Server Error",
    });
  }
};

module.exports = loginController;
