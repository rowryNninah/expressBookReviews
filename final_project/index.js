const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
let books = require("./router/booksdb.js");

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
app.use(express.json());

app.get('/booksdata', (req, res) => {
  res.json(books);
});

app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

app.use("/customer/auth/*", function auth(req,res,next){
  if(req.session.authorization){
    let token = req.session.authorization;
    jwt.verify(token, "access", (error, user)=>{
      if(!error){
        req.user = user;
        next();
      } else {
        return res.status(403).json({message: "User not authenticated"});
      }
    });
  } else {
    return res.status(403).json({message: "Please log in"});
  }
});

app.use("/customer", customer_routes);
app.use("/books", genl_routes);

const PORT = 5000;
app.listen(PORT,()=>console.log("Server is running"));