<template>
  <div>
    <nav-header></nav-header>
    <nav-bread-crumb>
      <span>Stage</span>
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
            <!--<dd><a href="javascript:void(0)" v-bind:class="{'cur':operationChose=='wait-test'}" @click="operationChose='wait-test'">Wait for test</a></dd>-->
            <!--<dd v-for="(ops,index) in operationFilter">-->
              <!--<a href="javascript:void(0)" @click="operationChose=index" v-bind:class="{'cur':operationChose==index} ">{{ops.operations}}</a>-->
            <!--</dd>-->
          </dl>
        </div>

        <!-- main operation panel -->
        <!--<div class="accessory-list-wrap">-->
        <div>

          <form action="" method="post" enctype="multipart/form-data">

            <div class="model-quarter-div">

              <!--retrieve data from hbase-->
              <!--<form action="" method="post" enctype="multipart/form-data">-->
              <label>Operator: </label>
              <input type="text" name="operator_name" id="operator_name" v-model="operator_name" placeholder="operator name"class="input-light operator-name">
              <br><br>
              <lable for="hbaseTable">Table Name:  </lable>
              <input type="text" name="hbaseTable" id="hbaseTable" v-model="hbaseTable" placeholder="Table Name" class="txt input-light table-name-css">
              <br>
              <lable for="rowKey">Model Id: </lable>
              <input type="text" name="rowKey" id="rowKey" v-model="rowKey" placeholder="Your Key" class="txt input-light row-key-css">
              <br>
              <lable for="colFamily">Column Family:</lable>
              <input type="text" name="colFamily" id="colFamily" v-model="colFamily" placeholder="Col Family" class="txt input-light col-family-css">
              <br>
              <label class="the-submit">
                <br>
                <input type="file" id="file" ref="file" v-on:change="handleFileUpload($event)">
              </label>

              <!--</form>-->
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
              <button v-on:click="submitJson($event)" class="btn-3 button-primary">Provision/Overwrite</button>
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
          <a href="/#/modelproduct"  class="button-2 button-primary button-rounded ">>>Production</a>
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

            operator_name:'',
            hbaseTable:'test',
            rowKey:'1',
            colFamily:'col',
            file:'',
            jsonInput: '{\n' +
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


          //retrieve data from hbase
          onSubmit(event) {
            event.preventDefault();

             axios.post("/parser/hbase",
               {
                 hbaseTable:this.hbaseTable,
                 rowKey:this.rowKey,
                 colFamily:this.colFamily
              },

               ).then(rst =>{

               var res = rst.data;
               this.searchRst = res.result.hbaseRst;//都是parser内的参数，比如这里的result和habseRst

             });
          },

          //submit from the file
          submitFile(event){
                event.preventDefault();

                let formData = new FormData();
                formData.append('operator_name', this.operator_name);
                formData.append('hbaseTablePut', this.hbaseTable);
                formData.append('rowKeyPut', this.rowKey);
                formData.append('colFamilyPut', this.colFamily);

                console.log(formData);
                // formData.append('file', this.file);


                let config = {
                  headers:{'Content-Type':'multipart/form-data'}
                };


                axios.post("/parser/upload", formData, config
                  ).then(rst =>{
                  var res = rst.data;
                  if(res.status==1){
                    alert('Wrong! Json file format not correct');
                  }else{
                    console.log('SUCCESS');
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
                  //alert('Valid json format submitted!')
                  //formData.append('jsonInput', jsonTest);
                  console.log(jsonTest);
                }
              }
              catch(err)
              {
                alert('Wrong JSON format!\n' + err);
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
              console.log(rst.data);
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


