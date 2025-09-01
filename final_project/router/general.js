const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
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

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here

  const isbn = req.params.isbn;
  const book = books[isbn]

  if(book){
    res.status(200).send(JSON.stringify(book,null, 4))
  }else{
    return res.status(404).json({message: "Book not found"});
  }

  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    const author = req.params.author;
    const authorKey = Object.keys(books);
    let results = []
  
    authorKey.forEach((key) =>{
        if(books[key].author.toLowerCase() === author.toLocaleLowerCase()){
            results.push(books[key])
        }
    })
    
    if (results.length > 0) {
        res.send(JSON.stringify(results, null, 4));  // neatly format results
      } else {
        res.status(404).send({ message: "No books found for this author" });
      }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
    const titleKey = Object.keys(books);
    let results = []
  
    titleKey.forEach((key) =>{
        if(books[key].title.toLowerCase() === title.toLocaleLowerCase()){
            results.push(books[key])
        }
    })
    
    if (results.length > 0) {
        res.send(JSON.stringify(results, null, 4)); 
      } else {
        res.status(404).send({ message: "No books found for this author" });
      }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;   
  const book = books[isbn];      

  if (book) {
    res.send(JSON.stringify(book.reviews, null, 4)); 
  } else {
    res.status(404).send({ message: "Book not found" });
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
