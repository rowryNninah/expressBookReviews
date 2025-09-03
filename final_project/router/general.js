const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Register
public_users.post("/register", (req,res) => {
  let {username, password} = req.body;
  if(!username || !password){
    return res.status(400).json({message: "Username and password are required"})
  }
  if(isValid(username)){
    return res.status(409).json({message: "Username already exists"})
  }
  users.push({username, password});
  return res.status(201).json({message: "Registered successfully"})
});

// Get all books
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/booksdata");
    return res.status(200).json(response.data);
  } catch(e) {
    return res.status(500).json({message: "An error occurred while fetching books"});
  }
});

// Get book details by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get("http://localhost:5000/booksdata");
    const book = response.data[isbn];
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({message: "No book matching ISBN"});
    }
  } catch(e) {
    return res.status(500).json({message: e.message});
  }
});

// Get book details by author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author.toLowerCase();
  try {
    const response = await axios.get("http://localhost:5000/booksdata");
    const filteredBooks = Object.values(response.data).filter(
      book => book.author.toLowerCase() === author
    );
    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res.status(404).json({message: "No books found for this author"});
    }
  } catch(e) {
    return res.status(500).json({message: e.message});
  }
});

// Get book details by title
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title.toLowerCase();
  try {
    const response = await axios.get("http://localhost:5000/booksdata");
    const filteredBooks = Object.values(response.data).filter(
      book => book.title.toLowerCase() === title
    );
    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res.status(404).json({message: "No books found with this title"});
    }
  } catch(e) {
    return res.status(500).json({message: e.message});
  }
});

// Get reviews
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
