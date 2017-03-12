var express = require('express');
var router = express.Router();

//GET HOMEPAGE
router.get('/', ensureAuthenticated, function (req, res){ // this is a get request route for '/', which is the homepage
  res.render('index'); // here we are rendering a view called index
});

// so now the last bit of functionality that we want to do is to only reveal the dashboard when a user is logged in.
// this is because even after a user has logged in and logged out, even though the dashboard will not automatically display, it can still show up if a user manually inputs the url route in the browser as just 'localhost:3000'
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){  
    return next();// so what we're saying here is that if the user is authenticated, we're going to keep going
  } else { // else, we're going to send a message, req.flash which is an error message saying 'You are not logged in!' and then let's do res.redirect to '/users/login'. // now to use this as a route, we can just use this as a 2nd parameter, by inserting it as 'ensureAuthenticated' in the get GET HOMEPAGE router.get function
    // req.flash('error_msg', 'You are not logged in!'); // now we might not want to have this message flash right away on a user's first visit, so we comment out this line of code
    res.redirect('/users/login'); 
  }
}

module.exports = router;