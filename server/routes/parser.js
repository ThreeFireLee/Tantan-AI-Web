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
        .create(fields.colFamilyPut, function(err, success){
         this
           .row(fields.rowKeyPut)
            .put(fields.colFamilyPut + ':model', JSON.stringify(obj), function(err, success) {//JSON.stringify(obj)
              this.get(fields.colFamilyPut, function (err, cells) {
                this.exists(function (err, exists) {
                  assert.ok(exists);
                  console.log(success);
                  if(success === true) {

                    let time = new Date();   // 程序计时的月从0开始取值后+1
                    let m = time.getMonth() + 1;
                    let t = time.getFullYear() + "-" + m + "-"
                      + time.getDate() + " " + time.getHours() + ":"
                      + time.getMinutes() + ":" + time.getSeconds();
                    let emailContent = `<p>Provision Time:${t}</p>
                                      <p>Operator: ${fields.operator_name}</p>
                                      <p>Submission: File</p>
                                      <p>Model Id:${fields.rowKeyPut}</p>
                                      <p>Model Content:${JSON.stringify(obj)}</p>`
                    sendEmail('(Stage) New model online updated', emailContent);

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

  let form = new formidable.IncomingForm();
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
            if(success === true) {
              let time = new Date();   // 程序计时的月从0开始取值后+1
              let m = time.getMonth() + 1;
              let t = time.getFullYear() + "-" + m + "-"
                + time.getDate() + " " + time.getHours() + ":"
                + time.getMinutes() + ":" + time.getSeconds();
              let emailContent = `<p>Provision Time:${t}</p>
                                  <p>Operator: ${fields.operator_name}</p>
                                  <p>Submission: front-end entered</p>
                                  <p>Model Id:${fields.rowKeyPut2}</p>
                                  <p>Model Content:${fields.jsonInput}</p>`
              sendEmail('(Stage) New model online updated',emailContent);
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
    console.log(fields);//这里就是post的XXX 的数据

    //Insert to hbase
    client.table(fields.hbaseTablePut3)
      .create(fields.colFamilyPut3, function(err, success){
        this
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
                    console.log(data);
                    let arr = data.split(/[\s]*\n[\s]*/);

                    //取出数组倒数第二个数，因为最后有个空格，所以实际是length-3；
                    let last2 = arr[arr.length - 3];
                    console.log(last2);
                    let time = new Date();   // 程序计时的月从0开始取值后+1
                    let m = time.getMonth() + 1;
                    let t = time.getFullYear() + "-" + m + "-"
                      + time.getDate() + " " + time.getHours() + ":"
                      + time.getMinutes() + ":" + time.getSeconds();
                    if(last2 === undefined){
                      console.log('no previous version');
                      let emailContent = `<p>Provision Time:${t}</p>
                                      <p>Operator: ${fields.operator_name}</p>
                                      <p>A/B Testing Experiment Name:${fields.rowKeyPut3}</p>
                                      <p>Row Key:${fields.experiment_name}</p>
                                      <p>A/B Testing Content:${fields.abtestData}</p>
                                      <p>Previous A/B Content: none</p>`
                      sendEmail('(Stage) New A/B Test online updated',emailContent);
                    }else{
                      console.log('correct');
                      fs.readFile(path.join(__dirname, "./../models/ABTestUpload",last2), 'utf8', (err, data) => {
                        if (err) {
                          console.log(err);
                        }
                        console.log(data);
                        let obj = JSON.parse(data);
                        //console.log(obj.abtestData);
                        console.log(obj);
                        if(obj.abtestData === undefined){
                          let emailContent = `<p>Provision Time:${t}</p>
                                      <p>Operator: ${fields.operator_name}</p>
                                      <p>A/B Testing Experiment Name:${fields.rowKeyPut3}</p>
                                      <p>Row Key:${fields.experiment_name}</p>
                                      <p>A/B Testing Content:${fields.abtestData}</p>
                                      <p>Previous A/B Content:${obj.jsonInput}</p>`
                          sendEmail('(Stage) New A/B Test online updated', emailContent);
                        }else {
                          let emailContent = `<p>Provision Time:${t}</p>
                                      <p>Operator: ${fields.operator_name}</p>
                                      <p>A/B Testing Experiment Name:${fields.rowKeyPut3}</p>
                                      <p>Row Key:${fields.experiment_name}</p>
                                      <p>A/B Testing Content:${fields.abtestData}</p>
                                      <p>Previous A/B Content:${obj.abtestData}</p>`
                          sendEmail('(Stage) New A/B Test online updated', emailContent);

                        }

                      });
                    }


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
    // res.json({
    //               status: '0',
    //               msg: '',
    //             });
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
      .create(fields.colFamilyPut3, function(err, success){
        this
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
              let emailContent = `<p>Provision Time:${t}</p>
                                <p>Operator: ${fields.operator_name}</p>
                                <p>Submission: Json</p>
                                <p>A/B Testing Experiment Name:${ex.experiment_name}</p>
                                <p>Row Key:${fields.rowKeyPut3}</p>
                                <p>A/B Testing Content:${fields.jsonInput}</p>`
              sendEmail('(Stage) New A/B Test online updated',emailContent);

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

        values = values[0].$;
        console.log(values);
        //let new_value = JSON.stringify(values);
        //console.log(new_value);
        //console.log(new_value.model_type);

        //values = JSON.stringify(values).replace(/[\\]/g,'');
        //values = JSON.stringify(values).replace(reg,"");
        // values = values.replace('"$":"{','"$":{');
        // values = values.replace('}"}]','}}');
        // values = values.replace('}"}"}]','}}}');
        // values = values.replace('modelContent": "{"','modelContent": {"');
        // values = values.replace('[{"column":"','{"column":"');

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
* Retrieve traffic/treatment with user id
* */
// router.post("/ABTestUserId", function (req,res,next) {
//   // res.send('this is our hbase');
//   let param = {
//     rowKey:req.body.rowKey,
//     hbaseTable:req.body.hbaseTable,
//     colFamily:req.body.colFamily,
//     searchUserId:req.body.searchUserId
//   }
//   console.log(req.body);
//
// //Get from hbase
//   let myRow = client.table(param.hbaseTable).row(param.rowKey);
//   myRow.exists(param.colFamily ,function(err,exists){
//     if(exists){
//       this.get(param.colFamily,function(err,values){
//
//         console.log('get column family');
//         //console.log(values);
//
//         values = values[0].$;
//         values = JSON.parse(values);
//         console.log(values);
//         for(let i = 0; i < values.whitelists.length; i++){
//           for(let j = 0; j< values.whitelists[i].user_ids.length; j++){
//                 if(param.searchUserId === values.whitelists[i].user_ids[j]){
//
//                   console.log(values.whitelists[i].treatment);
//
//                   res.json({
//                     status:'0',
//                     msg:'',
//                     result:{
//                       ABRst:values
//                     }
//                   });
//                   return false;
//                 }
//           }
//         }
//
//         res.json({
//           status:'2',
//           msg:''
//         });
//
//       });
//     }else{
//       res.json({
//         status:'1',
//         msg:''
//       });
//     }
//   });
// });

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
    let baseName = rollDataDeal.result.rollbackRst.hbaseTablePut3;
    let colName = rollDataDeal.result.rollbackRst.colFamilyPut3;
    let rowKey = rollDataDeal.result.rollbackRst.rowKeyPut3
    let abtestData = rollDataDeal.result.rollbackRst.abtestData;
    console.log(abtestData);
              //
              //
              //
              // res.json({
              //   status: '0',
              //   msg: '',
              // });

    //Insert to hbase
    client.table(baseName)
      .create(colName, function(err, success){
        this
          .row(rowKey)
          .put(colName + ':content', abtestData, function(err, success) {
            console.log('insert abtest data');
            console.log(success);
             if(success === true) {
              //
              // let t1 = new Date().getTime();//timestamp
              // let fieldJ = JSON.stringify(fields);

              //maintain experiment files
              // fs.writeFile(path.join(__dirname, "./../models/ABTestUpload", t1.toString()), fieldJ, function (err) {
              //   if (err) {
              //     console.log(err);
              //   } else {
              //     console.log('ABtest experiment backup file done!');
              //   }
              // });
              //
              // //maintain name list
              // fs.appendFile(path.join(__dirname, "./../models/ABTestUpload/namelist",fields.hbaseTablePut3 +'_' + fields.rowKeyPut3 + '_namelist'), t1.toString() + '\n', function (err) {
              //   if (err) {
              //     console.log(err);
              //   } else {
              //     console.log('Name list done!');
              //   }
              // });
              // let ex = JSON.parse(fields.abtestData);
              // let time = new Date();   // 程序计时的月从0开始取值后+1
              // let m = time.getMonth() + 1;
              // let t = time.getFullYear() + "-" + m + "-"
              //   + time.getDate() + " " + time.getHours() + ":"
              //   + time.getMinutes() + ":" + time.getSeconds();
              // let emailContent = `<p>Provision Time:${t}</p>
              //                   <p>Operator: ${fields.operator_name}</p>
              //                   <p>Submission: Json</p>
              //                   <p>A/B Testing Experiment Name:${ex.experiment_name}</p>
              //                   <p>Row Key:${fields.rowKeyPut3}</p>
              //                   <p>A/B Testing Content:${fields.abtestData}</p>`
              // sendEmail('(Stage) New A/B Test online updated',emailContent);

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


