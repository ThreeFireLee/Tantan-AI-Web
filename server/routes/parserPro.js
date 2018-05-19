/*
*
* Node.js Router for Production.
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

//upload with file
router.post('/upload', function(req, res){

  var form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, './../models/ModelUploadPro');

  form.parse(req, function (err, fields, files) {
    console.log(fields.hbaseTablePutPro);//这里就是post的XXX 的数据
 fs.readFile(files.file.path, 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      }
      console.log(data);
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

   var myCol = client.table(fields.hbaseTablePutPro).row(fields.rowKeyPutPro);
   myCol.exists(fields.colFamilyPutPro,function(err,exists){
     if(exists){
       console.log('Already exist');
       res.json({
         status:'2',
         msg:'Cannot write! Model already exist',
       });
     }else{
       //Put to hbase
       client.table(fields.hbaseTablePutPro)
         .create(fields.colFamilyPutPro, function(err, success){
           this
             .row(fields.rowKeyPutPro)
             .put(fields.colFamilyPutPro + ':model', JSON.stringify(obj), function(err, success) {//JSON.stringify(obj)
               this.get(fields.colFamilyPutPro, function (err, cells) {
                 this.exists(function (err, exists) {
                   assert.ok(exists);
                   console.log(success);
                   if(success == true) {
                     res.json({
                       status: '0',
                       msg: '',
                     });
                   }else{
                     res.json({
                       status:'3',
                       msg:'',
                     });
                   }
                   var time = new Date();   // 程序计时的月从0开始取值后+1
                   var m = time.getMonth() + 1;
                   var t = time.getFullYear() + "-" + m + "-"
                     + time.getDate() + " " + time.getHours() + ":"
                     + time.getMinutes() + ":" + time.getSeconds();
                   let emailContent = `<p>Provision Time:${t}</p>
                                      <p>Operator: ${fields.operator_namePro}</p>
                                      <p>Submission: File</p>
                                      <p>Model Id:${fields.rowKeyPutPro}</p>
                                      <p>Model Content:${JSON.stringify(obj)}</p>`
                   sendEmail('(Production) New model online updated', emailContent);

                 });
               });
             });
         });
     }
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

    //test whether already exist
    var myCol = client.table(fields.hbaseTablePutPro2).row(fields.rowKeyPutPro2);
    myCol.exists(fields.colFamilyPutPro2,function(err,exists){
      if(exists){
        console.log('Already exist');
        res.json({
          status:'2',
          msg:'Cannot write! Model already exist',
        });
      }else{  //Insert to hbase
        client.table(fields.hbaseTablePutPro2)
          .create(fields.colFamilyPutPro2, function(err, success){
            this
              .row(fields.rowKeyPutPro2)
              .put(fields.colFamilyPutPro2 + ':model', fields.jsonInputPro, function(err, success) {
                console.log(success);
                var time = new Date();   // 程序计时的月从0开始取值后+1
                var m = time.getMonth() + 1;
                var t = time.getFullYear() + "-" + m + "-"
                  + time.getDate() + " " + time.getHours() + ":"
                  + time.getMinutes() + ":" + time.getSeconds();
                let emailContent = `<p>Provision Time:${t}</p>
                                  <p>Operator: ${fields.operator_namePro}</p>
                                  <p>Submission: front-end entered</p>
                                  <p>Model Id:${fields.rowKeyPut2Pro2}</p>
                                  <p>Model Content:${fields.jsonInputPro}</p>`
                sendEmail('(Production) New model online updated',emailContent);


                if(success == true) {
                  res.json({
                    status: '0',
                    msg: '',
                  });
                }else{
                  res.json({
                    status:'3',
                    msg:'',
                  });
                }


              });
          });
      }
    });


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

        values = values[0].$;
        // values = JSON.stringify(values).replace(/[\\]/g,'');
        //values = JSON.stringify(values).replace(reg,"");


        res.json({
          status:'0',
          msg:'',
          result:{
            hbaseRst:values
          }
        });

      });
    }else{
      res.json({
        status:'1',
        msg:''
      });
    }
  });
});

/*
[=============================================A/B TEST PART================================================]
* post abtest whitelist
* */
router.post('/uploadABtest', function(req, res){

  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {

    //Insert to hbase
    client.table(fields.hbaseTablePut3)
      .create(fields.colFamilyPut3, function(err, success){
        this
          .row(fields.rowKeyPut3)
          .put(fields.colFamilyPut3 + ':content', fields.abtestData, function(err, success) {
            console.log('insert abtest data');
            console.log(success);
            if(success == true) {
              console.log(fields);//这里就是post的XXX 的数据
              var t1 = new Date().getTime();//timestamp
              console.log(t1);

              let fieldJ = JSON.stringify(fields);
              // console.log(fieldJ);
              // let fieldF = JSON.parse(fieldJ);
              // console.log(fieldF.abtestData);

              //maintain experiment files
              fs.writeFile(path.join(__dirname, "./../models/ABTestUploadPro", t1.toString()), fieldJ, function (err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log('ABtest experiment backup file done!');
                }
              });

              //maintain name list
              fs.appendFile(path.join(__dirname, "./../models/ABTestUploadPro/namelistPro",fields.hbaseTablePut3 + '_' + fields.rowKeyPut3 + '_namelist'), t1.toString() + '\n', function (err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log('Name list done!');
                }
              });


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

            var time = new Date();
            var m = time.getMonth() + 1;
            var t = time.getFullYear() + "-" + m + "-"
              + time.getDate() + " " + time.getHours() + ":"
              + time.getMinutes() + ":" + time.getSeconds();
            let emailContent = `<p>Provision Time:${t}</p>
                                <p>Operator: ${fields.operator_name}</p>
                                <p>A/B Testing Experiment Name:${fields.rowKeyPut3}</p>
                                <p>Row Key:${fields.experiment_name}</p>                         
                                <p>A/B Testing Content:${fields.abtestData}</p>`
            sendEmail('(Production) New A/B Test online updated',emailContent);
          });
      });


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
    colFamily:req.body.colFamily
  }
  console.log(req.body);

//Get from hbase
  var myRow = client.table(param.hbaseTable).row(param.rowKey);
  myRow.exists(param.colFamily, function(err,exists){
    if(exists){
      this.get(param.colFamily,function(err,values){

        console.log('get column family');
        //console.log(values);

        values = values[0].$;

        res.json({
          status:'0',
          msg:'',
          result:{
            ABRst:values
          }
        });

      });
    }else{
      res.json({
        status:'1',
        msg:''
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

    fs.readFile(path.join(__dirname, "./../models/ABTestUploadPro/namelistPro",fields.hbaseTablePut3 + '_' + fields.rowKeyPut3 + "_namelist"), 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      }
      console.log(data);
      let arr = data.split(/[\s]*\n[\s]*/);

      //取出数组倒数第二个数，因为最后有个空格，所以实际是length-3；
      var last2 = arr[arr.length - 3];
      console.log(last2);
      fs.readFile(path.join(__dirname, "./../models/ABTestUploadPro",last2), 'utf8', (err, data) => {
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
                    if(success == true) {
                      var t1 = new Date().getTime();//timestamp

                      //maintain experiment files
                      fs.writeFile(path.join(__dirname, "./../models/ABTestUploadPro", t1.toString()), JSON.stringify(obj), function (err) {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log('ABtest experiment backup file done!');
                        }
                      });

                      //maintain name list
                      fs.appendFile(path.join(__dirname, "./../models/ABTestUploadPro/namelistPro",obj.hbaseTablePut3 +'_' + obj.rowKeyPut3 + '_namelist'), t1.toString() + '\n', function (err) {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log('Name list done!');
                        }
                      });

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
                    var time = new Date();   // 程序计时的月从0开始取值后+1
                    var m = time.getMonth() + 1;
                    var t = time.getFullYear() + "-" + m + "-"
                      + time.getDate() + " " + time.getHours() + ":"
                      + time.getMinutes() + ":" + time.getSeconds();
                    let emailContent = `<p>Roll Back Time:${t}</p>
                                <p>Operator: ${fields.operator_name}</p>
                                <p>A/B Testing Experiment Name:${obj.experiment_name}</p>
                                <p>Row Key:${fields.rowKeyPut3}</p>                         
                                <p>A/B Testing Content:${obj.abtestData}</p>`
                    sendEmail('(Production) Roll Back',emailContent);
                  });
                });
              });
          });
      });

    });


  });


});



module.exports = router;


