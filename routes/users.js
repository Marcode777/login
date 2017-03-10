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

//TO REGISTER USER
router.post('/register', function (req, res){ // to register a user, the request is changed from 'get' to 'post'
  //what we want to do now, is take all the stuff that's being submitted and put it into a variable
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password; 
  var password2 = req.body.password2;

  console.log(name); // this is to test to make sure it's working, we should get the name printed to the console here 

 // Validation
 req.checkBody() // here to validate, we can do 'req.checkBody('') and then the field that we want to check inside the parentheses and quotes

});

module.exports = router;