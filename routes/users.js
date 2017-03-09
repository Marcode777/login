var express = require('express');
var router = express.Router();

//GET REGISTER ROUTE
router.get('/register', function (req, res){ // this is a get request route for '/register', which is the register/registration page 
  res.render('register'); // this renders a view called register
});

// LOGIN ROUTE
router.get('/login', function (req, res){
  res.render('login');
});

//LOGOUT ROUTE (i have added this)
router.get('/logout', function (req, res){
  res.render('logout');
});

module.exports = router;