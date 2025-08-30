const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const PORT = process.env.PORT || 5000;
const app = express();

// Import routes
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const connectDB = require("./config/db");

// Middleware
app.use(cors());
app.use(express.json());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to E-Commerce API",
        status: "Server is running",
        documentation: "/api-docs" // Consider adding API documentation endpoint
    });
});

// API endpoints
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/categories", categoryRoutes);

// Error handling middleware (add this after all routes)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to database', err);
    process.exit(1);
});

