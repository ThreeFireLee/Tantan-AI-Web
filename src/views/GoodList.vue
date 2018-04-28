<template>
  <div>
    <nav-header></nav-header>
    <nav-bread-crumb>
      <span>Operations</span>
    </nav-bread-crumb>
  <div class="accessory-result-page accessory-page">
    <div class="container">
      <div class="filter-nav">
         <!--&lt;!&ndash;响应式侧栏，浏览器缩小时点一下使用&ndash;&gt;-->
        <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Operations</a>
      </div>
      <div class="accessory-result">
        <!-- filter -->
        <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
          <dl class="filter-price">
            <dt>Operations</dt>
            <dd><a href="/" v-bind:class="{'cur':operationChose=='model'}" @click="operationChose='model'">Model</a></dd>
            <dd><a href="/#/abtest" v-bind:class="{'cur':operationChose=='abtest'}" @click="operationChose='abtest'">A/B Testing</a></dd>
            <dd><a href="javascript:void(0)" v-bind:class="{'cur':operationChose=='wait-test'}" @click="operationChose='wait-test'">Wait for test</a></dd>
            <!--<dd v-for="(ops,index) in operationFilter">-->
              <!--<a href="javascript:void(0)" @click="operationChose=index" v-bind:class="{'cur':operationChose==index} ">{{ops.operations}}</a>-->
            <!--</dd>-->
          </dl>
        </div>

        <!-- search result accessories list -->
        <div class="accessory-list-wrap">
          <div class="model-main">
            <div class="model-quarter-div">

              <!--retrieve data from hbase-->
              <form action="" method="post" enctype="multipart/form-data">
                      <lable for="hbaseTable">Table Name:  </lable>
                      <input type="text" name="hbaseTable" id="hbaseTable" v-model="hbaseTable" placeholder="Table Name" class="txt input-light table-name-css">
                      <br>
                      <lable for="rowKey">Input Key: </lable>
                      <input type="text" name="rowKey" id="rowKey" v-model="rowKey" placeholder="Your Key" class="txt input-light row-key-css">
                      <br>
                      <lable for="ColFamily">Column Family:</lable>
                      <input type="text" name="colFamily" id="colFamily" v-model="colFamily" placeholder="Col Family" class="txt input-light col-family-css">

                     <br><br>
                      <button type="primary" @click="onSubmit($event)" class="btn only-for-button">Retrieve</button>
              </form>
              <br>
              <div class="show-hbase-data">

                <div>
                  {{searchRst}}
                </div>

                <br><br><br><br><br>
              </div>


            </div>

            <div class="model-quarter-div">

              <!--1. upload with json file 注意，此处如果用form的model，那么下面的v-model都要有model name加.参数才行-->
                <form action="" :model="InputWithFile" ref="InputWithFile" method="post" id="myForm"  enctype="multipart/form-data">
                        <lable for="hbaseTablePut">Table Name:  </lable>
                        <input type="text" name="hbaseTablePut" id="hbaseTablePut" v-model="InputWithFile.hbaseTablePut" placeholder="Table Name" class="txt input-light table-name-css">
                        <br>
                        <lable for="rowKeyPut">Input Key: </lable>
                        <input type="text" name="rowKeyPut" id="rowKeyPut" v-model="InputWithFile.rowKeyPut" placeholder="Your Key" class="txt input-light row-key-css">
                        <br>
                        <lable for="colFamilyPut">Column Family:</lable>
                        <input type="text" name="colFamilyPut" id="colFamilyPut" v-model="InputWithFile.colFamilyPut" placeholder="Col Family" class="txt input-light col-family-css">

                        <label  class="the-submit">
                          <input type="file" id="file" ref="file" v-on:change="handleFileUpload($event)">
                        </label>
                        <br><br>
                        <button v-on:click="submitFile($event)" class="btn the-submit">Provision</button>
                </form>
              <div class="upload-reminder">
                {{fileUpRes}}
              </div>
            </div>


            <div class="model-quarter-div">
            </div>

            <div class="model-quarter-div">
              <br><br><br>
              <!--2. upload with json input-->
              <form action="" method="post" id="myForm2" enctype="multipart/form-data">
                <lable for="jsonInput" >Your Json/Text:</lable>
                <br><br>
                <textarea id="jsonInput" name="jsonInput" v-model="jsonInput" rows="10" cols="40" class="adjusted-size"></textarea>
                <br><br><br>

                <lable for="hbaseTablePut2">Table Name:  </lable>
                <input type="text" name="hbaseTablePut2" id="hbaseTablePut2" v-model="hbaseTablePut2" placeholder="Table Name" class="txt input-light table-name-css">
                <br>
                <lable for="rowKeyPut2">Input Key: </lable>
                <input type="text" name="rowKeyPut2" id="rowKeyPut2" v-model="rowKeyPut2" placeholder="Your Key" class="txt input-light row-key-css">
                <br>
                <lable for="colFamilyPut2">Column Family:</lable>
                <input type="text" name="colFamilyPut2" id="colFamilyPut2" v-model="colFamilyPut2" placeholder="Col Family" class="txt input-light col-family-css">
                <br><br>
                <button v-on:click="submitJson($event)" class="btn the-submit">Provision</button>
              </form>
            </div>

          </div>


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
    import qs from 'qs'

    export default {
        data(){
          return{
            goodList:[],
            // operationFilter:[
            //   {
            //     operations:'Monitor'
            //   },
            //   {
            //     operations:'Wait for test'
            //   },
            //   {
            //     operations:'Wait for test'
            //   }
            // ],

            hbaseTable:'',
            rowKey:'',
            colFamily:'',

            InputWithFile: {
              hbaseTablePut: '',
              rowKeyPut: '',
              colFamilyPut: '',
              file:'',
             },

            hbaseTablePut2:'22',
            rowKeyPut2:'22',
            colFamilyPut2:'22',
            jsonInput:'22',

            searchRst:'',
            fileUpRes:'',


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

          onSubmit(event) {
            event.preventDefault();

            //let featureData = JSON.stringify(this.featureSubmit);
            //console.log(featureData);
             axios.post("/parser/hbase",
               {
                 hbaseTable:this.hbaseTable,
                 rowKey:this.rowKey,
                 colFamily:this.colFamily
              },

               //featureData,
             // {
             //     headers: {
             //       'Content-Type': 'application/x-www-form-urlencoded'
             //     }
             //   }
               ).then(rst =>{
               var res = rst.data;
               this.searchRst = res.result.hbaseRst;//都是parser内的参数，比如这里的result和habseRst

             });
          },


          submitFile(event){
                event.preventDefault();

                let formData = new FormData();
                formData.append('hbaseTablePut', this.InputWithFile.hbaseTablePut);
                formData.append('rowKeyPut', this.InputWithFile.rowKeyPut);
                formData.append('colFamilyPut', this.InputWithFile.colFamilyPut);

                console.log(formData);
                formData.append('file', this.file);
                let config = {
                  headers:{'Content-Type':'multipart/form-data'}
                };


                axios.post("/parser/upload", formData, config
                  ).then(rst =>{
                    var res = rst.data;
                     this.fileUpRes = res;
                    console.log('SUCCESS');
                })
                    .catch(function(){
                      this.fileUpRes = 'failed';
                      console.log('FAILURE!!');
                    });
          },

            handleFileUpload(event){
                  event.preventDefault();
                  this.file = this.$refs.file.files[0];

                },

          submitJson(event){
            event.preventDefault();
            // let config = {
            //      headers: {'Content-Type': 'application/x-www-form-urlencoded'
            //     }
            //   }
            //let formData = JSON.stringify(this.putWithFile);
            //let a =  qs.stringify(this.hbaseTablePut);



            let formData = new FormData();
            formData.append('test1', 'testtest');

            let config = {
              headers:{'Content-Type':'multipart/form-data'}
            };


            axios.post("/parser/uploadHbase", formData
              ,config).then(rst =>{
             console.log(rst.data);
              console.log('SUCCESS');
            })
              .catch(function(){
                this.fileUpRes = 'failed';
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
                }



      }


    }

</script>


