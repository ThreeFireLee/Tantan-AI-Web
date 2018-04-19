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
                <button type="primary" @click="onSubmit($event)" class="btn">Submit</button>
              </form>
              <br><br>
              <div>
              <form action="" method="post">
                <lable for="inputJson" >Your Json/Text:</lable>
                <br><br>
                <textarea id="jsonInput" v-model="message" rows="30" cols="40" class="adjusted-size"></textarea>
                <br><br>
                <button type="primary" @click="onTextSubmit($event)" class="btn">Submit</button>
              </form>

                <form action="" method="post" id="myForm" enctype="multipart/form-data" class="the-submit">
                  <!--<input type="file" name="fileField" id="fileField" size="28" onchange="document.getElementById('textfield').value=this.value" >-->
                  <!--<input type="file" id="submitFile" @change="getFile($event)">-->
                <label>
                  <input type="file" id="file" ref="file" v-on:change="handleFileUpload()">
                </label>
                <br><br>
                  <button v-on:click="submitFile()">Submit</button>
                  <!--<br><br>-->
                  <!--<input type="submit" value="Submit" @click="onSubmit($event)">-->
                </form>


              </div>
            </div>

            <div class="model-quarter-div">
              area for key presentation
              <br><br>
              <iframe id="key-presentation" class="model-panel"></iframe>
              <br><br>
            </div>

            <!--not used -->
            <div class="model-quarter-div">
            </div>
            <div class="model-quarter-div">
              area for json submit presentation
              <br><br>
              <iframe id="hbase-submit-presentation" class="model-panel"></iframe>
              <br><br>
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
            file:'',
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
            //this.submitFile();
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
               ).then(function(res){
              console.log(res);
            })
              .catch(function(err){
                console.log(err);
              });
          },
          onTextSubmit($event){
            event.preventDefault();
            axios.post("/parser/hbasePut",
              {
                hbaseTable:this.hbaseTable,
                rowKey:this.rowKey,
                colFamily:this.colFamily
              },
            ).then(function(res){
              console.log(res);
            })
              .catch(function(err){
                console.log(err);
              });

          },
          // getFile(event) {
          //   this.waterForm.file = event.target.files[0];
          // },

          submitFile(){
                let formData = new FormData();
                formData.append('file', this.file);
                let config = {
                  headers:{'Content-Type':'multipart/form-data'}
                };

                axios.post("/parser/upload", formData, config
                  ).then(function(){
                    console.log('SUCCESS!!');
                  })
                    .catch(function(){
                      console.log('FAILURE!!');
                    });
                },
            handleFileUpload(){
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


