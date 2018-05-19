<template>
  <div>
    <nav-header></nav-header>
    <nav-bread-crumb>
      <span>A/B Testing Stage</span>
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
                <!--:model="abtest1" id="abtest1"-->
                <div class="model-quarter-div">
                  <label>Operator: </label>
                  <input type="text" name="operator_name" id="operator_name" v-model="abtest1.operator_name" placeholder="operator name"class="input-light seg-name">
                  <br><br>
                  <lable for="experiment_id">experiment id:</lable>
                  <input type="text" name="experiment_id" id="experiment_id" v-model="abtest1.experiment_id" placeholder="1,2,3... " class="txt input-light ex-name-css">
                  <br>
                  <lable for="hbaseTablePut3">Table Name:  </lable>
                  <!--<input type="text" name="hbaseTablePut3" id="hbaseTablePut3" v-model="abtest1.hbaseTablePut3" placeholder="e.g: treatment_store" class="txt input-light table-name-css">-->
                  <el-input
                    placeholder="Default value here"
                    v-model="abtest1.hbaseTablePut3"
                    :disabled="true"
                    style="width:250px"
                    class="table-name-css">
                  </el-input>
                  <br>
                  <lable for="rowKeyPut3">Row Key:</lable>
                  <input type="text" name="rowKeyPut3" id="rowKeyPut3" v-model="abtest1.rowKeyPut3" placeholder="row key" class="txt input-light row-key-css">
                  <button type="primary" @click="onRetrieve($event)" class="btn-4 button-primary">Retrieve</button>
                  <button type="primary" @click="submitRollBack($event)" class="btn-4 button-primary">RollBack</button>
                  <br>
                  <lable for="colFamilyPut3">Column Family:</lable>
                  <!--<input type="text" name="colFamilyPut3" id="colFamilyPut3" v-model="abtest1.colFamilyPut3" placeholder="Col Family" class="txt input-light col-family-css">-->
                  <el-input
                    placeholder="Default value here"
                    v-model="abtest1.colFamilyPut3"
                    :disabled="true"
                    style="width:250px"
                    class="col-family-css">
                  </el-input>
                  <br><br>
                  <label>Experiment name</label>
                  <label class="abtest-right-move">Hash Id</label><br>
                  <input type="text" name="experiment_name" id="experiment_name" v-model="abtest1.abtestCore.experiment_name" placeholder="name" class="txt input-light abtest-Name-css">
                  <input type="text" name="hash_id" id="hash_id" v-model="abtest1.abtestCore.hash_id" placeholder="hash id" class="txt input-light abtest-Hash-css">

                  <div v-for="l in abtest1.abtestCore.whitelists">
                    <br><br>
                    <input type="text" v-model="l.treatment" placeholder="treatment name" class="input-light seg-name">
                    <input type="text" v-model="l.user_ids" placeholder="white list(user ids)" class="txt input-light abtest-seg">
                    <!--<i class="el-icon-circle-plus"></i>-->
                    </div>
                   <br><br>
                  <button v-on:click="submitForReview($event)" class="btn button-primary">Review</button>
                  <!--<el-button type="primary" v-on:click="submitForReview($event)">Review</el-button>-->
                  <button v-on:click="submitWhiteList($event)" class="btn button-primary the-submit">Provision</button>
                <br>
                <label>Notification List: </label>
                  <!--<input type="text" v-model="abtest1.email_person" placeholder="" class="input-light seg-name">-->
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
                  <confirm :m="msg"></confirm>
              </div>
              <div class="model-quarter-div">
                <p2>Total Percent: </p2> {{sumValue()}} %
                <a href="/#/abtestproduct"  class="button-2 button-primary button-rounded button-small stage-production-place">>>Production</a>
                <br>
                <div v-for="(l,index) in abtest1.abtestCore.ramp">
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
  //import confirm from '@/components/ConfirmPart.vue'
  import axios from 'axios'
  //import NavFooter from '@/components/NavFooter.vue'

  export default {
    data(){
      return {
        message: '',
        operationChose: 'abtest-1',


      abtest1:{
        hbaseTablePut3:'test-abtest',
        colFamilyPut3:'f',
        rowKeyPut3:'',
        //experiment_id:'',
        abtestCore:{
            experiment_name:'',
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
              treatment:'model_001_lr_like_mlc0',//"model_001_lr_like_mlc0",
              percentage:'100',
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

        abExperimentRst:''

      }
    },
    components: {
      NavHeader:NavHeader,
      NavBreadCrumb:NavBreadCrumb
    },

    methods: {
      sumValue() {
        return  this.abtest1.abtestCore.ramp.reduce((total,value) => {
          return Number.isNaN(parseFloat(value.percentage)) ?
            total :
            total + parseFloat(value.percentage)
        },0);
      },
      //show percentage section
      format (index) {
        let p = 0;
        let val =  this.abtest1.abtestCore.ramp;
        for (let i = 0; i < index; i++) {
          let cur = val[i].percentage;
          if (!Number.isNaN(parseFloat(cur))) {
            p += parseFloat(cur)
          }
        }
        let a = p;
        let cur = val[index].percentage;
        if (!Number.isNaN(parseFloat(cur))) {
          a += parseFloat(cur)
        }
        return `[${p}%~${a}%)`
      },

      //retrieve ABTEST data from hbase
      onRetrieve(event) {
        event.preventDefault();
        if(this.abtest1.rowKeyPut3 == ""){
          this.$message({
            showClose: true,
            message: '警告,row key 不能为空！',
            type: 'warning'
          });
          return false;
        }

        axios.post("/parser/hbaseABRetrieve",
          {
            rowKey:this.abtest1.rowKeyPut3,
            hbaseTable: this.abtest1.hbaseTablePut3,
            colFamily: this.abtest1.colFamilyPut3
          },

        ).then(rst =>{
          var res = rst.data;
          if(res.status == 0) {
            this.abExperimentRst = res.result.ABRst;//都是parser内的参数，比如这里的result和habseRst

            //we need parse so that we can take value from JSON form
            let dataAfterParse = JSON.parse(this.abExperimentRst);
            this.abtest1.abtestCore.experiment_name = dataAfterParse.experiment_name;
            this.abtest1.abtestCore.hash_id = dataAfterParse.hash_id;
            this.abtest1.abtestCore.whitelists = dataAfterParse.whitelists;
            this.abtest1.abtestCore.ramp = dataAfterParse.ramp;
          }else{
            this.$message.error('错误，无此row key！');
          }
        });
      },

      //review your json input
      submitForReview(event){
        event.preventDefault();
        let abtestDataReviewOri = JSON.stringify(this.abtest1.abtestCore);
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

        // alert("Your json: \n" + abtestDataReview);
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
        if(this.abtest1.rowKeyPut3 == ""){
          this.$message({
            showClose: true,
            message: '警告，row key 不能为空！',
            type: 'warning'
          });
          return false;
        }
        if(this.abtest1.operator_name == ""){
          this.$message({
            showClose: true,
            message: '警告，请填写操作人！',
            type: 'warning'
          });
          return false;
        }
        if(this.abtest1.abtestCore.experiment_name == ""){
          this.$message({
            showClose: true,
            message: '警告，experiment name未填写！',
            type: 'warning'
          });
          return false;
        }
        if(this.abtest1.abtestCore.hash_id == ""){
          this.$message({
            showClose: true,
            message: '警告，hash id未填写！',
            type: 'warning'
          });
          return false;
        }
        //parse user_ids to array
        this.abtest1.abtestCore.whitelists = this.abtest1.abtestCore.whitelists.map(x =>({
          user_ids: x.user_ids.split(',').filter(x => x.trim()).map(x => Number(x)),
          treatment: x.treatment,

          // 先分割 ， 字符串 然后 过滤掉空字符串。
          // 因为如果本身是空字符串 的话 会生成一个长度是1的空字符串列表
          //user_ids: x.user_ids.split('，').filter(x => x.trim())
        }));

        this.abtest1.abtestCore.ramp= this.abtest1.abtestCore.ramp.map(y =>({
          treatment: y.treatment,
          percentage: Number.isNaN(parseFloat(y.percentage)) ? null:parseFloat(y.percentage)

        }));
        //judge whether the input is valid number (not character )
        let whitelists_length = this.abtest1.abtestCore.whitelists.length;
        let n=0;
        for (n; n<whitelists_length; n++)  {
          let new_user = this.abtest1.abtestCore.whitelists[n].user_ids;
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

        let formData = new FormData();
        let abtestDataOri = JSON.stringify(this.abtest1.abtestCore);
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


        //let a = this.abtest1.abtestCore.whitelists;
        //this.abtest1.abtestCore.whitelists = this.abtest1.abtestCore.whitelists.filter(x => !x.treatment.trim() && !x.user_ids.trim());

        // if (!this.abtest1.abtestCore.whitelists[1].user_ids.trim() && !this.abtest1.abtestCore.whitelists[1].treatment.trim()) {
        //   this.abtest1.abtestCore.whitelists = this.abtest1.abtestCore.whitelists.slice(0,1)
        // }


        formData.append('hbaseTablePut3', this.abtest1.hbaseTablePut3);
        formData.append('colFamilyPut3', this.abtest1.colFamilyPut3);
        formData.append('rowKeyPut3', this.abtest1.rowKeyPut3);
        formData.append('experiment_name', this.abtest1.abtestCore.experiment_name);
        formData.append('abtestData', abtestData);
        formData.append('operator_name', this.abtest1.operator_name);

        //100% validation
        let result = this.sumValue();
        if (result !== 100){
          this.$message.error('错误，Allocation percentage not 100%. 再次提交需刷新页面');
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


        axios.post("/parser/uploadABtest", formData
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
          .catch(function(){
            console.log('FAILURE!!');
          });
      },
      submitRollBack(event){
        event.preventDefault();
        if(this.abtest1.operator_name == ""){
          this.$message({
            showClose: true,
            message: '警告，请填写操作人！',
            type: 'warning'
          });
          return false;
        }
        if(this.abtest1.rowKeyPut3 == ""){
          this.$message({
            showClose: true,
            message: '警告，row key不能为空！',
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
          formData.append('operator_name', this.abtest1.operator_name);
          formData.append('hbaseTablePut3', this.abtest1.hbaseTablePut3);
          formData.append('rowKeyPut3', this.abtest1.rowKeyPut3);
          axios.post("/parser/uploadRollBack", formData
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
          return false;
        });
      }

    }


  }

</script>

<!--<input type="text" name="ramping_1" id="ramping_1" v-model="abtest1.ramping_1" placeholder="" class="txt input-light abtest-ramp">-->
