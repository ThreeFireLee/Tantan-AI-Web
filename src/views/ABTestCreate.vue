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
              <dd><a href="javascript:void(0)" v-bind:class="{'cur':operationChose=='moniter'}" @click="operationChose='moniter'">A/B Testing</a></dd>
              <dd><a href="javascript:void(0)" v-bind:class="{'cur':operationChose=='wait-test'}" @click="operationChose='wait-test'">Wait for test</a></dd>
              <!--<dd v-for="(ops,index) in operationFilter">-->
              <!--<a href="javascript:void(0)" @click="operationChose=index" v-bind:class="{'cur':operationChose==index} ">{{ops.operations}}</a>-->
              <!--</dd>-->
            </dl>
          </div>

          <!-- main part -->
          <div class="accessory-list-wrap">
            <div class="model-main">
              <form action="" method="post" enctype="multipart/form-data">
              <div class="model-abtest-create-div">
                  <lable for="experimentId" class="abtestCreate-label-id-css">Experiment ID: </lable>
                  <lable for="experimentName" class="abtestCreate-label-name-css">Experiment Name: </lable>
                  <lable for="experimentType" class="abtestCreate-label-type-css">Experiment Type: </lable>

                <div>
                  <input type="text" name="experimentId" id="experimentId" v-model="experimentId" placeholder="experiment id" class="txt input-light experimentId-css">
                  <input type="text" name="experimentName" id="experimentName" v-model="experimentName" placeholder="experiment name" class="txt input-light experimentName-css">
                  <input type="text" name="experimentType" id="experimentType" v-model="experimentType" placeholder="experiment type" class="txt input-light experimentType-css">
                </div>
              </div>

              <div class="model-abtest-create-div">
                <lable for="startDate" class="abtestCreate-label-id-css">Start Date: </lable>
                <lable for="endDate" class="abtestCreate-label-endDate-css">End Date: </lable>
                <lable for="testKey" class="abtestCreate-label-testkey-css">Test Key: (Gender, MLC)</lable>
                <div>
                <input type="text" name="startDate" id="startDate" v-model="startDate" placeholder="start date" class="txt input-light experimentId-css">
                <input type="text" name="endDate" id="endDate" v-model="endDate" placeholder="end date" class="txt input-light experimentName-css">
                  <select class="abtestCreate-select-gender-css">
                    <option value ="male">Male</option>
                    <option value ="female">Female</option>
                  </select>
                  <select class="abtestCreate-select-mlc-css">
                    <option value ="type-zero">type 0</option>
                    <option value ="type-one">type 1</option>
                    <option value ="type-twoOrThree">type 2/3</option>
                    <option value ="type-four">type 4</option>
                  </select>
                </div>
              </div>


              <div class="model-one-three-div">
              </div>
              </form>
            </div>


          </div>
        </div>
      </div>
    </div>
    <!--<nav-footer></nav-footer>-->
  </div>
</template>

<script>
  import './../assets/css/base.css'
  import './../assets/css/product.css'
  import './../assets/css/login.css'
  import NavHeader from '@/components/NavHeader.vue'  // @ means src file
  import NavBreadCrumb from '@/components/NavBread.vue'
  import axios from 'axios'
  //import NavFooter from '@/components/NavFooter.vue'

  export default {
    data(){
      return{
        message:'',
        operationChose:'moniter',
      }
    },
    components: {
      NavHeader:NavHeader,
      // NavFooter:NavFooter,
      NavBreadCrumb:NavBreadCrumb
    },
    mounted: function(){
      //this.getGoodList();
    },
    methods: {


    }


  }

</script>


