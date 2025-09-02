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
public_users.get('/', async function (req, res) {
  //Write your code here
    try{
        const data = await new Promise((resolve)=>{
            resolve(books)
        })
        return res.status(200).json(data);
    }catch(e){
        return res.status(500).json({message: "An error occurred while fetching books"})
    }
 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  try{
    const book = await new Promise((resolve, reject) =>{
        if(books[isbn]){
            resolve(books[isbn])
        }else{
            reject(new Error("Book not found"))
        }
    })
    res.status(200).send(JSON.stringify(book))
  }catch(e){
    return res.status(404).json({message: e.message});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    //Write your code here
    const author = req.params.author;
    try{
        const results = await new Promise((resolve, reject) =>{
            const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase())

            if(filteredBooks.length > 0){
                resolve(filteredBooks)
            }else{
                reject(new Error("No Books found for this author"))
            }
        })
        return res.send(JSON.stringify(results)); 

    }catch(e){
        res.status(404).send({ message: e.message});
    }
  
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const title = req.params.title;

    try{
        const results = await new Promise((resolve, reject) =>{
            const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase())
            if(filteredBooks.length > 0){
                resolve(filteredBooks)
            }else{
                reject(new Error("No Books found by this title"))
            }
        })
        return res.send(JSON.stringify(results));

    }catch(e){
        return res.status(404).send({ message: e.message});
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

});

module.exports.general = public_users;
