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
          newUser.password = hash;  // here we set newUser.password equal to the hash
          // Store hash in your password DB. 
          newUser.save(callback); // and then we save it, so we have newUser.save and we want to pass in a callback, now we can go back to our routes/users.js file
      });
  });
}

// these following two functions are the ones we need to create that will be used by '/routes/users.js'   // by the way, these are all mongoose methods
module.exports.getUserByUsername = function(username, callback){
  var query = {username: username}; // we want the query to see if the username entered by a user matches a username in the records
  User.findOne(query, callback);  // we simply want to call User.findOne() and pass in the query and callback; we could have just as well put this User.findOne() right inside of the '/routes/users.js', but we prefer to keep all the functions encapsulated together in the model, it just makes for a cleaner application

}

// this is the third function
module.exports.getUserById = function(id, callback){  
  User.findById(id, callback);  

}

// this is the second function
module.exports.comparePassword = function(candidatePassword, hash, callback){ 
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) { // here we are going to have to use bcryptjs // here we are passing the candidatePassword and hash // also in original code it's function(err, res) but res was replaced with isMatch just for preference
    if(err) throw err; // this is to check for any errors
    callback(null, isMatch); // then in the call back we pass in null and isMatch
});
}

// then there's one more thing we have to put in our '/routes/users.js' file and it's our serialize and de-serialize function from passport

