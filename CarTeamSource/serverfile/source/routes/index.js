var express = require('express');
var database = require('./innerdata/database');

var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });
});

module.exports = router;
