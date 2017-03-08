var express = require('express');
var router = express.Router();

//GET HOMEPAGE
router.get('/', function (req, res){ // this is a get request route for '/', which is the homepage
  res.render('index'); // here we are rendering a view called index
});

module.exports = router;