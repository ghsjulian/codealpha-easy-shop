const bcrypt = require("bcryptjs");

const createHash = async password => {
    try {
        const salt = await bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(password, salt);
        return hashedPassword;
    } catch (error) {
        console.log("\n[!] Error Hashing Password", error.message);
    }
};
const compareHashed = async (password, hashedPassword) => {
    try {
        return await bcrypt.compareSync(password, hashedPassword);
    } catch (error) {
        console.log("\n[!] Error While Matching Hashed : ", error.message);
    }
};

module.exports = {createHash,compareHashed}