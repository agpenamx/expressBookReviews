const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");

const public_users = express.Router();

// Register a new user (Placeholder)
public_users.post("/register", (req, res) => {
    return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list using Promises
public_users.get('/', function (req, res) {
    return new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject({ message: "No books available" });
        }
    })
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(500).json(error));
});

// Get the book list using Async/Await
public_users.get('/async', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/'); // Self-fetch
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve books" });
    }
});

// Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const { isbn } = req.params;

    return new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({ message: "Book not found" });
        }
    })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json(error));
});

// Get book details based on ISBN using Async/Await
public_users.get('/async/isbn/:isbn', async function (req, res) {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${req.params.isbn}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author using Promises
public_users.get('/author/:author', function (req, res) {
    const { author } = req.params;

    return new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(book => book.author === author);
        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject({ message: "No books found by this author" });
        }
    })
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(404).json(error));
});

// Get book details based on author using Async/Await
public_users.get('/async/author/:author', async function (req, res) {
    try {
        const response = await axios.get(`http://localhost:5000/author/${req.params.author}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: "No books found by this author" });
    }
});

// Get book details based on title using Promises
public_users.get('/title/:title', function (req, res) {
    const { title } = req.params;

    return new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(book => book.title === title);
        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject({ message: "No books found with this title" });
        }
    })
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(404).json(error));
});

// Get book details based on title using Async/Await
public_users.get('/async/title/:title', async function (req, res) {
    try {
        const response = await axios.get(`http://localhost:5000/title/${req.params.title}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: "No books found with this title" });
    }
});

// Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const { isbn } = req.params;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book.reviews || {});
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;