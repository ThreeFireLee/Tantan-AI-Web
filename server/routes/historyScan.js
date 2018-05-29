let express = require('express');
let router = express.Router();
let path = require('path');
let formidable = require('formidable');
let fs = require('fs');
let assert = require('assert');
let md5 = require('js-md5');
let  hbase = require('hbase');

let client = hbase({
  host:'localhost',
  port:8010
});

router.get('/', function(req, res, next) {
  res.send('this is our history');

});


/*
* Retrieve traffic/treatment with user id
* */
router.post("/ABTestUserId", function (req,res,next) {
  // res.send('this is our hbase');
  let param = {
    rowKey:req.body.rowKey,
    hbaseTable:req.body.hbaseTable,
    colFamily:req.body.colFamily,
    searchUserId:req.body.searchUserId
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
        values = JSON.parse(values);
        console.log(values);
        for(let i = 0; i < values.whitelists.length; i++){
          for(let j = 0; j< values.whitelists[i].user_ids.length; j++){
                if(param.searchUserId == values.whitelists[i].user_ids[j]){

                  console.log(values.whitelists[i].treatment);

                  res.json({
                    status:'0',
                    msg:'',
                    result:{
                      ABRst:values,
                      treatment_el:values.whitelists[i].treatment,

                    }
                  });
                  return false;
                }
          }
        }

        let userId = param.searchUserId;
        let hashId = values.hash_id;
        let finalId = userId.toString() + hashId.toString();

        // let new_md5 = md5.create();
        // new_md5.update(finalId);
        // console.log(new_md5);

        finalId = md5(finalId);
        console.log(finalId);
        let max_hex = Math.pow(2,128);
        let rst = finalId/max_hex;
        console.log(rst);


        res.json({
          status:'2',
          msg:''
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


module.exports = router;
