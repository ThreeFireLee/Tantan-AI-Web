let express = require('express');
let router = express.Router();
let path = require('path');
let formidable = require('formidable');
let fs = require('fs');
let assert = require('assert');
let  hbase = require('hbase');

let client = hbase({
  host:'localhost',
  port:8010
});

router.get('/', function(req, res, next) {
  res.send('this is our history');

});

module.exports = router;
