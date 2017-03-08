//I WILL BE A DEVELOPER WITH A $77,000 A YEAR SALARY LIVING IN EXCHANGE PLACE BY NEXT MONTH!!!!!
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');

// to initialize app
var app = express();

//VIEW ENGINE
app.set('views', path.join(__dirname, 'views')); // this line is telling the app that we want a folder called 'views' to handle our views
app.engine('handlebars', exphbs({defaultLayout:'layout'}));// this line is saying that handlebars will be the app engine and the defaultLayout file will be called 'layout' (which is the layout.handlebars file inside the layouts folder in the views folder), so it will be called layout.handlebars
app.set('view engine', 'handlebars');// this is saying app.set the view engine to handlebars

//BODY-PARSER AND COOKIE-PARSER MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// set STATIC FOLDER (this is the public folder), this is where we'll store files such as stylesheets, images, jQuery, things that are publicly accessible to the browser
app.use(express.static(path.join(__dirname + 'public')));

//EXPRESS SESSION
app.use(session({
  secret:'secret',
  saveUninitialized: true,
  resave: true
}));


//PASSPORT INITIALIZATION
app.use(passport.initialize());
app.use(passport.session());

//EXPRESS VALIDATOR
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.'),
    root = namespace.shift(),
    formParam = root;

    while(namespace.length){
      formParam+= '[' + namespace.shift() + ']';
    }
    return{
      param: formParam,
      msg: msg,
      value: value
    };
  }
})); 

// CONNECT-FLASH MIDDLEWARE
app.use(flash());

// GLOBAL VARIABLES FOR OUR FLASH MESSAGES, you want to create a global variable, or a global function, you want to use res.locals and then whatever you want, in this case, like success_msg, setting that in this case to request.flash('success_msg'), and so on and so forth 
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg'); // this is for the success message
  res.locals.error_msg = req.flash('error_msg'); // this is for any error messages we may have
  res.locals.error = req.flash('error'); // the reason we have this line of code is because passport sets its own flash messages and it sets it to error, so that's why we have this line of code in addition to the line of code above
  next();
});

// MIDDLEWARE FOR OUR ROUTE FILES
app.use('/', routes); // '/' is mapped to routes which in the var up near the top of the page, goes to './routes/index'
app.use('/users', users); // this is mapped accordingly to users

//SET PORT
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
  console.log("Server has been started on port" + app.get('port'));
});





//LEFT OFF AT 14:33








