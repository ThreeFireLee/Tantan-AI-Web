var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var assert = require('assert');
var hbase = require('hbase');
var multiparty = require('multiparty');

var client = hbase({
  host:'localhost',
  port:8010
});

router.get('/', function(req, res, next) {
    res.send('this is our parser');

});

router.use(express.static(path.join(__dirname, 'public')));

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

    console.log(fields);//这里就是post的XXX 的数据
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
      //console.log(obj.person.birth);
      console.log(obj);
      //Put to hbase
      client.table(fields.hbaseTablePut)
        .create(fields.colFamilyPut, function(err, success){
         this
           .row(fields.rowKeyPut)
            .put(fields.colFamilyPut + ':model_contents', JSON.stringify(obj), function(err, success) {
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
  //form.on('file', function(field, file) {
  //});

  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  form.parse(req);

  form.on('end', (err, data) => {
    if(req.file == ""){
      res.end('upload failed!');
    }else{
      res.end('Upload successfully!');
    }
  });

});
/*
   Input from json typed on front end
 */
router.post('/uploadHbase', function(req, res){
  var parameter = {
    rowKeyPut2:req.body.rowKeyPut2,
    hbaseTablePut2:req.body.hbaseTablePut2,
    colFamilyPut2:req.body.colFamilyPut2,
    inputJson:req.body.inputJson
  }

  console.log(req.body);


    //   var obj = JSON.parse(data);
    //   //console.log(obj.person.birth);
    //   console.log(obj);
    //
    //   //Put to hbase
    //   client.table('test')
    //     .create('model_info', function(err, success){
    //       this
    //       // .row(obj.model_id.toString())
    //         .row('mods_female_like_wo_weight_mlc0_123456')
    //         .put('model_info:model_content', JSON.stringify(obj), function(err, success) {
    //           this.get('model_info', function (err, cells) {
    //             this.exists(function (err, exists) {
    //               assert.ok(exists);
    //               console.log(success);
    //             });
    //           });
    //         });
    //     });
    //
    //
    // });

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
        console.log(values);


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



module.exports = router;


