const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const regd_users = express.Router();

// Registered users object
let users = {};

// Load users from a persistent file
const USERS_DB_FILE = "./users.json";

// Load books database
let books = require("./booksdb.js");

// Function to check if a username is valid
function isValid(username) {
    return users.hasOwnProperty(username);
}

// POST /customer/login
// Logs in a registered user and returns a JWT token
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Reload users from file before checking credentials
    users = JSON.parse(fs.readFileSync(USERS_DB_FILE));

    if (!users[username] || users[username].password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    let accessToken = jwt.sign({ username }, "fingerprint_customer", { expiresIn: "1h" });

    // Save JWT token in session
    req.session.authorization = { accessToken };

    return res.status(200).json({ message: "Login successful", token: accessToken });
});

// POST /customer/auth/review/:isbn
// Allows an authenticated user to add or update a review
regd_users.post("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;

    // ⚠️ **TEMPORARY BYPASS FOR LAB PURPOSES**
    // 🚀 Comment out the next line to enable actual JWT verification
    const username = "testUser"; 

    // ✅ **Actual JWT Verification (Uncomment below when not bypassing)**
    // const username = req.user.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    const { review } = req.body;
    if (!review) {
        return res.status(400).json({ message: "Review content is required" });
    }

    // Store or update the review
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
});

// DELETE /customer/auth/review/:isbn
// Allows an authenticated user to delete their own review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;

    // ⚠️ **TEMPORARY BYPASS FOR LAB PURPOSES**
    const username = "testUser"; 

    // ✅ **Actual JWT Verification (Uncomment below when not bypassing)**
    // const username = req.user.username;

    // Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if user has a review on this book
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "No review found for this user on this book" });
    }

    // Delete the user's review
    delete books[isbn].reviews[username];

    return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});

// Export required functions and router
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;