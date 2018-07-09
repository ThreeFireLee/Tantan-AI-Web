let express = require('express');
let router = express.Router();
let redis   = require('redis');
let path = require('path');
let formidable = require('formidable');
let fs = require('fs');



var client  = redis.createClient('6379', '127.0.0.1');


router.get('/', function(req, res, next) {
  res.send('this is our redis parser');

});

router.use(express.static(path.join(__dirname, 'public')));//部署需要相对路径，即：__dirname

/*
   Model provision
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
      content: fields.abtestData
    }

    finalData = JSON.stringify(finalData);
    // console.log(finalData);

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
