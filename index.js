require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const createConnection = require("./db/db.connection");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());

if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}
// Enable CORS for frontend domain
app.use(
    cors({
        origin: "",
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
        maxAge: 86400
    })
);
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());
app.use(cors());
app.use(compression());

// Defined routes here

app.use("/api/v1", require("./routes/auth.routes"));
app.use("/api/v1", require("./routes/product.routes"));

// Main route
app.get("/", (req, res) => {
    res.send("Server working perfectly");
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error" });
});

// Start server
createConnection()
    .then(() => {
        app.listen(PORT, () => {
            console.clear();
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => console.error(err));
