<template>
  <div>
    <nav-header></nav-header>
    <nav-bread-crumb>
      <span>A/B Testing Production</span>
    </nav-bread-crumb>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>Operations</dt>
              <dd><a href="/" v-bind:class="{'cur':operationChose=='model'}" @click="operationChose='model'">Model</a></dd>
              <dd><a href="javascript:void(0)" v-bind:class="{'cur':operationChose=='abtest'}" @click="operationChose='abtest-1'">A/B Testing</a></dd>
              <!--<dd><a href="javascript:void(0)" v-bind:class="{'cur':operationChose=='wait-test'}" @click="operationChose='wait-test'">Wait for test</a></dd>-->
            </dl>
          </div>

          <!-- main operation panel-->
          <div class="accessory-list-wrap">
            <div class="model-main">
              <form action=""  method="post" enctype="multipart/form-data">
                <div class="model-quarter-div">
                  <label>Operator: </label>
                  <input type="text" name="operator_name" id="operator_name" v-model="abtestPro.operator_name" placeholder="operator name"class="input-light seg-name">
                  <br><br>
                  <lable for="experiment_id">experiment id:</lable>
                  <input type="text" name="experiment_id" id="experiment_id" v-model="abtestPro.abtestCore.experiment_id" placeholder="1,2,3..." class="txt input-light ex-name-css">
                  <br>
                  <lable for="hbaseTablePut3">Table Name:  </lable>
                  <!--<input type="text" name="hbaseTablePut3" id="hbaseTablePut3" v-model="abtestPro.hbaseTablePut3" placeholder="e.g: treatment_store" class="txt input-light table-name-css">-->
                  <el-input
                    placeholder="Default value here"
                    v-model="abtestPro.hbaseTablePut3"
                    :disabled="true"
                    style="width:250px"
                    class="table-name-css">
                  </el-input>
                  <br>
                  <lable for="rowKeyPut3">Row Key:</lable>
                  <input type="text" name="rowKeyPut3" id="rowKeyPut3" v-model="abtestPro.rowKeyPut3" placeholder="row key" class="txt input-light row-key-css">
                  <button type="primary" @click="onRetrieve($event)" class="btn-4 button-primary">Retrieve</button>
                  <button type="primary" @click="submitRollBack($event)" class="btn-4 button-primary">RollBack</button>
                  <br>
                  <lable for="colFamilyPut3">Column Family:</lable>
                  <!--<input type="text" name="colFamilyPut3" id="colFamilyPut3" v-model="abtestPro.colFamilyPut3" placeholder="Col Family" class="txt input-light col-family-css">-->
                  <el-input
                    placeholder="Default value here"
                    v-model="abtestPro.colFamilyPut3"
                    :disabled="true"
                    style="width:250px"
                    class="col-family-css">
                  </el-input>
                  <br><br>
                  <label>Experiment name</label>
                  <label class="abtest-right-move">Hash Id</label><br>
                  <input type="text" name="experiment_name" id="experiment_name" v-model="abtestPro.abtestCore.experiment_name" placeholder="e.g.tantan-rec-male-mlc0" class="txt input-light abtest-Name-css">
                  <input type="text" name="hash_id" id="hash_id" v-model="abtestPro.abtestCore.hash_id" placeholder="hash id" class="txt input-light abtest-Hash-css">

                  <div v-for="l in abtestPro.abtestCore.whitelists">
                    <br><br>
                    <input type="text" v-model="l.treatment" placeholder="treatment name" class="input-light seg-name">
                    <input type="text" v-model="l.user_ids" placeholder="white list(user ids)" class="txt input-light abtest-seg">
                  </div>
                  <br><br>
                  <button v-on:click="submitForReview($event)" class="btn button-primary">Review</button>
                  <button v-on:click="submitWhiteList($event)" class="btn button-primary the-submit">Provision</button>
                  <br>
                  <el-input
                    type="textarea"
                    :rows="4"
                    style="width: 525px; margin-bottom: 20px"
                    placeholder="Your Json"
                    v-model="jsonArea">
                  </el-input>
                  <br>
                  <el-button type="primary" style="margin: 2px 0 40px 190px" @click="submitABwithJson($event)">Json Provision</el-button>
                  <br>
                  <label>Notification List: </label>
                  <!--<input type="text" v-model="abtestPro.email_person" placeholder="" class="input-light seg-name">-->
                  <input list="emailList">

                  <datalist id="emailList">
                    <option>AI推荐事业部</option>
                    <option>wuxianren@p1.com</option>
                    <option>hubo@p1.com</option>
                    <option>zhoushan@p1.com</option>
                    <option>tanyunzhi@p1.com</option>
                    <option>liumeng@p1.com</option>
                    <option>gaomochi@p1.com</option>
                    <option>huanghaihun@p1.com</option>
                    <option>liao@p1.com</option>
                    <option>lihuili@p1.com</option>
                    <option>yangzeyu@p1.com</option>
                    <option>chencangxiong@p1.com</option>
                    <option>pengdesheng@p1.com</option>
                    <option>liyan@p1.com</option>
                    <option>wuzuxiang@p1.com</option>
                  </datalist>
                  <br><br><br><br>
                </div>


                <div class="model-quarter-div">
                  <p2>Total Percent: </p2> {{sumValue()}} %
                  <a href="/#/abtest"  class="button-2 button-primary button-rounded button-small stage-production-place">>>>Stage</a>
                  <br>
                  <div v-for="(l,index) in abtestPro.abtestCore.ramp">
                    <br>
                    <input type="text" v-model="l.percentage" placeholder="" class="txt input-light abtest-ramp">%
                    <input type="text" v-model="l.treatment" placeholder="treatment name" class="input-light abtest-ramp-name">
                    <br>
                    <span>{{format(index)}}</span>
                  </div>
                  <br><br>
                </div>
              </form>
            </div>


          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import './../assets/css/base.css'
  import './../assets/css/product.css'
  import './../assets/css/login.css'
  import NavHeader from '@/components/NavHeader.vue'  // @ means src file
  import NavBreadCrumb from '@/components/NavBread.vue'
  import axios from 'axios'
  import FPC from 'floating-point-calculator';
  //import NavFooter from '@/components/NavFooter.vue'

  export default {
    data(){
      return {
        message: '',
        operationChose: 'abtest-1',

        abtestPro:{
          hbaseTablePut3:'treatment_store',
          colFamilyPut3:'f',
          rowKeyPut3:'',
          abtestCore:{
            experiment_name:'',
            experiment_id:'',
            hash_id:'',
            whitelists: [{
              user_ids: '',
              treatment:''
            },
              {
                user_ids: '',
                treatment:''
              },
              {
                user_ids: '',
                treatment:''
              },
              {
                user_ids: '',
                treatment:''
              },
              {
                user_ids:'',
                treatment:''
              }
            ],
            ramp:[
              {
                treatment:'',//"model_001_lr_like_mlc0",
                percentage:'',
              },
              {
                treatment:'',
                percentage:''
              },
              {
                treatment:'',
                percentage:''
              },
              {
                treatment:'',
                percentage:''
              },
              {
                treatment:'',
                percentage:''
              },
              {
                treatment:'',
                percentage:''
              },
              {
                treatment:'',
                percentage:''
              },
              {
                treatment:'',
                percentage:''
              },
              {
                treatment:'',
                percentage:''
              },
              {//10
                treatment:'',
                percentage:''
              },
              {
                treatment:'',
                percentage:''
              },
              {
                treatment:'',
                percentage:''
              },
              {
                treatment:'',
                percentage:''
              },
              {
                treatment:'',
                percentage:''
              },
              {
                treatment:'',
                percentage:''
              },
              {
                treatment:'',
                percentage:''
              },
              {
                treatment:'',
                percentage:''
              },
              {
                treatment:'',
                percentage:''
              },
              {
                treatment:'',
                percentage:''
              },
              {
                treatment:'',
                percentage:''
              }

            ]

          },
          operator_name:''
        },
        jsonArea:''

      }
    },
    components: {
      NavHeader:NavHeader,
      NavBreadCrumb:NavBreadCrumb
    },

    methods: {
      sumValue() {
        return  this.abtestPro.abtestCore.ramp.reduce((total,value) => {
          return Number.isNaN(parseFloat(value.percentage)) ?
            total :
            FPC.add(total,parseFloat(value.percentage))
        },0);
      },
      //show percentage section
      format (index) {
        let p = 0;
        let val =  this.abtestPro.abtestCore.ramp;
        for (let i = 0; i < index; i++) {
          let cur = val[i].percentage;
          if (!Number.isNaN(parseFloat(cur))) {
            p = FPC.add(p, parseFloat(cur))
          }
        }
        let a = p;
        let cur = val[index].percentage;
        if (!Number.isNaN(parseFloat(cur))) {
          a = FPC.add(a, parseFloat(cur))
        }
        return `[${p}%~${a}%)`
      },

      //retrieve ABTEST data from hbase
      onRetrieve(event) {
        event.preventDefault();
        if(this.abtestPro.rowKeyPut3 == ""){
          this.$message({
            showClose: true,
            message: '警告,row key 不能为空！',
            type: 'warning'
          });
          return false;
        }

        axios.post("/parserPro/hbaseABRetrieve",
          {
            rowKey:this.abtestPro.rowKeyPut3,
            hbaseTable: this.abtestPro.hbaseTablePut3,
            colFamily: this.abtestPro.colFamilyPut3
          },

        ).then(rst =>{
          var res = rst.data;
          if(res.status == 0) {
            this.abExperimentRst = res.result.ABRst;//都是parser内的参数，比如这里的result和habseRst

            //we need parse so that we can take value from JSON form
            let dataAfterParse = JSON.parse(this.abExperimentRst);
            this.abtestPro.abtestCore.experiment_name = dataAfterParse.experiment_name;
            this.abtestPro.abtestCore.experiment_id = dataAfterParse.experiment_id;
            this.abtestPro.abtestCore.hash_id = dataAfterParse.hash_id;
            this.abtestPro.abtestCore.whitelists = dataAfterParse.whitelists;
            this.abtestPro.abtestCore.ramp = dataAfterParse.ramp;
          }else{
            this.$message.error('错误，无此row key！');
          }
        });
      },
      submitABwithJson(event){
        event.preventDefault();
        if(this.abtestPro.rowKeyPut3 == ""){
          this.$message({
            showClose: true,
            message: '警告,row key 不能为空！',
            type: 'warning'
          });
          return false;
        }
        if(this.abtestPro.operator_name == ""){
          this.$message({
            showClose: true,
            message: '警告, 请填写操作人',
            type: 'warning'
          });
          return false;
        }
        if(this.abtestPro.jsonArea == ""){
          this.$message({
            showClose: true,
            message: '警告, 提交json内容不能为空！',
            type: 'warning'
          });
          return false;
        }

        let formData = new FormData();
        formData.append('hbaseTablePut3', this.abtestPro.hbaseTablePut3);
        formData.append('rowKeyPut3', this.abtestPro.rowKeyPut3);
        formData.append('colFamilyPut3', this.abtestPro.colFamilyPut3);
        formData.append('operator_name', this.abtestPro.operator_name);

        let jsonTest = this.jsonArea;

        //get rid of break line symbols
        jsonTest = jsonTest.replace(/\ +/g,"");
        jsonTest = jsonTest.replace(/\t/g,"");
        jsonTest = jsonTest.replace(/\r\n/g,"");
        jsonTest = jsonTest.replace(/\n/g,"");

        //json format test
        try
        {
          if (typeof JSON.parse(jsonTest) == "object") {
            //formData.append('jsonInput', jsonTest);
            console.log(jsonTest);
          }
        }
        catch(err)
        {
          this.$message.error('错误，非正确json格式！' + err);
          return false;//如果报错，则防止程序继续执行
        }


        formData.append('jsonInput', jsonTest);
        console.log(jsonTest);
        //formData.append('jsonInput', this.InputWithType.jsonInput);


        let config = {
          headers:{'Content-Type':'multipart/form-data'}
        };


        axios.post("/parserPro/uploadABJson", formData
          ,config
        ).then(rst =>{
          var res = rst.data;
          if(res.status == 0){
            this.$notify({
              title: '提交成功',
              message: '数据已写入',
              type: 'success'
            });
          }else if(res.status == 1){
            this.$notify.error({
              title: '提交失败',
              message: '数据未写入'
            });
          }
          console.log(res);
          console.log('Success! From node.js');
        })
      },

      //review your json input
      submitForReview(event){
        event.preventDefault();
        let abtestDataReviewOri = JSON.stringify(this.abtestPro.abtestCore);
        let abtestDataReview =  abtestDataReviewOri
          .replace('{"user_ids":"","treatment":""},','')
          .replace('{"user_ids":"","treatment":""},','')
          .replace('{"user_ids":"","treatment":""},','')
          .replace('{"user_ids":"","treatment":""},','')
          .replace(',{"user_ids":"","treatment":""}','')


          .replace(',{"treatment":"","percentage":""}','')
          .replace(/{"treatment":"","percentage":""},/,'')
          .replace(',{"treatment":"","percentage":""}','')
          .replace(/{"treatment":"","percentage":""},/,'')
          .replace(',{"treatment":"","percentage":""}','')
          .replace(/{"treatment":"","percentage":""},/,'')
          .replace(',{"treatment":"","percentage":""}','')
          .replace(/{"treatment":"","percentage":""},/,'')
          .replace(',{"treatment":"","percentage":""}','')
          .replace(/{"treatment":"","percentage":""},/,'')
          .replace(',{"treatment":"","percentage":""}','')
          .replace(/{"treatment":"","percentage":""},/,'')
          .replace(',{"treatment":"","percentage":""}','')
          .replace(/{"treatment":"","percentage":""},/,'')
          .replace(',{"treatment":"","percentage":""}','')
          .replace(/{"treatment":"","percentage":""},/,'')
          .replace(',{"treatment":"","percentage":""}','')
          .replace(/{"treatment":"","percentage":""},/,'')
          .replace(',{"treatment":"","percentage":""}','')
          .replace(/{"treatment":"","percentage":""},/,'')

        const h = this.$createElement;
        this.$msgbox({
          title: 'Your Json',
          message: h('p', null, [
            h('span', null, abtestDataReview),
          ]),
        })
      },
      submitWhiteList(event){
        event.preventDefault();
        if(this.abtestPro.rowKeyPut3 == ""){
          this.$message({
            showClose: true,
            message: '警告，row key 不能为空！',
            type: 'warning'
          });
          return false;
        }
        if(this.abtestPro.operator_name == ""){
          this.$message({
            showClose: true,
            message: '警告，请填写操作人！',
            type: 'warning'
          });
          return false;
        }
        if(this.abtestPro.abtestCore.experiment_name == ""){
          this.$message({
            showClose: true,
            message: '警告，experiment name未填写！',
            type: 'warning'
          });
          return false;
        }
        if(this.abtestPro.abtestCore.hash_id == ""){
          this.$message({
            showClose: true,
            message: '警告，hash id未填写！',
            type: 'warning'
          });
          return false;
        }
        //parse user_ids to array
        this.abtestPro.abtestCore.whitelists = this.abtestPro.abtestCore.whitelists.map(x =>({
          user_ids: x.user_ids.split(',').filter(x => x.trim()).map(x => Number(x)),
          treatment: x.treatment
          // 先分割 ， 字符串 然后 过滤掉空字符串。
          // 因为如果本身是空字符串 的话 会生成一个长度是1的空字符串列表
          //user_ids: x.user_ids.split('，').filter(x => x.trim())
        }));

        this.abtestPro.abtestCore.ramp= this.abtestPro.abtestCore.ramp.map(y =>({
          treatment: y.treatment,
          percentage: Number.isNaN(parseFloat(y.percentage)) ? null:parseFloat(y.percentage)

        }));
        //judge whether the input is valid number (not character )
        let whitelists_length = this.abtestPro.abtestCore.whitelists.length;
        let n=0;
        for (n; n<whitelists_length; n++)  {
          let new_user = this.abtestPro.abtestCore.whitelists[n].user_ids;
          let userid_length = new_user.length;
          let i=0;
          for (i; i<userid_length;i++){
            if(Number.isNaN(parseInt(new_user[i]))){
              this.$message({
                showClose: true,
                message: '警告，user id必须是数字！',
                type: 'warning'
              });
              return false;
            }
          }
        }

        this.abtestPro.abtestCore.experiment_id = parseInt(this.abtestPro.abtestCore.experiment_id);
        let formData = new FormData();
        let abtestDataOri = JSON.stringify(this.abtestPro.abtestCore);
        let abtestData =  abtestDataOri
          .replace(/{"user_ids":[],"treatment":""},/,'')
          .replace(',{"user_ids":[],"treatment":""}','')
          .replace(/{"user_ids":[],"treatment":""},/,'')
          .replace(',{"user_ids":[],"treatment":""}','')
          .replace(/{"user_ids":[],"treatment":""},/,'')
          .replace(',{"user_ids":[],"treatment":""}','')
          .replace(/{"user_ids":[],"treatment":""},/,'')
          .replace(',{"user_ids":[],"treatment":""}','')
          .replace(/{"user_ids":[],"treatment":""},/,'')
          .replace(',{"user_ids":[],"treatment":""}','')


          .replace(',{"treatment":"","percentage":null}','')
          .replace(/{"treatment":"","percentage":null},/,'')
          .replace(',{"treatment":"","percentage":null}','')
          .replace(/{"treatment":"","percentage":null},/,'')
          .replace(',{"treatment":"","percentage":null}','')
          .replace(/{"treatment":"","percentage":null},/,'')
          .replace(',{"treatment":"","percentage":null}','')
          .replace(/{"treatment":"","percentage":null},/,'')
          .replace(',{"treatment":"","percentage":null}','')
          .replace(/{"treatment":"","percentage":null},/,'')
          .replace(',{"treatment":"","percentage":null}','')
          .replace(/{"treatment":"","percentage":null},/,'')
          .replace(',{"treatment":"","percentage":null}','')
          .replace(/{"treatment":"","percentage":null},/,'')
          .replace(',{"treatment":"","percentage":null}','')
          .replace(/{"treatment":"","percentage":null},/,'')
          .replace(',{"treatment":"","percentage":null}','')
          .replace(/{"treatment":"","percentage":null},/,'')
          .replace(',{"treatment":"","percentage":null}','')
          .replace(/{"treatment":"","percentage":null},/,'')


        formData.append('hbaseTablePut3', this.abtestPro.hbaseTablePut3);
        formData.append('colFamilyPut3', this.abtestPro.colFamilyPut3);
        formData.append('rowKeyPut3', this.abtestPro.rowKeyPut3);
        formData.append('experiment_name', this.abtestPro.abtestCore.experiment_name);
        formData.append('abtestData', abtestData);
        formData.append('operator_name', this.abtestPro.operator_name);
        //100% validation
        let result = this.sumValue();
        if (result !== 100){
          this.$message.error('错误，Allocation percentage not 100%');
          return false;
        } else {
          this.$message({
            message: 'Allocation percentage is correct!',
            type: 'success'
          });
        }


        let config = {
          headers:{'Content-Type':'multipart/form-data'}
        };


        axios.post("/parserPro/uploadABtest", formData
          ,config
        ).then(rst =>{
          var res = rst.data;
          if(res.status == 0){
            this.$notify({
              title: '提交成功',
              message: '数据已写入',
              type: 'success'
            });
          }else if(res.status == 1){
            this.$notify.error({
              title: '提交失败',
              message: '数据未写入'
            });
          }
          console.log('Success! From node.js');
        })
          .catch(function(){
            console.log('FAILURE!!');
          });
      },
      submitRollBack(event){
        event.preventDefault();
        if(this.abtestPro.operator_name == ""){
          this.$message({
            showClose: true,
            message: '警告，请填写操作人！',
            type: 'warning'
          });
          return false;
        }
        if(this.abtestPro.rowKeyPut3 == ""){
          this.$message({
            showClose: true,
            message: '警告，row key 不能为空！',
            type: 'warning'
          });
          return false;
        }
        this.$confirm('是否确认回滚?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '回滚提交!'
          });
          let formData = new FormData();
          formData.append('operator_name', this.abtestPro.operator_name);
          formData.append('hbaseTablePut3', this.abtestPro.hbaseTablePut3);
          formData.append('rowKeyPut3', this.abtestPro.rowKeyPut3);
          axios.post("/parserPro/uploadRollBack", formData
          ).then(rst =>{
            var res = rst.data;
            if(res.status == 0){
              this.$notify({
                title: '提交成功',
                message: '数据已覆盖',
                type: 'success'
              });
            }else if(res.status == 1){
              this.$notify.error({
                title: '提交失败',
                message: '数据未覆盖'
              });
            }
            console.log('Success! From node.js');
          })
            .catch(function(){
              console.log('FAILURE!!');
            });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });

      }

    }


  }

</script>

<!--<input type="text" name="ramping_1" id="ramping_1" v-model="abtest1.ramping_1" placeholder="" class="txt input-light abtest-ramp">-->
