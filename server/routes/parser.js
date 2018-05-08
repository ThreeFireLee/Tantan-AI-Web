var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var assert = require('assert');
var hbase = require('hbase');
var sendEmail = require('./send-email.js');

// var multiparty = require('multiparty');

var client = hbase({
  host:'localhost',
  port:8010
});

router.get('/', function(req, res, next) {
    res.send('this is our parser');

});

router.use(express.static(path.join(__dirname, 'public')));//部署需要相对路径，即：__dirname

router.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

router.get('/upload', function(req, res, next) {
  res.send('upload test');

});

router.post('/upload', function(req, res){

  var form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '/upload');

  form.parse(req, function (err, fields, files) {

    console.log(fields.hbaseTablePut);//这里就是post的XXX 的数据
    //console.dir(files)//这里就是上传的文件
    /*
      *change the name to origin, it will be random name if not set here
      *but the file.path is the random name , so we do not change name here
     */
    //fs.rename(files.file.path, path.join(form.uploadDir, file.name));

    //read file
   //file.path: file store path/file.json


    fs.readFile(files.file.path, 'utf8', (err, data) => {
    if (err) {
        console.log(err);
      }

      var obj = JSON.parse(data);
     console.log(obj);

      //Put to hbase
      client.table(fields.hbaseTablePut)
        .create(fields.colFamilyPut, function(err, success){
         this
           .row(fields.rowKeyPut)
            .put(fields.colFamilyPut + ':model_contents', JSON.stringify(obj), function(err, success) {//JSON.stringify(obj)
              this.get(fields.colFamilyPut, function (err, cells) {
                this.exists(function (err, exists) {
                  assert.ok(exists);
                  console.log(success);
                });
              });
           });
        });
    });





  });

  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  //form.parse(req);

  form.on('end', (err, data) => {
    if(req.file == ""){
      res.end('upload failed!');
    }else{
      res.end('Upload successfully!');
    }
  });

});

router.get('/uploadHbase', function(req, res, next) {
  res.send('upload Json Hbase test');

});

/*
   Input from json typed on front end
   一定要对req和res都做操作，不然会始终pending
 */
router.post('/uploadHbase', function(req, res){

  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {

    console.log(fields);//这里就是post的XXX 的数据

      //Insert to hbase
      client.table(fields.hbaseTablePut2)
        .create(fields.colFamilyPut2, function(err, success){
          this
            .row(fields.rowKeyPut2)
            .put(fields.colFamilyPut2 + ':model_contents', fields.jsonInput, function(err, success) {
              console.log('insert with json columns');
              console.log(success);
              var time = new Date();   // 程序计时的月从0开始取值后+1
              var m = time.getMonth() + 1;
              var t = time.getFullYear() + "-" + m + "-"
                + time.getDate() + " " + time.getHours() + ":"
                + time.getMinutes() + ":" + time.getSeconds();
              var emailContent =  "Time: " + t + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                                     " Model Id:\t" + fields.rowKeyPut2 +
                                    "  has been uploaded by  " + fields.operator_name +
                                     "  Model Content:  " + fields.jsonInput;
              sendEmail('New model online updated',emailContent);
            });
        });


  });

  res.json({
    status:'0',
    msg:'',
  });


});

/*
    Retrieve parameters to hbase
 */
router.get('/hbase', function(req, res, next) {
  res.send('this is hbase parser');

});

router.post("/hbase", function (req,res,next) {
  // res.send('this is our hbase');
  var param = {
    rowKey:req.body.rowKey,
    hbaseTable:req.body.hbaseTable,
    colFamily:req.body.colFamily
  }
  console.log(req.body);

//Get from hbase
  var myRow = client.table(param.hbaseTable).row(param.rowKey);
  myRow.exists(param.colFamily,function(err,exists){
    if(exists){
      this.get(param.colFamily,function(err,values){

        console.log('get column family');
        //console.log(values);

        values = JSON.stringify(values).replace(/[\\]/g,'');
         //values = JSON.stringify(values).replace(reg,"");



            res.json({
              status:'0',
              msg:'',
              result:{
                hbaseRst:values
              }
            });

      });
    }
  });
});

/*
* post abtest whitelist
* */
router.post('/uploadABtest', function(req, res){

  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    //sendEmail('muzihuohuohuo@126.com', 'Test subject', 'Test message');
    console.log(fields);//这里就是post的XXX 的数据
    // fs.writeFile(path.join(__dirname, "./upload/onlyTest.json"), fields.abtestData, function (err) {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log('ok! Well done!');
    //   }
    // });


    //Insert to hbase
    // client.table(fields.hbaseTablePut3)
    //   .create(fields.colFamilyPut3, function(err, success){
    //     this
    //       .row(fields.rowKeyPut3)
    //       .put(fields.colFamilyPut3 + ':model_contents', fields.abtestData, function(err, success) {
    //         console.log('insert abtest data');
    //         console.log(success);
    //       });
    //   });


  });

  res.json({
    status:'0',
    msg:'',
  });


});

/*
* Roll back (get old ver directly and save)
* */
router.post('/uploadRollBack', function(req, res){

  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {

    console.log(fields);//这里就是post的XXX 的数据
    fs.readFile(path.join(__dirname, "./upload/onlyTest.json"), 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      }

      var obj = JSON.parse(data);
      console.log(obj);

      //Put to hbase
      // client.table(fields.hbaseTablePut)
      //   .create(fields.colFamilyPut, function(err, success){
      //     this
      //       .row(fields.rowKeyPut)
      //       .put(fields.colFamilyPut + ':model_contents', JSON.stringify(obj), function(err, success) {//JSON.stringify(obj)
      //         this.get(fields.colFamilyPut, function (err, cells) {
      //           this.exists(function (err, exists) {
      //             assert.ok(exists);
      //             console.log(success);
      //           });
      //         });
      //       });
      //   });
    });

  });

  res.json({
    status:'0',
    msg:'',
  });


});



module.exports = router;


