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
            <dd><a href="javascript:void(0)" v-bind:class="{'cur':operationChose=='model'}" @click="operationChose='model'">Model</a></dd>
            <dd v-for="(ops,index) in operationFilter">
              <a href="javascript:void(0)" @click="operationChose=index" v-bind:class="{'cur':operationChose==index} ">{{ops.operations}}</a>
            </dd>
          </dl>
        </div>

        <!-- search result accessories list -->
        <div class="accessory-list-wrap">
          <div class="model-main">
            <div class="model-quarter-div">
              <form action="" method="post" enctype="multipart/form-data">
                <lable for="hbaseTable">Table Name:  </lable>
                <input type="text" name="hbaseTable" id="hbaseTable" v-model="hbaseTable" placeholder="Table Name" class="txt table-name-css">
                <br>
                <lable for="rowKey">Input Key: </lable>
                <input type="text" name="rowKey" id="rowKey" v-model="rowKey" placeholder="Your Key" class="txt row-key-css">
                <br>
                <lable for="ColFamily">Column Family:</lable>
                <input type="text" name="colFamily" id="colFamily" v-model="colFamily" placeholder="Col Family" class="txt col-family-css">

               <br><br>
                <button type="primary" @click="onSubmit($event)" class="btn only-for-button">Submit</button>
              </form>
              <br><br>
            </div>

            <div class="model-quarter-div">
              <!--<form action="" method="post">-->
                <!--<lable for="inputJson" >Your Json/Text:</lable>-->
                <!--<br><br>-->
                <!--<textarea id="jsonInput" v-model="message" rows="10" cols="40" class="adjusted-size"></textarea>-->
                <!--<br><br>-->
                <!--<button type="primary" @click="onTextSubmit($event)" class="btn">Submit</button>-->
              <!--</form>-->

              <form action="" method="post" id="myForm" enctype="multipart/form-data" class="the-submit">
                <label>
                  <input type="file" id="file" ref="file" v-on:change="handleFileUpload($event)">
                </label>
                <br><br>
                <button v-on:click="submitFile($event)" class="btn">Submit</button>
              </form>
              <div class="upload-reminder">
                {{fileUpRes}}
              </div>
            </div>


            <div class="model-quarter-div show-hbase-data">
              <br>
              <!--<iframe src="http://127.0.0.1:3000/parser/hbase" width="870" height="500" frameborder="0" id="key-presentation" class="model-panel"></iframe>-->
              <div>
                {{searchRst}}
              </div>

              <br><br><br><br><br>
            </div>


            <!--<div class="model-quarter-div">-->
              <!--area for json submit presentation-->
              <!--<br><br>-->
              <!--<iframe id="hbase-submit-presentation" class="model-panel"></iframe>-->
              <!--<br><br>-->
            <!--</div>-->
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

    export default {
        data(){
          return{
            goodList:[],
            operationFilter:[
              {
                operations:'Monitor'
              },
              {
                operations:'Wait for test'
              },
              {
                operations:'Wait for test'
              }
            ],

            hbaseTable:'',
            rowKey:'',
            colFamily:'',
            searchRst:'',
            file:'',
            fileUpRes:'',
            message:'',
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
            //this.onSubmit();
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
                formData.append('file', this.file);
                let config = {
                  headers:{'Content-Type':'multipart/form-data'}
                };

                axios.post("/parser/upload", formData, config
                  ).then(rst =>{
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
                showFilterPop(){
                  this.filterBy = true;
                  this.overLayFlag = true;
                },
                closePop(){
                  this.filterBy = false;
                  this.overLayFlag = false;
                },

          // onSubmit(event) {
          //   event.preventDefault();
          //
          //   //let formData = JSON.stringify(this.waterForm);
          //   let param = new FormData();
          //   param.append('this.waterForm.file', document.getElementById('submitFile').files[0]);
          //   alert('simpletest:' + param.get('this.waterForm.file'));

          //   let config = {
          //     headers:{'Content-Type':'multipart/form-data'}
          //   };
          //   console.log(param);//这里的内容在下面
          //
          //   axios.post('/parser', param, config)
          //     .then(response => {
          //       if (response.data.code === 0) {
          //         self.ImgUrl = response.data.data
          //       }
          //       console.log(response.data)
          //     })
          // }


      }


    }

</script>


