var express = require('express');
var router = express.Router();
var query = require('../db/admin_queries');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;