/**
 * @author Yan Li
 * @company tantan
 * @Description:
 */

let express = require('express');
let router = express.Router();
// let redis   = require('redis');
let redisIO = require('ioredis');
let path = require('path');
let formidable = require('formidable');
let fs = require('fs');
let config = require('../config/config');


// let cluster = new redisIO({
//     port: config.redis_stage_port,
//     host: config.redis_stage_host,
//     password: config.redis_stage_password,
//     retryStrategy: function (times) {
//     let delay = Math.min(times * 50, 2000);
//     return delay;
//   }
//   });



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

      cluster.on("error", function (err) {
        console.log("Error " + err);
      });

      console.log(fields.rowKeyPut);

      //Insert to redis
      cluster.set('105_' + fields.rowKeyPut, JSON.stringify(obj))
        .then(function (result) {
          console.log(result);
          if(result){
            cluster.quit();
            res.json({
              status: '0',
              msg: '',
            });
          }else{
            cluster.quit();
            res.json({
              status:'1',
              msg:'',
            });
          }
        });//set "key" "val"



    });


  });

});

/*
   Model provision with typing
 */
router.post('/redisModelTyping', function(req, res){

  let form = new formidable.IncomingForm();

  form.parse(req, function (err, fields){

        //
        cluster.set('105_' + fields.rowKeyPut2, fields.jsonInput)
                .then(function (result) {
                  console.log(result);
                    if(result){
                      cluster.quit();
                      res.json({
                        status: '0',
                        msg: '',
                      });
                    }else{
                      cluster.quit();
                      res.json({
                        status:'1',
                        msg:'',
                      });
                    }
                });

        cluster.get('105_' + fields.rowKeyPut2, function (err, result) {
          console.log(result);
        });

    cluster.on("error", function (err) {
        console.log("Error " + err);
      });

    // cluster.disconnect();


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

    cluster.on("error", function (err) {
      console.log("Error " + err);
    });

    //Insert to redis
     cluster.set('106_' + fields.rowKeyPut3, finalData).then(
       function (result) {
         console.log(result);
         // cluster.disconnect();
         if(result){
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
       }
     );//set "key" "val"


  });
});


module.exports = router;
