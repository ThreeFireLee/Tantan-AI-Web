<template>
  <div>
    <nav-header></nav-header>
    <nav-bread-crumb>
      <span>A/B Test Production</span>
    </nav-bread-crumb>
    <div class="accessory-result-page">
      <div>
        <!--<div class="filter-nav">-->
        <div>
        </div>
        <div class="accessory-result">
          <side-nav></side-nav>

          <!-- main operation panel-->
          <div class="accessory-list-wrap">
            <el-form action=""  :model="abtestPro" ref="abtestPro"method="post" enctype="multipart/form-data">
                <div class="model-quarter-div1">
                  <label>Operator: </label>
                  <input type="text" name="operator_name" id="operator_name" v-model="abtestPro.abtestCore.operator_name" placeholder="operator name"class="input-light seg-name">
                  <span style="margin-left: 50px">Time: {{modifiedTime}}</span>
                  <br><br>
                  <lable for="experiment_id">experiment id:</lable>
                  <input type="text" name="experiment_id" id="experiment_id" v-model="abtestPro.abtestCore.experiment_id" placeholder="1,2,3..." class="txt input-light ex-name-css">
                  <br>
                  <lable for="hbaseTablePut3">Table Name:  </lable>
                  <el-input
                    placeholder="Default value here"
                    v-model="abtestPro.hbaseTablePut3"
                    :disabled="true"
                    style="width:250px"
                    class="table-name-css">
                  </el-input>
                  <br>
                  <lable for="row_key">Row Key:</lable>
                  <input type="text" name="row_key" id="row_key" v-model="abtestPro.abtestCore.row_key" placeholder="row key" class="txt input-light row-key-css">
                  <button type="primary" @click="onRetrieve($event)" class="btn-4 button-primary">Retrieve</button>
                  <button type="primary" @click="submitRollBack($event)" class="btn-4 button-primary">RollBack</button>
                  <br>
                  <lable for="colFamilyPut3">Column Family:</lable>
                   <el-input
                    placeholder="Default value here"
                    v-model="abtestPro.colFamilyPut3"
                    :disabled="true"
                    style="width:250px"
                    class="col-family-css">
                  </el-input>
                  <br><br>
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 3}"
                    style="width: 510px; margin: 0 0 20px 0px"
                    placeholder="Description"
                    v-model="description">
                  </el-input>
                  <br>
                  <label>Experiment name</label>
                  <label class="abtest-right-move">Hash Id</label><br>
                  <el-input type="text" style="width: 300px" name="experiment_name" id="experiment_name" v-model="abtestPro.abtestCore.experiment_name" placeholder="e.g.tantan-rec-male-mlc0" class="abtest-Name-css"></el-input>
                  <el-input type="text" :disabled="isDisabled" style="width: 200px;" name="hash_id" id="hash_id" v-model="abtestPro.abtestCore.hash_id" placeholder="hash id" class="abtest-Hash-css"></el-input>
                  <br><br>
                  <el-button size="mini" style="margin-left: 180px" round @click="addWholeTeam">添加全组</el-button>
                  <el-button size="mini" round @click="addTeamMale">组内男童鞋</el-button>
                  <el-button size="mini" round @click="addTeamFemale">组内女童鞋</el-button>
                  <el-button type="success" icon="el-icon-plus" circle @click="addDomain" size="mini" style="margin-left: 10px;"></el-button>
                  <br><br>
                  <el-form-item
                    v-for="(l, index) in abtestPro.abtestCore.whitelists"
                    :label="(index + 1)"
                    :key="l.key"
                    :prop="'whitelists.' + index + '.value'"
                  >
                    <el-input style="width: 200px" v-model="l.treatment" placeholder="treatment name" clearable></el-input>
                    <el-input style="width: 250px" v-model="l.user_ids" placeholder="white list (user ids)" clearable></el-input>
                    <el-button type="danger" icon="el-icon-delete" circle @click.prevent="removeDomain(l)" style="margin-left: 10px" size="mini"></el-button>
                  </el-form-item>


                  <el-button type="primary" @click="submitForReview()" style="width: 150px; margin-left:50px">Review<i class="el-icon-zoom-in el-icon--right"></i></el-button>
                  <el-tooltip class="item" effect="dark" content="Submit to Stage" placement="top">
                    <el-button type="warning" @click="submitPromote($event)" style="margin-left:30px">Stage Copy<i class="el-icon-sort el-icon--right"></i></el-button>
                  </el-tooltip>
                  <el-button type="primary" @click="submitWhiteList($event)" style="width: 150px; margin-left:30px" >Provision<i class="el-icon-upload el-icon--right"></i></el-button>
                  <br><br><br><br>
                </div>


                <div class="model-quarter-div2">
                  <p2>Total Percent: </p2> {{sumValue()}} %
                  <!--<a href="/#/abtest"  class="button-2 button-primary button-rounded button-small stage-production-place">>>>Stage</a>-->
                  <br><br><br>

                  <el-form-item
                    v-for="(l, index) in abtestPro.abtestCore.ramp"
                    :label="(index + 1)"
                    :key="l.key"
                    :prop="'whitelists.' + index + '.value'"
                  >
                    <el-input style="width: 80px" v-model="l.percentage" placeholder="" clearable></el-input>%
                    <el-input style="width: 200px" v-model="l.treatment" placeholder="treatment name" clearable></el-input>
                    <el-button type="success"  icon="el-icon-plus" circle @click="addPercent" size="mini" style="margin-left: 10px"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle @click.prevent="removePercent(l)" size="mini"></el-button>
                    <br>
                    <span style="margin-left: 20px">{{format(index)}}</span>
                  </el-form-item>
                  <!--<el-input-->
                    <!--type="textarea"-->
                    <!--:autosize="{ minRows: 8}"-->
                    <!--style="width: 425px; margin: 0 0 20px 20px"-->
                    <!--placeholder="Your Json"-->
                    <!--v-model="jsonArea">-->
                  <!--</el-input>-->
                  <!--<br>-->
                  <!--<el-button type="primary" style="margin: 2px 0 40px 170px" @click="submitABwithJson($event)">Json Provision</el-button>-->
                  <!--<br>-->
                  <br><br>
                </div>
              </el-form>

          </div>
          <el-dialog
            title="Your Json"
            :visible.sync="dialogVisible"
            width="50%"
          >
            <vue-json-pretty :data="dialogData"></vue-json-pretty>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
              </span>
          </el-dialog>
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
  import SideNav from '../components/SideNav'
  import axios from 'axios'
  import FPC from 'floating-point-calculator'
  import VueJsonPretty from 'vue-json-pretty'
  import moment from 'moment'


  export default {
    data(){
      return {
        message: '',
        operationChose: 'abtest',
        dialogVisible: false,
        isDisabled:false,
        dialogData:'',
        modifiedTime:'',

        abtestPro:{
          hbaseTablePut3:'treatment_store',
          colFamilyPut3:'f',
          abtestCore:{
            operator_name:'',
            row_key:'',
            experiment_name:'',
            experiment_id:'',
            hash_id:'',
            whitelists: [{
              user_ids: '',
              treatment:''
            }],
            ramp:[
              {
                treatment:'control',//"model_001_lr_like_mlc0",
                percentage:'100',
              }]
          }
        },
        jsonArea:'',
        description:''

      }
    },
    components: {
      NavHeader:NavHeader,
      SideNav:SideNav,
      NavBreadCrumb:NavBreadCrumb,
      VueJsonPretty
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
      addWholeTeam() {
        this.abtestPro.abtestCore.whitelists.push({
          user_ids: [133397434,122211057,100660659,22761482,111588646,40568359,118907580,125151962,117368724,122870511,112205767,119326599,116978707,124769561],
          treatment:''
        });
      },
      addTeamMale(){
        this.abtestPro.abtestCore.whitelists.push({
          user_ids: [133397434,122211057,100660659,22761482,111588646,40568359,118907580,125151962,117368724,122870511,112205767,119326599,116978707],
          treatment:''
        });
      },
      addTeamFemale(){
        this.abtestPro.abtestCore.whitelists.push({
          user_ids: [124769561],
          treatment:''
        });
      },
      addDomain() {
        this.abtestPro.abtestCore.whitelists.push({
          user_ids: '',
          treatment:''
        });
      },
      removeDomain(item) {
        var index = this.abtestPro.abtestCore.whitelists.indexOf(item);
        if (index !== -1) {
          this.abtestPro.abtestCore.whitelists.splice(index, 1)
        }
      },
      addPercent() {
        this.abtestPro.abtestCore.ramp.push({
          treatment:'',
          percentage:''
        });
      },
      removePercent(item) {
        var index = this.abtestPro.abtestCore.ramp.indexOf(item);
        if (index !== -1) {
          this.abtestPro.abtestCore.ramp.splice(index, 1)
        }
      },

      //retrieve ABTEST data from hbase
      onRetrieve(event) {
        event.preventDefault();
        if(this.abtestPro.abtestCore.row_key == ""){
          this.$message({
            showClose: true,
            message: '警告,row key 不能为空！',
            type: 'warning'
          });
          return false;
        }

        axios.post("/parserPro/hbaseABRetrieve",
          {
            rowKey:this.abtestPro.abtestCore.row_key,
            hbaseTable: this.abtestPro.hbaseTablePut3,
            colFamily: this.abtestPro.colFamilyPut3
          },

        ).then(rst =>{
          var res = rst.data;
          if(res.status == 0) {
            let abExperimentRst = res.result.ABRst;//都是parser内的参数，比如这里的result和habseRst
            let newWholeData = res.result.wholeData;
            //we need parse so that we can take value from JSON form
            let dataAfterParse = JSON.parse(abExperimentRst);
            this.abtestPro.abtestCore.experiment_name = dataAfterParse.experiment_name;
            this.abtestPro.abtestCore.experiment_id = dataAfterParse.experiment_id;
            this.abtestPro.abtestCore.hash_id = dataAfterParse.hash_id;
            this.abtestPro.abtestCore.whitelists = dataAfterParse.whitelists;
            this.abtestPro.abtestCore.ramp = dataAfterParse.ramp;
            this.modifiedTime = moment(newWholeData[0].timestamp).format("YYYY-MM-DD HH:mm:ss");

            this.isDisabled = true;

          }else{
            this.$message.error('错误，无此row key！');
          }
        });
      },

      //submit to stage
      submitPromote(event){
        event.preventDefault();
        if(this.abtestPro.abtestCore.experiment_id == ""){
          this.$message({
            showClose: true,
            message: '警告，experiment id未填写！',
            type: 'warning'
          });
          return false;
        }
        if(this.abtestPro.abtestCore.row_key == ""){
          this.$message({
            showClose: true,
            message: '警告，row key不能为空！',
            type: 'warning'
          });
          return false;
        }
        if(this.abtestPro.abtestCore.operator_name == ""){
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
        if(this.description == ""){
          this.$message({
            showClose: true,
            message: '警告, description内容不能为空！',
            type: 'warning'
          });
          return false;
        }
        //parse user_ids to array
        this.abtestPro.abtestCore.whitelists = this.abtestPro.abtestCore.whitelists.map(x =>({
          user_ids: x.user_ids.toString().split(',').filter(x => x.trim()).map(x => Number(x)),
          treatment: x.treatment,
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
        formData.append('rowKeyPut3', this.abtestPro.abtestCore.row_key);
        formData.append('experiment_name', this.abtestPro.abtestCore.experiment_name);
        formData.append('description', this.description);
        formData.append('abtestData', abtestData);
        formData.append('operator_name', this.abtestPro.abtestCore.operator_name);

        let config = {
          headers:{'Content-Type':'multipart/form-data'}
        };

        //100% validation
        let result = this.sumValue();
        if (result !== 100){
          this.$message.error('错误，Allocation percentage not 100%！');
          return false;
        } 
        this.$confirm('是否确认将数据备份到Stage?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: 'Stage备份提交!'
          });
          axios.post("/parser/uploadABtest", formData
            ,config
          ).then(rst =>{
            var res = rst.data;
            if(res.status == 0){
              this.$notify({
                title: '提交成功',
                message: '数据已传入Stage',
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

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });


      },

      //whitelist provision
      submitABwithJson(event){
        event.preventDefault();
        if(this.abtestPro.abtestCore.row_key == ""){
          this.$message({
            showClose: true,
            message: '警告,row key 不能为空！',
            type: 'warning'
          });
          return false;
        }
        if(this.abtestPro.abtestCore.operator_name == ""){
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
        formData.append('rowKeyPut3', this.abtestPro.abtestCore.row_key);
        formData.append('colFamilyPut3', this.abtestPro.colFamilyPut3);
        formData.append('operator_name', this.abtestPro.abtestCore.operator_name);

        let jsonTest = this.jsonArea;

        //get rid of break line symbols
        jsonTest = jsonTest.replace(/\ +/g,"");
        jsonTest = jsonTest.replace(/\t/g,"");
        jsonTest = jsonTest.replace(/\r\n/g,"");
        jsonTest = jsonTest.replace(/\n/g,"");

        //json format test
        try
        {
          if (typeof JSON.parse(jsonTest) === "object") {
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
      submitForReview(){
        let abtestDataReviewOri = JSON.stringify(this.abtestPro.abtestCore);
        this.dialogVisible = true;
        this.dialogData = JSON.parse(abtestDataReviewOri);

      },

      //submit with the abtest data
      submitWhiteList(event){
        event.preventDefault();
        if(this.abtestPro.abtestCore.experiment_id == ""){
          this.$message({
            showClose: true,
            message: '警告，experiment id未填写！',
            type: 'warning'
          });
          return false;
        }
        if(this.abtestPro.abtestCore.row_key == ""){
          this.$message({
            showClose: true,
            message: '警告，row key 不能为空！',
            type: 'warning'
          });
          return false;
        }
        if(this.abtestPro.abtestCore.operator_name == ""){
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
        if(this.description == ""){
          this.$message({
            showClose: true,
            message: '警告, description内容不能为空！',
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
          user_ids: x.user_ids.toString().split(',').filter(x => x.trim()).map(x => Number(x)),
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
        formData.append('rowKeyPut3', this.abtestPro.abtestCore.row_key);
        formData.append('description', this.description);
        formData.append('experiment_name', this.abtestPro.abtestCore.experiment_name);
        formData.append('abtestData', abtestData);
        formData.append('operator_name', this.abtestPro.abtestCore.operator_name);

        //100% validation
        let result = this.sumValue();
        if (result !== 100){
          this.$message.error('错误，Allocation percentage not 100%!');
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
        if(this.abtestPro.abtestCore.operator_name == ""){
          this.$message({
            showClose: true,
            message: '警告，请填写操作人！',
            type: 'warning'
          });
          return false;
        }
        if(this.abtestPro.abtestCore.row_key == ""){
          this.$message({
            showClose: true,
            message: '警告，row key 不能为空！',
            type: 'warning'
          });
          return false;
        }
        let formData = new FormData();
        formData.append('operator_name', this.abtestPro.abtestCore.operator_name);
        formData.append('hbaseTablePut3', this.abtestPro.hbaseTablePut3);
        formData.append('rowKeyPut3', this.abtestPro.abtestCore.row_key);
        axios.post("/parserPro/uploadRollBack", formData
        ).then(rst =>{
          var res = rst.data;
          if(res.status == 0){
            let finalRst;
            if(res.result.rollbackRst.abtestData == undefined){
              finalRst = res.result.rollbackRst.jsonInput;
            }else{
              finalRst = res.result.rollbackRst.abtestData;
            }
            this.$confirm(finalRst, '回滚数据确认', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {

              let formData1 = new FormData();
              let resTest = JSON.stringify(res);
              formData1.append('rollbackData', resTest);
              axios.post("/parserPro/uploadRollBackSec", formData1
              ).then(rst2 =>{
                let res2 = rst2.data;
                if(res2.status == 0){
                  this.$notify({
                    title: '提交成功',
                    message: '数据已覆盖',
                    type: 'success'
                  });
                }else {
                  this.$notify.error({
                    title: '提交失败',
                    message: '数据未覆盖'
                  });
                  console.log('Failed! From node.js');
                }
              })

            })
          }else if(res.status == 1){
            this.$notify.error({
              title: '提交失败',
              message: '数据未读出'
            });
          }
          console.log('Success! From node.js');
        })
          .catch(function(){
            console.log('FAILURE!!');
          });
        // this.$confirm('是否确认回滚?', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   this.$message({
        //     type: 'success',
        //     message: '回滚提交!'
        //   });
        //   let formData = new FormData();
        //   formData.append('operator_name', this.abtestPro.abtestCore.operator_name);
        //   formData.append('hbaseTablePut3', this.abtestPro.hbaseTablePut3);
        //   formData.append('rowKeyPut3', this.abtestPro.abtestCore.row_key);
        //   axios.post("/parserPro/uploadRollBack", formData
        //   ).then(rst =>{
        //     var res = rst.data;
        //     if(res.status == 0){
        //       this.$notify({
        //         title: '提交成功',
        //         message: '数据已覆盖',
        //         type: 'success'
        //       });
        //     }else if(res.status == 1){
        //       this.$notify.error({
        //         title: '提交失败',
        //         message: '数据未覆盖'
        //       });
        //     }
        //     console.log('Success! From node.js');
        //   })
        //     .catch(function(){
        //       console.log('FAILURE!!');
        //     });
        //
        // }).catch(() => {
        //   this.$message({
        //     type: 'info',
        //     message: '已取消操作'
        //   });
        // });

      }

    }


  }

</script>
