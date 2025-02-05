// Import required modules
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Session middleware for customer authentication
app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Authentication Middleware
function auth(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const bearerToken = token.split(" ")[1]; // Extract token after 'Bearer '
        
        // ⚠️ **TEMPORARY BYPASS FOR LAB PURPOSES**
        // 🚀 Comment out the next line to enable actual JWT verification
        req.user = { username: "testUser" }; 
        return next();

        // ✅ **Actual JWT Verification (Uncomment below when not bypassing)**
        // const decoded = jwt.verify(bearerToken, "fingerprint_customer");
        // req.user = decoded; // Attach user info to request
        // next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
}

// Apply authentication middleware to protected routes
app.use("/customer/auth/*", auth);

// Define server port
const PORT = 5000;

// Use routers
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start the server
app.listen(PORT, () => console.log("🚀 Server is running on port:", PORT));