const jwt = require("jsonwebtoken");

const createJWT = async payload => {
    const secretKey = process.env.SECRET_KEY;
    const expiresIn = process.env.EXPIRES_IN;
    return jwt.sign(payload, secretKey, { expiresIn });
};
const decodeJWT = async token => {
    try {
        const secretKey = process.env.SECRET_KEY;
        return jwt.verify(token, secretKey);
    } catch (err) {
        return null;
    }
};
const setCookie = async (res, value) => {
    res.cookie("ecomadmin", value, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httponly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"
    });
    return true;
};
module.exports = { createJWT, decodeJWT ,setCookie};
