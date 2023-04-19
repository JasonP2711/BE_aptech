var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('this is Get');
  });


  router.post('/', function(req, res, next) {
    const newProduct = req.body;
    console.log(newProduct);
    const data = {message : 'this is Post'};
  });