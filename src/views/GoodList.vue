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

        <!-- main operation panel -->
        <div class="accessory-list-wrap">
          <div >
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
                <br>
                <label class="the-submit">
                  <br>
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
              <br>
              <!--2. upload with json input-->
              <form action="" :model="InputWithType" ref="InputWithType" method="post" id="myForm2" enctype="multipart/form-data">
                <lable for="jsonInput" >Your Json/Text:</lable>
                <br><br>
                <textarea type="text" id="jsonInput" name="jsonInput" v-model="InputWithType.jsonInput" class="adjusted-textarea-size input-light"></textarea>
                 <br><br>

                <lable for="hbaseTablePut2">Table Name:  </lable>
                <input type="text" name="hbaseTablePut2" id="hbaseTablePut2" v-model="InputWithType.hbaseTablePut2" placeholder="Table Name" class="txt input-light table-name-css">
                <br>
                <lable for="rowKeyPut2">Input Key: </lable>
                <input type="text" name="rowKeyPut2" id="rowKeyPut2" v-model="InputWithType.rowKeyPut2" placeholder="Your Key" class="txt input-light row-key-css">
                <br>
                <lable for="colFamilyPut2">Column Family:</lable>
                <input type="text" name="colFamilyPut2" id="colFamilyPut2" v-model="InputWithType.colFamilyPut2" placeholder="Col Family" class="txt input-light col-family-css">
                <br><br>
                <button v-on:click="submitJson($event)" class="btn the-submit">Provision</button>
              </form>
            </div>


            <div class="model-quarter-div">

            </div>

            <div class="model-quarter-div">
              <div class="show-hbase-data">

                <div>
                  {{searchRst}}
                </div>

                <br><br><br><br><br>
              </div>
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

            hbaseTable:'',
            rowKey:'',
            colFamily:'',

            InputWithFile: {
              hbaseTablePut: 'test',
              rowKeyPut: '1',
              colFamilyPut: 'col',
              file:''
             },

            InputWithType: {
              hbaseTablePut2: 'test',
              rowKeyPut2: '1',
              colFamilyPut2: 'col',
              jsonInput: ''
            },

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
          //retrieve data from hbase
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

               ).then(rst =>{
               var res = rst.data;
               this.searchRst = res.result.hbaseRst;//都是parser内的参数，比如这里的result和habseRst

             });
          },

          //submit from the file
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

          //submit from typing
          submitJson(event){
            event.preventDefault();
            // let formData = JSON.stringify(this.InputWithType);
            //let a =  qs.stringify(this.hbaseTablePut);

            let formData = new FormData();
            formData.append('hbaseTablePut2', this.InputWithType.hbaseTablePut2);
            formData.append('rowKeyPut2', this.InputWithType.rowKeyPut2);
            formData.append('colFamilyPut2', this.InputWithType.colFamilyPut2);

            let jsonTest = this.InputWithType.jsonInput;
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
                  console.log(jsonTest);
                }
              }
              catch(err)
              {
                alert('Wrong JSON format!\n' + err);
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
                },




      }


    }

</script>


