<template>
  <div>
    <nav-header></nav-header>
    <nav-bread-crumb>
      <span>Operations</span>
    </nav-bread-crumb>
  <div class="accessory-result-page accessory-page">
    <div class="container">
      <div class="filter-nav">
        <!--&lt;!&ndash;<span class="sortby">Sort by:</span>&ndash;&gt;-->
        <!--&lt;!&ndash;<a href="javascript:void(0)" class="default cur">Default</a>&ndash;&gt;-->
        <!--&lt;!&ndash;<a href="javascript:void(0)" class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>&ndash;&gt;-->
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
              <form action="" method="post">
              <lable for="rowKey">Input Key:</lable>
              <!--<input type="text" name="rowKey" id="rowKey" placeholder="your key">-->
              <input type="text" name="rowKey" id="rowKey" class="txt">
              <input type="submit" name="btnSubmit" id="btnSubmit" value="Submit" class="btn">
              </form>
                <br><br>
              <form action="" method="post">
                <lable for="inputJson" >Your Json/Text:</lable>
                <br><br>
                <textarea id="jsonInput" rows="30" cols="40" class="adjusted-size"></textarea>
                <br><br>
                <form action="" method="post" enctype="multipart/form-data" class="the-submit">
                  <input type="file" name="fileField" id="fileField" size="28" onchange="document.getElementById('textfield').value=this.value" >
                  <br><br>
                  <input type="submit" value="Submit">
                </form>
              </form>
            </div>

            <div class="model-quarter-div">
              place for key presentation
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
    import NavFooter from '@/components/NavFooter.vue'
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


