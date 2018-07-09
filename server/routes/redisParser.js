let express = require('express');
let router = express.Router();
let redis   = require('redis');
let path = require('path');
let formidable = require('formidable');
let fs = require('fs');

//retry 3 times when cache work not well
let client = redis.createClient('6379', '127.0.0.1', {
  retry_strategy: function (options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  }
});

router.get('/', function(req, res, next) {
  res.send('this is our redis parser');

});

router.use(express.static(path.join(__dirname, 'public')));//部署需要相对路径，即：__dirname



/*
   Model provision with File
 */
router.post('/redisModel', function(req, res){

  let form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, './../models/ModelUpload');

  form.parse(req, function (err, fields, files) {

    // console.log(fields.hbaseTablePut);//这里就是post的XXX 的数据

    fs.readFile(files.file.path, 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      }

      try
      {
        if (typeof JSON.parse(data) === "object") {
          console.log('correct json format');
        }
      }
      catch(err)
      {
        console.log('wrong json format');
        res.json({
          status:'1',
          msg:'',
        });
        return false;//如果报错，则防止程序继续执行
      }
      let obj = JSON.parse(data);
      // console.log(obj);

      client.on("error", function (err) {
        console.log("Error " + err);
      });
      //Insert to redis
      client.set('105_' + fields.rowKeyPut, JSON.stringify(obj), redis.print);//set "key" "val"

      if(redis.print){
        res.json({
          status: '0',
          msg: '',
        });
      }else{
        res.json({
          status:'1',
          msg:'',
        });
      }


    });


  });

});

/*
   Model provision with typing
 */
router.post('/redisModelTyping', function(req, res){

  let form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, './../models/ModelUpload');

  form.parse(req, function (err, fields) {

      client.on("error", function (err) {
        console.log("Error " + err);
      });

      //Insert to redis
      client.set('105_' + fields.rowKeyPut2, fields.jsonInput, redis.print);//set "key" "val"

      if(redis.print){
        res.json({
          status: '0',
          msg: '',
        });
      }else{
        res.json({
          status:'1',
          msg:'',
        });
      }


  });

});








/*

[=============================================A/B TEST PART================================================]

* Post abtest data
*
* */
router.post('/redisABtest', function(req, res){

  let form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    console.log(fields);//这里就是post的XXX 的数据

    let t1 = new Date().getTime();

    let finalData = {
      key: fields.rowKeyPut3,
      version: t1,
      content: JSON.parse(fields.abtestData)
    }

     finalData = JSON.stringify(finalData);
    // console.log(finalData);

    client.on("error", function (err) {
      console.log("Error " + err);
    });

    //Insert to redis
    client.set('106_' + fields.rowKeyPut3, finalData, redis.print);//set "key" "val"

    if(redis.print){
      res.json({
        status: '0',
        msg: '',
      });
      }else{
        res.json({
          status:'1',
          msg:'',
        });
    }


  });
});


module.exports = router;
