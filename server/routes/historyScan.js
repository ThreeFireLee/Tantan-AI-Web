/**
 * @author Yan Li
 * @company tantan
 * @Description:
 */

let express = require('express');
let router = express.Router();
let hbase = require('hbase');
let bigInt = require("big-integer");
let crypto = require('crypto');
let config = require('../config/config');


let client = hbase({
  host: config.production_host,
  port:config.production_port
});

router.get('/', function(req, res, next) {
  res.send('this is our history');

});

/*
* A/B Testing Search list
* */
router.post('/AbSearch', function(req, res, next) {
  let param = {
    rowKey:req.body.rowKey,
  }

  // scan hbase
  client
    .table('treatment_store')
    .scan({
      startRow: param.rowKey,
      endRow: param.rowKey,
      maxVersions: 100
    }, function(err, values){
      if (err === null) {
        values.sort(function(a, b) {
          return b.timestamp - a.timestamp;
        });
        res.json({
          status: '0',
          msg: '',
          result:{
            hbaseRst: values
          }
        });

      }
      else {
        res.json({
          status:'1',
          msg:'',
        });
      }

    });

});

/*
* A/B Testing production experiments list
* */
router.get('/AbHistory', function(req, res, next) {
  // scan hbase
  client
    .table('treatment_store')
    .scan({
      maxVersions: 100
    }, function(err, values){
      if (err === null) {
        values.sort(function(a, b) {
          return b.timestamp - a.timestamp;
        })
        res.json({
          status: '0',
          msg: '',
          result:{
            hbaseRst: values
          }
        });

      }
      else {
        res.json({
          status:'1',
          msg:'',
        });
      }

    });

});


//scan model
router.get("/modelScan", function (req,res,next) {

  client
    .table('mods_model_storage')
    .scan({
      maxVersions: 1
    }, function(err, values){
      if (err === null){

         values.sort(function(a, b) {
          return b.timestamp - a.timestamp;
        })
        // for(let i = 0; i < values.length; i++){
        //   console.log(values[i].timestamp);
        // }

        res.json({
          status:'0',
          msg:'',
          result:{
            finalRst: values
          }

        });


      }
      else {
        res.json({
          status:'1',
          msg:'',
        });
        console.log('error is' + err)
      }

    });


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



        //calculate the percentage with md5
        let userId = param.searchUserId;
        let hashId = values.hash_id;
        let finalId = userId.toString() + hashId.toString();
        console.log(finalId);

        let TEN_K_DIVIDER = bigInt("1000");

        let md5 = crypto.createHash('md5');
        md5.update(finalId);
        let digest = md5.digest('hex');
        console.log(digest);

        let max_md5 = bigInt("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF", 16);
        console.log(max_md5);
        let rst = bigInt(digest,16).times(TEN_K_DIVIDER).divide(max_md5) / 10.0;

        console.log(rst);

        for(let z = 0; z < values.ramp.length; z++){
          if(z == 0 && rst <= values.ramp[0].percentage){
            console.log(values.ramp[0].treatment);
            res.json({
              status:'0',
              msg:'',
              result:{
                treatment_el:values.ramp[0].treatment

              }
            });
            return false;
          }

          let new_percents = 0;
          for(let x = 0; x <= z; x++){
            new_percents += values.ramp[x].percentage;
          }

          if(rst <= new_percents){
            res.json({
              status:'0',
              msg:'',
              result:{
                treatment_el:values.ramp[z].treatment
              }
            });
            return false;
          }
        }

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
