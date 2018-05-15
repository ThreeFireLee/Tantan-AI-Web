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
  form.uploadDir = path.join(__dirname, './../models/ModelUpload');

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

      try
      {
        if (typeof JSON.parse(data) == "object") {
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
      var obj = JSON.parse(data);
     // console.log(obj);

      //Put to hbase
      client.table(fields.hbaseTablePut)
        .create(fields.colFamilyPut, function(err, success){
         this
           .row(fields.rowKeyPut)
            .put(fields.colFamilyPut + ':model', JSON.stringify(obj), function(err, success) {//JSON.stringify(obj)
              this.get(fields.colFamilyPut, function (err, cells) {
                this.exists(function (err, exists) {
                  assert.ok(exists);
                  console.log(success);

                  res.json({
                    status:'0',
                    msg:'',
                  });
                  // var time = new Date();   // 程序计时的月从0开始取值后+1
                  // var m = time.getMonth() + 1;
                  // var t = time.getFullYear() + "-" + m + "-"
                  //   + time.getDate() + " " + time.getHours() + ":"
                  //   + time.getMinutes() + ":" + time.getSeconds();
                  // let emailContent = `<p>Provision Time:${t}</p>
                  //                     <p>Model Id:${fields.rowKeyPut2}</p>
                  //                     <p>has been uploaded by ${fields.operator_name}</p>
                  //                     <p>Model Content:${fields.jsonInput}</p>`
                  // sendEmail('New model online updated',emailContent);
                });
              });
           });
        });
    });





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
            .put(fields.colFamilyPut2 + ':model', fields.jsonInput, function(err, success) {
              console.log('insert with json columns');
              console.log(success);
              var time = new Date();   // 程序计时的月从0开始取值后+1
              var m = time.getMonth() + 1;
              var t = time.getFullYear() + "-" + m + "-"
                + time.getDate() + " " + time.getHours() + ":"
                + time.getMinutes() + ":" + time.getSeconds();
              let emailContent = `<p>Provision Time:${t}</p>
                                  <p>Model Id:${fields.rowKeyPut2}</p>
                                  <p>has been uploaded by ${fields.operator_name}</p>
                                  <p>Model Content:${fields.jsonInput}</p>`
               sendEmail('(Stage) New model online updated',emailContent);
            });
        });


  });

  res.json({
    status:'0',
    msg:'',
  });


});

/*
    Retrieve parameters from hbase
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
        values = values[0].$;
        // values = JSON.stringify(values).replace(/[\\]/g,'');
         //values = JSON.stringify(values).replace(reg,"");

        // var v = values.$;
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
[=============================================AB TEST PART================================================]

* post abtest whitelist
* */
router.post('/uploadABtest', function(req, res){

  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    //sendEmail('muzihuohuohuo@126.com', 'Test subject', 'Test message');
    console.log(fields);//这里就是post的XXX 的数据
    var t1 = new Date().getTime();//timestamp
    // console.log(t1);

    let fieldJ = JSON.stringify(fields);
    //t1.toString()

    //maintain experiment files
    fs.writeFile(path.join(__dirname, "./../models/ABTestUpload", t1.toString()), fieldJ, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('ABtest experiment backup file done!');
      }
    });

    //maintain name list
    fs.appendFile(path.join(__dirname, "./../models/ABTestUpload",fields.rowKeyPut3 + '_namelist'), t1.toString() + '\n', function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Name list done!');
      }
    });


    //Insert to hbase
    client.table(fields.hbaseTablePut3)
      .create(fields.colFamilyPut3, function(err, success){
        this
          .row(fields.rowKeyPut3)
          .put(fields.colFamilyPut3 + ':content', fields.abtestData, function(err, success) {
            console.log('insert abtest data');
            console.log(success);
            // var time = new Date();   // 程序计时的月从0开始取值后+1
            // var m = time.getMonth() + 1;
            // var t = time.getFullYear() + "-" + m + "-"
            //   + time.getDate() + " " + time.getHours() + ":"
            //   + time.getMinutes() + ":" + time.getSeconds();
            // let emailContent = `<p>Provision Time:${t}</p>
            //                     <p>Model Id:${fields.rowKeyPut2}</p>
            //                     <p>has been uploaded by ${fields.operator_name}</p>
            //                     <p>Model Content:${fields.jsonInput}</p>`
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
*
* retrieve abtest data from database
* */
router.post("/hbaseABRetrieve", function (req,res,next) {
  // res.send('this is our hbase');
  var param = {
    rowKey:req.body.rowKey,
    hbaseTable:req.body.hbaseTable,
  }
  console.log(req.body);

//Get from hbase
  var myRow = client.table(param.hbaseTable).row(param.rowKey);
  myRow.exists('col',function(err,exists){
    if(exists){
      this.get('col',function(err,values){

        console.log('get column family');
        //console.log(values);

        values = values[0].$;

        //values = JSON.stringify(values).replace(/[\\]/g,'');
        //values = JSON.stringify(values).replace(reg,"");
        // values = values.replace('"$":"{','"$":{');
        // values = values.replace('}"}]','}}');
        // values = values.replace('}"}"}]','}}}');
        // values = values.replace('modelContent": "{"','modelContent": {"');
        // values = values.replace('[{"column":"','{"column":"');

        // var v = values.$;
        res.json({
          status:'0',
          msg:'',
          result:{
            ABRst:values
          }
        });

      });
    }
  });
});

/*
* Roll back (get old ver directly and save)
* */
router.post('/uploadRollBack', function(req, res){

  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {

    console.log(fields);//这里就是post的XXX 的数据

    fs.readFile(path.join(__dirname, "./../models/ABTestUpload",fields.rowKeyPut3 + '_namelist'), 'utf8', (err, data) => {
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
      client.table(obj.hbaseTablePut3)
        .create(obj.colFamilyPut3, function(err, success){
          this
            .row(obj.rowKeyPut3)
            .put(obj.colFamilyPut3 + ':content', obj.abtestData, function(err, success) {//JSON.stringify(obj)
              this.get(obj.colFamilyPut3, function (err, cells) {
                this.exists(function (err, exists) {
                  assert.ok(exists);
                  console.log(success);
                });
              });
            });
        });

      });

    });


  });

  res.json({
    status:'0',
    msg:'',
  });


});



module.exports = router;


