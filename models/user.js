var mongoose = require('mongoose');
var bcrypt = require('bcryptjs'); // this is for hashing our passwords

// mongoose.connect('mongodb://localhost/loginapp'); // then we call mongoose.connect and pass in our db, which is 'mongodb://localhost/loginapp' 
// var db = mongoose.connection; // then we create a variable db, and set it to mongoose.connection 
// the above two lines of code were commented out, because they are already present in the app.js file, and the presence of a duplicate of them was throwing a 'Trying to open unclosed connection' error at re-start

//now we need to set our Schema
//USER SCHEMA
var UserSchema = mongoose.Schema({ // we have a variable UserSchema, we're setting it to mongoose.Schema
  username: {
    type: String,
    index: true
  },
  password:{
    type: String
  },
  email:{
    type: String
  },
  name: {
    type: String
  }
});

//now we need to create a variable that we can access outside of this file
var User = module.exports = mongoose.model('User', UserSchema); // we pass in the model name which will be 'User' and also the 'UserSchema' variable

// then what we need to do is have our user functions here
// the first one is going to be to create the user
module.exports.createUser = function(newUser, callback){ // this is set equal to a function that takes in two things, it will take in the newUser and also a callback function
// here we need to use bcrypt to hash our passwords, the following code is taken right from bcryptjs npm as the Usage-Async section
  bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) { //after bcrypyt.hash, is where we pass in the password, as in 'newUser.password', then we put in the salt and put in the function
          newUser.password = hash  // here we set newUser.password equal to the hash
          // Store hash in your password DB. 
          newUser.save(callback); // and then we save it, so we have newUser.save and we want to pass in a callback, now we can go back to our routes/users.js file
      });
  });
}