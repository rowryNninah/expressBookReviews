const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid

for(let user of users){
    if(user.username === username){
        return true
    }
}
return false
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
for(let user of users){
    if(user.username === username && user.password === password){
        return true
    }
}

return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
    const token = jwt.sign({username}, "secretKey", {expiresIn: "2h"});
    req.session.token = token;
    return res.status(200).json({message: "Login Seccessful"}) 
  }else{
    return res.status(401).json({ message: "Invalid username or password" });
  }

});

const tokenVerification = (req, res, next) =>{
    const token = req.session.token;
    if(!token) return res.status(403).json({message: "Unauthorized login"})

    jwt.verify(token, "secretKey", (err, decoded) =>{
        if(err)return res.status(403).json({message: "invalid token"})
        req.user = decoded;
        next()
    })
}

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

  const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.username; 

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added successfully", reviews: books[isbn].reviews });
});

regd_users.delete("/auth/review/:isbn", tokenVerification, (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;

    if (!books[isbn] || !books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found" });
    }

    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: "Deleted successfully",
        reviews: books[isbn].reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
