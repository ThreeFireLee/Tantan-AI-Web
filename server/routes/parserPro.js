/*
*
* Node.js Router for stage.
*
* */
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
  form.uploadDir = path.join(__dirname, './../models/ModelUploadPro');

  form.parse(req, function (err, fields, files) {

    console.log(fields.hbaseTablePutPro);//这里就是post的XXX 的数据
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
      client.table(fields.hbaseTablePutPro)
        .create(fields.colFamilyPutPro, function(err, success){
          this
            .row(fields.rowKeyPutPro)
            .put(fields.colFamilyPutPro + ':model_contents', JSON.stringify(obj), function(err, success) {//JSON.stringify(obj)
              this.get(fields.colFamilyPutPro, function (err, cells) {
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
    client.table(fields.hbaseTablePutPro2)
      .create(fields.colFamilyPutPro2, function(err, success){
        this
          .row(fields.rowKeyPutPro2)
          .put(fields.colFamilyPutPro2 + ':model_contents', fields.jsonInputPro, function(err, success) {
            console.log('insert with json columns');
            console.log(success);
            // var time = new Date();   // 程序计时的月从0开始取值后+1
            // var m = time.getMonth() + 1;
            // var t = time.getFullYear() + "-" + m + "-"
            //   + time.getDate() + " " + time.getHours() + ":"
            //   + time.getMinutes() + ":" + time.getSeconds();
            // var emailContent =  "Time: \r\n" + t + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
            //   " Model Id:\r\n" + fields.rowKeyPutPro2 +
            //   "  has been uploaded by  " + fields.operator_namePro +
            //   "  Model Content:  " + fields.jsonInputPro;
            // sendEmail('New model online updated',emailContent);
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
    rowKeyPro:req.body.rowKeyPro,
    hbaseTablePro:req.body.hbaseTablePro,
    colFamilyPro:req.body.colFamilyPro
  }
  console.log(req.body);

//Get from hbase
  var myRow = client.table(param.hbaseTablePro).row(param.rowKeyPro);
  myRow.exists(param.colFamilyPro,function(err,exists){
    if(exists){
      this.get(param.colFamilyPro,function(err,values){

        console.log('Get column family');
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
    var t1 = new Date().getTime();//timestamp
    console.log(t1);

    let fieldJ = JSON.stringify(fields);
    // console.log(fieldJ);
    // let fieldF = JSON.parse(fieldJ);
    // console.log(fieldF.abtestData);

    //maintain experiment files
    fs.writeFile(path.join(__dirname, "./../models/ABTestUpload", t1.toString()), fieldJ, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('ABtest experiment backup file done!');
      }
    });

    //maintain name list
    fs.appendFile(path.join(__dirname, "./../models/ABTestUpload/experiment_list"), t1.toString() + '\n', function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Name list done!');
      }
    });


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

    fs.readFile(path.join(__dirname, "./../models/ABTestUpload/experiment_list"), 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      }
      console.log(data);
      let arr = data.split(/[\s]*\n[\s]*/);

      //取出数组倒数第二个数，因为最后有个空格，所以实际是length-3；
      var last2 = arr[arr.length - 3];
      console.log(last2);
      fs.readFile(path.join(__dirname, "./../models/ABTestUpload",last2), 'utf8', (err, data) => {
        if (err) {
          console.log(err);
        }

        var obj = JSON.parse(data);
        console.log(obj.abtestData);

        //Put to hbase
        // client.table(obj.hbaseTablePut3)
        //   .create(obj.colFamilyPut3, function(err, success){
        //     this
        //       .row(obj.rowKeyPut3)
        //       .put(obj.colFamilyPut3 + ':model_contents', obj.abtestData, function(err, success) {//JSON.stringify(obj)
        //         this.get(obj.colFamilyPut3, function (err, cells) {
        //           this.exists(function (err, exists) {
        //             assert.ok(exists);
        //             console.log(success);
        //           });
        //         });
        //       });
        //   });
      });

    });


  });

  res.json({
    status:'0',
    msg:'',
  });


});



module.exports = router;

