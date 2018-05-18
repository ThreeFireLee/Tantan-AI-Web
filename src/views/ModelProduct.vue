<template>
  <div>
    <nav-header></nav-header>
    <nav-bread-crumb>
      <span>Model Production</span>
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
              <dd><a href="/#/abtest" v-bind:class="{'cur':operationChose=='abtest'}" @click="operationChose='abtest'">A/B Testing</a></dd>
            </dl>
          </div>

          <!-- main operation panel -->
          <div>
            <form action="" method="post" enctype="multipart/form-data">

              <div class="model-quarter-div">
                <!--retrieve data from hbase-->
                <!--<form action="" method="post" enctype="multipart/form-data">-->
                <label>Operator: </label>
                <input type="text" name="operator_namePro" id="operator_namePro" v-model="operator_namePro" placeholder="operator name"class="input-light operator-name">
                <br><br>
                <lable for="hbaseTablePro">Table Name:  </lable>
                <!--<input type="text" name="hbaseTablePro" id="hbaseTablePro" v-model="hbaseTablePro" placeholder="Production Default here" class="txt input-light table-name-css">-->
                <el-input
                  placeholder="Default value here"
                  v-model="hbaseTablePro"
                  :disabled="true"
                  style="width:250px; height:41px"
                  class="table-name-css">
                </el-input>
                <br>
                <lable for="rowKeyPro">Model Id: </lable>
                <input type="text" name="rowKeyPro" id="rowKeyPro" v-model="rowKeyPro" placeholder="Your Key" class="txt input-light row-key-css">
                <br>
                <lable for="colFamilyPro">Column Family:</lable>
                <!--<input type="text" name="colFamilyPro" id="colFamilyPro" v-model="colFamilyPro" placeholder="Production Default here" class="txt input-light col-family-css">-->
                <el-input
                  placeholder="Default value here"
                  v-model="colFamilyPro"
                  :disabled="true"
                  style="width:250px"
                  class="col-family-css">
                </el-input>
                <br>
                <label class="the-submit">
                  <br>
                  <input type="file" id="file" ref="file" v-on:change="handleFileUpload($event)">
                </label>
                <br><br>
              </div>

              <div class="model-quarter-div">
                <br>
                <!--2. upload with json input-->

                <lable for="jsonInputPro" >Your Json/Text:</lable>
                <br><br>
                <textarea type="text" id="jsonInputPro" name="jsonInputPro" v-model="jsonInputPro" class="adjusted-textarea-size input-light"></textarea>
                <br><br>
              </div>


              <div>
                <!--&nbsp-->
                <button type="primary" @click="onSubmit($event)" class="btn-2 button-primary">Retrieve</button>
                <button v-on:click="submitFile($event)" class="btn-3 button-primary">Provision File</button>
                <button v-on:click="submitJson($event)" class="btn button-primary">Provision</button>
              </div>
            </form>

            <div>
              <div class="show-hbase-data">

                <div>
                  {{searchRst}}
                </div>

                <br><br><br><br><br>
              </div>

            </div>
          </div>
          <div>
            <a href="/"  class="button-2 button-primary button-rounded">>>>Stage</a>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <!--<nav-footer></nav-footer>-->
  </div>
</template>

<script>
  import './../assets/css/base.css'
  import './../assets/css/product.css'
  import './../assets/css/login.css'
  import NavHeader from '@/components/NavHeader.vue'  // @ means src file
  //import NavFooter from '@/components/NavFooter.vue'
  import NavBreadCrumb from '@/components/NavBread.vue'
  import axios from 'axios'

  export default {
    data(){
      return{
        goodList:[],

        operator_namePro:'',
        hbaseTablePro:'mods_model_storage',
        rowKeyPro:'',
        colFamilyPro:'f',
        file:'',
        jsonInputPro: '{\n' +
        '  "person": {\n' +
        '    "name": "wanger",\n' +
        '    "birth": "1999"\n' +
        '  }\n' +
        '}',

        searchRst:'',

        operationChose:'model',
        filterBy:false,
        overLayFlag:false
      }
    },
    components: {
      NavHeader:NavHeader,
      NavBreadCrumb:NavBreadCrumb
    },
    mounted: function(){
      this.getGoodList();
    },
    methods: {
      getGoodList(){
        axios.get("/goods").then(result =>{
          var res = result.data;
          if(res.status == "0"){
            this.goodList = res.result.list;
          }else{
            this.goodList = [];
          }
        });
      },

      //retrieve data from hbase
      onSubmit(event) {
        event.preventDefault();

        axios.post("/parserPro/hbase",
          {
            hbaseTablePro:this.hbaseTablePro,
            rowKeyPro:this.rowKeyPro,
            colFamilyPro:this.colFamilyPro
          },

        ).then(rst =>{
          var res = rst.data;
          this.searchRst = res.result.hbaseRst;//都是parserPror内的参数，比如这里的result和habseRst

        });
      },

      //submit from the file
      submitFile(event){
        event.preventDefault();
        if(this.operator_namePro == ""){
          this.$message({
            showClose: true,
            message: '警告, 请填写操作人',
            type: 'warning'
          });
          return false;
        }
        if(this.rowKeyPro == ""){
          this.$message({
            showClose: true,
            message: '警告,row key 不能为空！',
            type: 'warning'
          });
          return false;
        }
        if(this.file == ""){
          this.$message({
            showClose: true,
            message: '警告, 请选择提交文件！',
            type: 'warning'
          });
          return false;
        }


        let formData = new FormData();
        formData.append('operator_namePro', this.operator_namePro);
        formData.append('hbaseTablePutPro', this.hbaseTablePro);
        formData.append('rowKeyPutPro', this.rowKeyPro);
        formData.append('colFamilyPutPro', this.colFamilyPro);

        console.log(formData);
        formData.append('file', this.file);


        let config = {
          headers:{'Content-Type':'multipart/form-data'}
        };


        axios.post("/parserPro/upload", formData, config
        ).then(rst =>{
          var res = rst.data;
          if(res.status==2){
            this.$message.error('错误，Model Id重复！');
          }
          if(res.status == 0){
            this.$notify({
              title: '提交成功',
              message: '数据已写入',
              type: 'success'
            });
          }else if(res.status == 3){
            this.$notify.error({
              title: '提交失败',
              message: '数据未写入'
            });
          }
          if(res.status==1){
            this.$message.error('错误，非正确json格式！');
          }

        }).catch(function(){

            console.log('FAILURE!!');
          });
      },

      handleFileUpload(event){
        event.preventDefault();
        this.file = this.$refs.file.files[0];

      },

      //submit from typing
      submitJson(event){
        event.preventDefault();
        if(this.rowKeyPro == ""){
          this.$message({
            showClose: true,
            message: '警告,row key 不能为空！',
            type: 'warning'
          });
          return false;
        }
        if(this.operator_namePro == ""){
          this.$message({
            showClose: true,
            message: '警告, 请填写操作人',
            type: 'warning'
          });
          return false;
        }
        if(this.jsonInputPro == ""){
          this.$message({
            showClose: true,
            message: '警告, 提交json内容不能为空！',
            type: 'warning'
          });
          return false;
        }

        let formData = new FormData();
        formData.append('hbaseTablePutPro2', this.hbaseTablePro);
        formData.append('rowKeyPutPro2', this.rowKeyPro);
        formData.append('colFamilyPutPro2', this.colFamilyPro);
        formData.append('operator_namePro', this.operator_namePro);

        let jsonTest = this.jsonInputPro;
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


        formData.append('jsonInputPro', jsonTest);
        let config = {
          headers:{'Content-Type':'multipart/form-data'}
        };


        axios.post("/parserPro/uploadHbase", formData
          ,config
        ).then(rst =>{
          var res = rst.data;
          if(res.status==2){
            this.$message.error('错误，Model Id重复！');
          }
          if(res.status == 0){
            this.$notify({
              title: '提交成功',
              message: '数据已写入',
              type: 'success'
            });
          }else if(res.status == 3){
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
      showFilterPop(){
        this.filterBy = true;
        this.overLayFlag = true;
      },
      closePop(){
        this.filterBy = false;
        this.overLayFlag = false;
      },




    }


  }

</script>


