const express = require("express");
const app = express();
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// ROUTES
const authRoutes = require("./routes/auth");

// Middlewares
app.use(express.json());
app.use(helmet());

// Brute-force garşy gorag
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: "Gaty köp synanyşyk. Biraz garaşyň."
});
app.use("/auth", limiter);

// ROUTES ulanmak
app.use("/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("TM Auksion Backend işleýär!");
});

// Server başlatmak
app.listen(3000, () => {
    console.log("Server 3000 portda işleýär...");
});
