/*
*
* Node.js Router for stage.
*
* */

let express = require('express');
let router = express.Router();
let path = require('path');
let formidable = require('formidable');
let fs = require('fs');
let assert = require('assert');
let  hbase = require('hbase');
let sendEmail = require('./stage-send-email.js');

// var multiparty = require('multiparty');

let client = hbase({
  host:'localhost',
   port:8010
   // port: 8080
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

//file upload
router.post('/upload', function(req, res){

  let form = new formidable.IncomingForm();
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

      //Put to hbase
      client.table(fields.hbaseTablePut)
        // .create(fields.colFamilyPut, function(err, success){
        //  this
           .row(fields.rowKeyPut)
            .put(fields.colFamilyPut + ':model', JSON.stringify(obj), function(err, success) {//JSON.stringify(obj)
                  console.log(success);
                  // console.log(err);
                  if(success === true) {

                    let time = new Date();   // 程序计时的月从0开始取值后+1
                    let m = time.getMonth() + 1;
                    let t = time.getFullYear() + "-" + m + "-"
                      + time.getDate() + " " + time.getHours() + ":"
                      + time.getMinutes() + ":" + time.getSeconds();
                    let emailContent = `<p><span style="font-weight: bolder">Provision Time:&nbsp&nbsp</span>${t}</p>
                                      <p><span style="font-weight: bolder">Operator:&nbsp&nbsp</span>${fields.operator_name}</p>
                                      <p><span style="font-weight: bolder">Submission:&nbsp&nbsp</span>File</p>
                                      <p><span style="font-weight: bolder">Model Id:&nbsp&nbsp</span>${fields.rowKeyPut}</p>
                                      <p><span style="font-weight: bolder">Model Content:&nbsp&nbsp</span>${JSON.stringify(obj)}</p>`
                    sendEmail('(Stage Model)' + fields.rowKeyPut, emailContent);

                    res.json({
                      status: '0',
                      msg: '',
                    });
                  }else{
                    res.json({
                      status:'2',
                      msg:'',
                    });
                  }

           });
        // });
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

  let form = new formidable.IncomingForm();
  form.parse(req, function (err, fields) {

    // console.log(fields);//这里就是post的XXX 的数据

      //Insert to hbase
      // client.table(fields.hbaseTablePut2)
      //       .row(fields.rowKeyPut2)
      //       .put(fields.colFamilyPut2 + ':model', fields.jsonInput, function(err, success) {
      //         console.log('insert with json columns');
      //         console.log(success);
      //       if(success === true) {
      //         let time = new Date();   // 程序计时的月从0开始取值后+1
      //         let m = time.getMonth() + 1;
      //         let t = time.getFullYear() + "-" + m + "-"
      //           + time.getDate() + " " + time.getHours() + ":"
      //           + time.getMinutes() + ":" + time.getSeconds();
      //         let emailContent = `<p><span style="font-weight: bolder">Provision Time:&nbsp&nbsp</span>${t}</p>
      //                             <p><span style="font-weight: bolder">Operator:&nbsp&nbsp</span>${fields.operator_name}</p>
      //                             <p><span style="font-weight: bolder">Submission: &nbsp&nbsp</span>front-end entered</p>
      //                             <p><span style="font-weight: bolder">Model Id:&nbsp&nbsp</span>${fields.rowKeyPut2}</p>
      //                             <p><span style="font-weight: bolder">Model Content:&nbsp&nbsp</span>${fields.jsonInput}</p>`
      //         sendEmail('(Stage Model)' + fields.rowKeyPut2,emailContent);
      //         res.json({
      //           status: '0',
      //           msg: '',
      //         });
      //       }else{
      //         res.json({
      //           status:'1',
      //           msg:'',
      //         });
      //       }
      //
      //
      //       });
    res.json({
                status: '0',
                msg: '',
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
  let param = {
    rowKey:req.body.rowKey,
    hbaseTable:req.body.hbaseTable,
    colFamily:req.body.colFamily
  }
  console.log(req.body);

//Get from hbase
  let myRow = client.table(param.hbaseTable).row(param.rowKey);
  myRow.exists(param.colFamily,function(err,exists){
    if(exists){
      this.get(param.colFamily,function(err,values){

        console.log('get column family');
        values = values[0].$;
        // let valueNew = JSON.parse(values);
        // console.log(valueNew.model_id);

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

  let form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    console.log(fields);//这里就是post的数据

    //Insert to hbase
    client.table(fields.hbaseTablePut3)
          .row(fields.rowKeyPut3)
          .put(fields.colFamilyPut3 + ':content', fields.abtestData, function(err, success) {
            console.log('insert abtest data');
            console.log(success);
            if(success === true) {

              let t1 = new Date().getTime();//timestamp
              let fieldJ = JSON.stringify(fields);

              //maintain experiment files
              fs.writeFile(path.join(__dirname, "./../models/ABTestUpload", t1.toString()), fieldJ, function (err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log('ABtest experiment backup file done!');
                }
              });

              //maintain name list
              fs.appendFile(path.join(__dirname, "./../models/ABTestUpload/namelist",fields.hbaseTablePut3 +'_' + fields.rowKeyPut3 + '_namelist'), t1.toString() + '\n', function (err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log('Name list done!');

                  //读取上一份数据并放入邮件内
                  fs.readFile(path.join(__dirname, "./../models/ABTestUpload/namelist",fields.hbaseTablePut3 + '_' + fields.rowKeyPut3 + '_namelist'), 'utf8', (err, data) => {
                    if (err) {
                      console.log(err);
                    }
                    // console.log(data);
                    let arr = data.split(/[\s]*\n[\s]*/);

                    //取出数组倒数第二个数，因为最后有个空格，所以实际是length-3；
                    let last2 = arr[arr.length - 3];
                    console.log(last2);
                    let time = new Date();   // 程序计时的月从0开始取值后+1
                    let m = time.getMonth() + 1;
                    let t = time.getFullYear() + "-" + m + "-"
                      + time.getDate() + " " + time.getHours() + ":"
                      + time.getMinutes() + ":" + time.getSeconds();


                    client
                      .table('treatment_store')
                      .scan({
                        startRow: fields.rowKeyPut3,
                        endRow: fields.rowKeyPut3,
                        maxVersions: 2
                      }, function(err, values){
                        if (err === null) {
                          values.sort(function(a, b) {
                            return b.timestamp - a.timestamp;
                          })
                          if(values[1] == undefined){
                            let emailContent = `<p><span style="font-weight: bolder">Provision Time:&nbsp&nbsp</span>${t}</p>
                                      <p><span style="font-weight: bolder">Operator: &nbsp&nbsp</span>${fields.operator_name}</p>
                                      <p><span style="font-weight: bolder">Description: &nbsp&nbsp</span>${fields.description}</p>
                                      <p><span style="font-weight: bolder">A/B Testing Experiment Name:&nbsp&nbsp</span>${fields.experiment_name}</p>
                                      <p><span style="font-weight: bolder">Row Key:&nbsp&nbsp</span>${fields.rowKeyPut3}</p>
                                      <p style="font-weight: bolder">A/B Testing Content:&nbsp&nbsp</p>
                                      <p>${fields.abtestData}</p>
                                      <p><span style="font-weight: bolder">Previous A/B Content:&nbsp&nbsp</span>none</p>`
                            sendEmail('(Stage A/B Testing) ' + fields.rowKeyPut3 + " " + fields.description, emailContent);


                          }else {
                            let previousContent = values[1].$;
                            console.log(previousContent);
                            let emailContent = `<p><span style="font-weight: bolder">Provision Time:&nbsp&nbsp</span>${t}</p>
                                      <p><span style="font-weight: bolder">Operator: &nbsp&nbsp</span>${fields.operator_name}</p>
                                      <p><span style="font-weight: bolder">Description: &nbsp&nbsp</span>${fields.description}</p>
                                      <p><span style="font-weight: bolder">A/B Testing Experiment Name:&nbsp&nbsp</span>${fields.experiment_name}</p>
                                      <p><span style="font-weight: bolder">Row Key:&nbsp&nbsp</span>${fields.rowKeyPut3}</p>
                                      <p style="font-weight: bolder">A/B Testing Content:&nbsp&nbsp</p>
                                      <p>${fields.abtestData}</p>
                                      <p><span style="font-weight: bolder">Previous A/B Content:&nbsp&nbsp</span>${previousContent}</p>`
                            sendEmail('(Stage A/B Testing) ' + fields.rowKeyPut3 + " " + fields.description, emailContent);
                          }
                        }

                      });

                  });
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

          });
  });
});

/*
* Post with json entered
*
* */
router.post('/uploadABJson', function(req, res){

  let form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    console.log(fields);//这里就是post的XXX 的数据

    //Insert to hbase
    client.table(fields.hbaseTablePut3)
          .row(fields.rowKeyPut3)
          .put(fields.colFamilyPut3 + ':content', fields.jsonInput, function(err, success) {
            console.log('insert abtest data');
            console.log(success);
            if(success === true) {

              let t1 = new Date().getTime();//timestamp
              let fieldJ = JSON.stringify(fields);

              //maintain experiment files
              fs.writeFile(path.join(__dirname, "./../models/ABTestUpload", t1.toString()), fieldJ, function (err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log('ABtest experiment backup file done!');
                }
              });

              //maintain name list
              fs.appendFile(path.join(__dirname, "./../models/ABTestUpload/namelist",fields.hbaseTablePut3 +'_' + fields.rowKeyPut3 + '_namelist'), t1.toString() + '\n', function (err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log('Name list done!');
                }
              });
              let ex = JSON.parse(fields.jsonInput);
              let time = new Date();   // 程序计时的月从0开始取值后+1
              let m = time.getMonth() + 1;
              let t = time.getFullYear() + "-" + m + "-"
                + time.getDate() + " " + time.getHours() + ":"
                + time.getMinutes() + ":" + time.getSeconds();
              let emailContent = `<p><span style="font-weight: bolder">Provision Time:&nbsp&nbsp</span>${t}</p>
                                <p><span style="font-weight: bolder">Operator:&nbsp&nbsp</span>${fields.operator_name}</p>
                                <p><span style="font-weight: bolder">Submission:&nbsp&nbsp</span>Json</p>
                                <p><span style="font-weight: bolder">Description:&nbsp&nbsp</span>${fields.description}</p>
                                <p><span style="font-weight: bolder">A/B Testing Experiment Name:&nbsp&nbsp</span>${ex.experiment_name}</p>
                                <p><span style="font-weight: bolder">Row Key:&nbsp&nbsp</span>${fields.rowKeyPut3}</p>
                                <p><span style="font-weight: bolder">A/B Testing Content:&nbsp&nbsp</span>${fields.jsonInput}</p>`
              sendEmail('(Stage A/B Testing) ' + fields.rowKeyPut3 + " " + fields.description, emailContent);

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
*
* retrieve abtest data from database
* */
router.post("/hbaseABRetrieve", function (req,res,next) {
  // res.send('this is our hbase');
  let param = {
    rowKey:req.body.rowKey,
    hbaseTable:req.body.hbaseTable,
    colFamily:req.body.colFamily
  }
  console.log(req.body);

//Get from hbase
  let myRow = client.table(param.hbaseTable).row(param.rowKey);
  myRow.exists(param.colFamily ,function(err,exists){
    if(exists){
      this.get(param.colFamily,function(err,values){

        console.log('get column family');
        //console.log(values);

        let new_values = values[0].$;
        console.log(values);

        res.json({
          status:'0',
          msg:'',
          result:{
            ABRst:new_values,
            wholeData:values
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
* roll back submitted after checked
*
* */
router.post('/uploadRollBackSec', function(req, res){

  let form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    console.log(fields);//这里就是post的XXX 的数据

    let rollDataDeal = JSON.parse(fields.rollbackData);
    // console.log(rollDataDeal);
    let rollDataScan = rollDataDeal.result.rollbackRst;
    let baseName = rollDataScan.hbaseTablePut3;
    let colName = rollDataScan.colFamilyPut3;
    let rowKey = rollDataScan.rowKeyPut3
    let abtestData = rollDataScan.abtestData;
    console.log(abtestData);
    //Insert to hbase
    client.table(baseName)
          .row(rowKey)
          .put(colName + ':content', abtestData, function(err, success) {
            console.log('insert abtest data');
            console.log(success);
             if(success === true) {
              //
              let t1 = new Date().getTime();//timestamp
              let fieldJ = JSON.stringify(rollDataScan);

              //maintain experiment files
              fs.writeFile(path.join(__dirname, "./../models/ABTestUpload", t1.toString()), fieldJ, function (err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log('ABtest experiment backup file done!');
                }
              });

              //maintain name list
              fs.appendFile(path.join(__dirname, "./../models/ABTestUpload/namelist", baseName +'_' + rowKey + '_namelist'), t1.toString() + '\n', function (err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log('Name list done!');
                }
              });

              let ex = JSON.parse(abtestData);
              let time = new Date();   // 程序计时的月从0开始取值后+1
              let m = time.getMonth() + 1;
              let t = time.getFullYear() + "-" + m + "-"
                + time.getDate() + " " + time.getHours() + ":"
                + time.getMinutes() + ":" + time.getSeconds();
              let emailContent = `<p><span style="font-weight: bolder">Provision Time:&nbsp&nbsp</span>${t}</p>
                                <p><span style="font-weight: bolder">Operator:&nbsp&nbsp</span>${rollDataScan.operator_name}</p>
                                <p><span style="font-weight: bolder">A/B Testing Experiment Name:&nbsp&nbsp</span>${ex.experiment_name}</p>
                                <p><span style="font-weight: bolder">Row Key:&nbsp&nbsp</span>${rowKey}</p>
                                <p style="font-weight: bolder">A/B Testing Content:&nbsp&nbsp</p>
                                <p>${abtestData}</p>`
              sendEmail('(Stage A/B Testing) ' + rowKey + 'Roll Back',emailContent);

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
* Roll back get old ver directly
* */
router.post('/uploadRollBack', function(req, res){

  let form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {

    console.log(fields);//这里就是post的XXX 的数据

    fs.readFile(path.join(__dirname, "./../models/ABTestUpload/namelist",fields.hbaseTablePut3 + '_' + fields.rowKeyPut3 + '_namelist'), 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      }
      // console.log(data);
      let arr = data.split(/[\s]*\n[\s]*/);

     //取出数组倒数第二个数，因为最后有个空格，所以实际是length-3；
      let last2 = arr[arr.length - 3];
      console.log(last2);
      fs.readFile(path.join(__dirname, "./../models/ABTestUpload",last2), 'utf8', (err, data) => {
        if (err) {
          console.log(err);
        }

        let obj = JSON.parse(data);
        //console.log(obj.abtestData);
        console.log(obj);
        if(obj.abtestData === undefined) {
          res.json({
            status: '0',
            msg: '',
            result: {
              rollbackRst: obj
            }
          });
        }else{
          res.json({
            status: '0',
            msg: '',
            result: {
              rollbackRst: obj
            }
          });
        }

      //Put to hbase
      // client.table(obj.hbaseTablePut3)
      //   .create(obj.colFamilyPut3, function(err, success){
      //     this
      //       .row(obj.rowKeyPut3)
      //       .put(obj.colFamilyPut3 + ':content', obj.abtestData, function(err, success) {//JSON.stringify(obj)
      //             console.log(success);
      //             // if(success === true) {
      //             //   let t1 = new Date().getTime();//timestamp
      //             //   //maintain experiment files
      //             //   fs.writeFile(path.join(__dirname, "./../models/ABTestUpload", t1.toString()), JSON.stringify(obj), function (err) {
      //             //     if (err) {
      //             //       console.log(err);
      //             //     } else {
      //             //       console.log('ABtest experiment backup file done!');
      //             //     }
      //             //   });
      //             //
      //             //   //maintain name list
      //             //   fs.appendFile(path.join(__dirname, "./../models/ABTestUpload/namelist",obj.hbaseTablePut3 +'_' + obj.rowKeyPut3 + '_namelist'), t1.toString() + '\n', function (err) {
      //             //     if (err) {
      //             //       console.log(err);
      //             //     } else {
      //             //       console.log('Name list done!');
      //             //     }
      //             //   });
      //             //
      //             //   let time = new Date();   // 程序计时的月从0开始取值后+1
      //             //   let m = time.getMonth() + 1;
      //             //   let t = time.getFullYear() + "-" + m + "-"
      //             //     + time.getDate() + " " + time.getHours() + ":"
      //             //     + time.getMinutes() + ":" + time.getSeconds();
      //             //   let emailContent = `<p>Roll Back Time:${t}</p>
      //             //               <p>Operator: ${fields.operator_name}</p>
      //             //               <p>A/B Testing Experiment Name:${obj.experiment_name}</p>
      //             //               <p>Row Key:${fields.rowKeyPut3}</p>
      //             //               <p>A/B Testing Content:${obj.abtestData}</p>`
      //             //   sendEmail('(Stage) Roll Back',emailContent);
      //             //
      //             //   res.json({
      //             //     status: '0',
      //             //     msg: '',
      //             //   });
      //             // }else{
      //             //   res.json({
      //             //     status:'1',
      //             //     msg:'',
      //             //   });
      //             // }
      //
      //
      //
      //       });
      //   });

      });

    });

  });

});



module.exports = router;


