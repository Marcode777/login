var express = require('express');
var router = express.Router();

var User = require('../models/user');

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
 req.checkBody('name', 'Name is required!').notEmpty(); // here to validate, we can do 'req.checkBody('') and then the field that we want to check inside the parentheses and quotes, in this case, 'name' and then we want to say a message saying 'Name is required', and then we need to add on the function that we want for validation, in this case we're going to say 'notEmpty()', and that just checks to make sure that that's actually filled-in. We can also do other, additional validations.
 req.checkBody('username', 'Username is required!').notEmpty();
 req.checkBody('email', 'Email is required!').notEmpty(); 
 req.checkBody('email', 'Email is not valid!').isEmail(); // here, we are making sure that it's a valid email address
 req.checkBody('password', 'Password is required!').notEmpty();
 req.checkBody('password2', 'Passwords do not match!').equals(req.body.password); // in this, we are making sure that the email; in other words, we are taking 'password2', calling '.equals' and passing in what it should equals, which is the first password field, so this is what's going to check that.

 var errors = req.validationErrors();

if(errors){
  console.log('Yes there are errors, something in the form is blank');
  res.render('register', { // now here, what are doing is that if there are errors, we will re-render the form, we'll render 'register' and pass along the errors, so in the 2nd parameter, we'll pass them along, as in,  'errors:errors'. Right now, it is re-rendering the form, which is what it's supposed to do, but it's not telling us anything, we get no messages right now. So what we'll do, is go to the register.handlebars file and place the code that displays errors in (it will be designated with comments for easy identification)
    errors:errors // this is the code that will pass in the errors, if there are any, the code that is supposed to display errors if there are on the register.handlebars file will loop through these and then display the errors if there were any passed in
  });
} else{
    console.log('PASSED'); // so now here, if it actually passes, well actually, we should create the model first, so we'll go into our models folder...after that's complete, we'll create a new object called in the form of a var newUser = new User, (the new User is coming from the model), which we also have to declare up above as a var User
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password
    });
    //now we can call that create User function that's in the model, it takes in newUser that we just created and the callback function
    User.createUser(newUser, function(err, user){
      if(err) throw err; // here we'll just check for an error, and then just throw the error if there is one, and then just console.log the user
      console.log(user);
    });
    req.flash('success_msg', 'You are registered and are now able to log in!'); // after that, we want to just set a success msg and say req.flash(), the first parameter will be 'success_msg' and the actual message 'You are registered and are now able to log in!' But in order for this message to show, we need to add a placeholder in our template, so we'll go to our layout.handlebars file for that, the code will be commented for identification
    res.redirect('/users/login') // after, we just want to redirect, and here, we'll redirect to the login page at '/users/login'
  }

});

module.exports = router;