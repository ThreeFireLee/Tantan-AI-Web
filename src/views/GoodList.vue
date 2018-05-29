<template>
  <div>
    <nav-header></nav-header>
    <nav-bread-crumb>
      <span>Model Stage</span>
    </nav-bread-crumb>
  <div class="accessory-result-page">
    <div>
      <div>
      </div>
      <div class="accessory-result">
        <side-nav></side-nav>

        <!-- main operation panel -->
        <!--<div class="accessory-list-wrap">-->
        <div>

          <form action="" method="post" enctype="multipart/form-data">

            <div class="model-quarter-div">

              <!--retrieve data from hbase-->
              <label>Operator: </label>
              <input type="text" name="operator_name" id="operator_name" v-model="operator_name" placeholder="operator name" class="input-light operator-name">
              <br><br>
              <lable for="hbaseTable">Table Name:  </lable>
              <!--<input type="text" name="hbaseTable" id="hbaseTable" v-model="hbaseTable" placeholder="Table Name" class="txt input-light table-name-css">-->
              <el-input
                placeholder="Default value here"
                v-model="hbaseTable"
                :disabled="true"
                style="width:250px; height:41px"
                class="table-name-css">
              </el-input>
              <br>
              <lable for="rowKey">Model Id: </lable>
              <input type="text" name="rowKey" id="rowKey" v-model="rowKey" placeholder="Your Key" class="txt input-light row-key-css">
              <br>
              <lable for="colFamily">Column Family:</lable>
              <!--<input type="text" name="colFamily" id="colFamily" v-model="colFamily" placeholder="Col Family" class="txt input-light col-family-css">-->
              <el-input
                placeholder="Default value here"
                v-model="colFamily"
                :disabled="true"
                style="width:250px"
                class="col-family-css">
              </el-input>
              <br>
              <label class="the-submit">
                <br>
                <input type="file" id="file" ref="file" v-on:change="handleFileUpload($event)">
              </label>


              <!--1. upload with json file -->
                <br><br>
            </div>

            <div class="model-quarter-div">
              <br>
              <!--2. upload with json input-->

                <lable for="jsonInput" >Your Json/Text:</lable>
                <br><br>
                <textarea type="text" id="jsonInput" name="jsonInput" v-model="jsonInput" class="adjusted-textarea-size input-light"></textarea>
                 <br><br>
            </div>


            <div>
                      <!--&nbsp-->
              <button type="primary" @click="onSubmit($event)" class="btn-2 button-primary">Retrieve</button>
              <button v-on:click="submitFile($event)" class="btn-3 button-primary">File Provision</button>
              <button v-on:click="submitJson($event)" class="btn-3 button-primary">Json Provision</button>
              <el-button type="warning" @click="submitScan($event)">Scan</el-button>
            </div>
            </form>

            <div>
              <div class="show-hbase-data">
                <el-input
                  type="textarea"
                  readonly="readonly"
                  :autosize="{ minRows: 8}"
                  placeholder="Retrieve Result"
                  v-model="searchRst">
                </el-input>
                <br><br><br><br><br>
              </div>
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
    import NewHeader from "../components/NewHeader";
    import SideNav from "../components/SideNav";

    export default {
        data(){
          return{
            goodList:[],

            operator_name:'',
            hbaseTable:'mods_model_storage',
            rowKey:'',
            colFamily:'f',
            file:'',
            jsonInput: '',


            searchRst:'',

            operationChose:'model',
            filterBy:false,
            overLayFlag:false

          }
        },
        components: {
          SideNav:SideNav,
          NewHeader,
          NavHeader:NavHeader,
          // NavFooter:NavFooter,
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

          //scan whole model table and get data
          submitScan(event){
            event.preventDefault();
            axios.post("/parser/scan",
              {
                hbaseTable:this.hbaseTable,
                colFamily:this.colFamily
              },
            ).then(rst =>{

              var res = rst.data;
              if(res.status == 0) {
                // this.searchRst = res.result.finalRst;//都是parser内的参数，比如这里的result和habseRst
                let model_id = res.result.finalRst;
                let model_show = "";
                // this.searchRst = model_id[0].toString() + "\n" + model_id[1].toString();
                for(let i = 0; i < model_id.length; i++){
                  model_show += i+1 + ".     " + model_id[i].toString() + "\n";
                }

                this.searchRst = model_show;

              }else{
                this.$message.error('错误，无此model id！');
              }

            });

          },

          //retrieve data from hbase
          onSubmit(event) {
            event.preventDefault();
            if(this.rowKey == ""){
              this.$message({
                showClose: true,
                message: '警告,row key 不能为空！',
                type: 'warning'
              });
              return false;
            }
             axios.post("/parser/hbase",
               {
                 hbaseTable:this.hbaseTable,
                 rowKey:this.rowKey,
                 colFamily:this.colFamily
              },
               ).then(rst =>{

               var res = rst.data;
               if(res.status == 0) {
                 this.searchRst = res.result.hbaseRst;//都是parser内的参数，比如这里的result和habseRst
               }else{
                 this.$message.error('错误，无此model id！');
               }

             });
          },

          //submit from the file
          submitFile(event){
                event.preventDefault();
            if(this.operator_name == ""){
              this.$message({
                showClose: true,
                message: '警告, 请填写操作人',
                type: 'warning'
              });
              return false;
            }
            if(this.rowKey == ""){
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
                formData.append('operator_name', this.operator_name);
                formData.append('hbaseTablePut', this.hbaseTable);
                formData.append('rowKeyPut', this.rowKey);
                formData.append('colFamilyPut', this.colFamily);

                console.log(formData);
                formData.append('file', this.file);


                let config = {
                  headers:{'Content-Type':'multipart/form-data'}
                };


                axios.post("/parser/upload", formData, config
                  ).then(rst =>{
                  var res = rst.data;
                  if(res.status==1){
                    this.$message.error('错误，非正确json格式！');
                  }
                  if(res.status == 0){
                    this.$notify({
                      title: '提交成功',
                      message: '数据已写入',
                      type: 'success'
                    });
                  }else if(res.status == 2){
                    this.$notify.error({
                      title: '提交失败',
                      message: '数据未写入'
                    });
                  }
                })
                    .catch(function(){
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
            if(this.rowKey == ""){
              this.$message({
                showClose: true,
                message: '警告,row key 不能为空！',
                type: 'warning'
              });
              return false;
            }
            if(this.operator_name == ""){
              this.$message({
                showClose: true,
                message: '警告, 请填写操作人',
                type: 'warning'
              });
              return false;
            }
            if(this.jsonInput == ""){
              this.$message({
                showClose: true,
                message: '警告, 提交json内容不能为空！',
                type: 'warning'
              });
              return false;
            }
            // let formData = JSON.stringify(this.InputWithType);
            //let a =  qs.stringify(this.hbaseTablePut);

            let formData = new FormData();
            formData.append('hbaseTablePut2', this.hbaseTable);
            formData.append('rowKeyPut2', this.rowKey);
            formData.append('colFamilyPut2', this.colFamily);
            formData.append('operator_name', this.operator_name);

            let jsonTest = this.jsonInput;

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


            axios.post("/parser/uploadHbase", formData
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


