const mongoose = require("mongoose");

const createConnection = async () => {
    const mongoURI = process.env.MONGO_URI;
    const dbName = process.env.DB_NAME;
    mongoose
        .connect(mongoURI, { dbName })
        .then(() => {
            console.log("[+] MongoDB Connected !");
        })
        .catch(error => {
            console.error("MongoDB Error : ", error);
        });
};
module.exports = createConnection