var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

//GET REGISTER ROUTE
router.get('/register', function (req, res){ // this is a get request route for '/register', which is the register/registration page 
  res.render('register'); // this renders a view called register
});

// LOGIN ROUTE
router.get('/login', function (req, res){
  res.render('login');
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

//PASSPORT 
// from username and password section documentation from passport
// this does two things, it gets what we put in as a username, it finds a username that matches, and then it validates the password. Now we are going to do it differently, we are not just going to our findOne, so we've scrapped most of it. We're going to call functions that are in the model.
// first thing we're going to do is we're going to all a model function called getUserByUsername(); (we haven't created this yet but we will), then we'll pass in username as in, getUserByUsername(username, function(err, user));
passport.use(new LocalStrategy( 
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
      if(err) throw err; // then we check if there's an error and throw an error if there's one, if not move on to the next
      if(!user){ // here we check to see if there's not a user match
        return done(null, false, {message: 'Unknown User'}); //if there's not a user match, then we'll return done, null, false and the message 'Unknown User'
      }

      User.comparePassword(password, user.password, function(err, isMatch){ // if there is a username match, it's going to keep going, so the next thing is it will compare passwords
          if(err) throw err;
          if(isMatch){ 
            return done(null, user); // if there's a match, then we'll return done, null and also pass in the user
          } else{ // else, we're still going to return done, but the second parameter will be false and we're also going to pass a message
            return done(null, false, {message: 'Invalid password'});
          } // now we need to create these two functions in '/models/user.js'
      }); 
    }); 
  }));

//PASSPORT serialize and deserialize
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) { // but instead of User.findById, we change it to User.getUserById, and this is going to be a function we create inside our model (the third function)
    done(err, user);
  });
});

//PASSPORT 
// here, we're creating a post route to login, because the login form is being submitted to that URL
// so we're making a post request to '/login' and we also have a second parameter of passport.authenticate, and we want to use our 'local' strategy because we're using a local database, and before we go on to this, we actually need to include passport, so we'll require it at the top as variables, passport and LocalStrategy ('passport-local');
// then we add a parameter to authenticate, these are basically options, failureRedirect and successRedirect and we also want to tell it if we want to use flash messages, and set that to true
// everything is going to come from our local strategy
router.post('/login', // since we're using router, this needs to be router.post instead of app.post
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login', failureFlash: true}),
  function(req, res) {
    res.redirect('/'); // here, all we're going to do is redirect to the dashboard, '/'
  });


router.get('/logout', function(req, res){ // this is the route for when a logged-in user wants to logout
  req.logout();  // all we need to do here is req.logout();

  req.flash('success_msg', 'You have logged out.');//Here, we'll just send a success message, saying 'You have logged out.'

  res.redirect('/users/login'); // and after, we will redirect to the login page
});

module.exports = router;


