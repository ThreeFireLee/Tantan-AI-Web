<template>
  <div>
    <nav-header></nav-header>
    <nav-bread-crumb>
      <span>Operations</span>
      <span>test</span>
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
              <dd><a href="javascript:void(0)" v-bind:class="{'cur':operationChose=='abtest'}" @click="operationChose='abtest'">A/B Testing</a></dd>
              <dd><a href="javascript:void(0)" v-bind:class="{'cur':operationChose=='wait-test'}" @click="operationChose='wait-test'">Wait for test</a></dd>
            </dl>
          </div>

          <!-- main operation panel-->
          <div class="accessory-list-wrap">
            <div class="model-main">
              <!--<div class="model-quarter-div">-->
                <!--<button type="primary" class="btn only-create-button"><a href="/#/abtest/createExp">Create Experiment</a></button>-->
              <!--</div>-->

              <div class="model-quarter-div">
                <label>Name</label>
                <label class="abtest-right-move">Hash Id</label><br>
                <input type="text" name="Name" id="Name" v-model="Name" placeholder="name" class="txt input-light abtest-Name-css-css">

                <input type="text" name="HashId" id="HashId" v-model="HashId" placeholder="hash id" class="txt input-light abtest-Hash-css">
                <br><br><br>

                <form action="" :model="whiteLists" ref="whiteLists" method="post" id="whiteLists"  enctype="multipart/form-data">
                  <lable for="seg1">Seg01:  </lable>
                  <input type="text" name="seg1" id="seg1" v-model="whiteLists.seg1" placeholder="white list 1" class="txt input-light abtest-seg">
                  <br>
                  <lable for="seg2">Seg02: </lable>
                  <input type="text" name="seg2" id="seg2" v-model="whiteLists.seg2" placeholder="white list 2" class="txt input-light abtest-seg">
                  <br>
                  <lable for="seg3">Seg03:</lable>
                  <input type="text" name="seg3" id="seg3" v-model="whiteLists.seg3" placeholder="white list 3" class="txt input-light abtest-seg">

                  <br><br>
                  <button v-on:click="submitFile($event)" class="btn the-submit">Provision</button>
                </form>

              </div>


              <div class="model-quarter-div">
                <form action="" :model="rampings" ref="rampings" method="post" id="rampings"  enctype="multipart/form-data">
                  <lable for="ramping_1">RAMP 01:  </lable>
                  <input type="text" name="ramping_1" id="ramping_1" v-model="rampings.ramping_1" placeholder="RAMP 1" class="txt input-light abtest-ramp">
                  <br>
                  <lable for="ramping_2">RAMP 02:  </lable>
                  <input type="text" name="ramping_2" id="ramping_2" v-model="rampings.ramping_2" placeholder="RAMP 2" class="txt input-light abtest-ramp">
                  <br>
                  <lable for="ramping_3">RAMP 03:  </lable>
                  <input type="text" name="ramping_3" id="ramping_3" v-model="rampings.ramping_3" placeholder="RAMP 3" class="txt input-light abtest-ramp">
                  <br>
                  <lable for="ramping_4">RAMP 04:  </lable>
                  <input type="text" name="ramping_4" id="ramping_4" v-model="rampings.ramping_4" placeholder="RAMP 4" class="txt input-light abtest-ramp">
                  <br>
                  <lable for="ramping_5">RAMP 05:  </lable>
                  <input type="text" name="ramping_5" id="ramping_5" v-model="rampings.ramping_5" placeholder="RAMP 5" class="txt input-light abtest-ramp">
                  <br>
                  <lable for="ramping_6">RAMP 06:  </lable>
                  <input type="text" name="ramping_6" id="ramping_6" v-model="rampings.ramping_6" placeholder="RAMP 6" class="txt input-light abtest-ramp">
                  <br>
                  <lable for="ramping_7">RAMP 07:  </lable>
                  <input type="text" name="ramping_7" id="ramping_7" v-model="rampings.ramping_7" placeholder="RAMP 7" class="txt input-light abtest-ramp">
                  <br>
                  <lable for="ramping_8">RAMP 08:  </lable>
                  <input type="text" name="ramping_8" id="ramping_8" v-model="rampings.ramping_8" placeholder="RAMP 8" class="txt input-light abtest-ramp">
                  <br>
                  <lable for="ramping_9">RAMP 09:  </lable>
                  <input type="text" name="ramping_9" id="ramping_9" v-model="rampings.ramping_9" placeholder="RAMP 9" class="txt input-light abtest-ramp">
                  <br>
                  <lable for="ramping_10">RAMP 10:  </lable>
                  <input type="text" name="ramping_10" id="ramping_10" v-model="rampings.ramping_10" placeholder="RAMP 10" class="txt input-light abtest-ramp">
                  <br>
                  <lable for="ramping_11">RAMP 11:  </lable>
                  <input type="text" name="ramping_11" id="ramping_11" v-model="rampings.ramping_11" placeholder="RAMP 11" class="txt input-light abtest-ramp">
                  <br>
                  <lable for="ramping_12">RAMP 12:  </lable>
                  <input type="text" name="ramping_12" id="ramping_12" v-model="rampings.ramping_12" placeholder="RAMP 12" class="txt input-light abtest-ramp">
                  <br>
                  <lable for="ramping_13">RAMP 13:  </lable>
                  <input type="text" name="ramping_13" id="ramping_13" v-model="rampings.ramping_13" placeholder="RAMP 13" class="txt input-light abtest-ramp">
                  <br>
                  <lable for="ramping_14">RAMP 14:  </lable>
                  <input type="text" name="ramping_14" id="ramping_14" v-model="rampings.ramping_14" placeholder="RAMP 14" class="txt input-light abtest-ramp">
                  <br>
                  <lable for="ramping_15">RAMP 15:  </lable>
                  <input type="text" name="ramping_15" id="ramping_15" v-model="rampings.ramping_15" placeholder="RAMP 15" class="txt input-light abtest-ramp">
                  <br>
                  <lable for="ramping_16">RAMP 16:  </lable>
                  <input type="text" name="ramping_16" id="ramping_16" v-model="rampings.ramping_16" placeholder="RAMP 16" class="txt input-light abtest-ramp">
                  <br>
                  <lable for="ramping_17">RAMP 17:  </lable>
                  <input type="text" name="ramping_17" id="ramping_17" v-model="rampings.ramping_17" placeholder="RAMP 17" class="txt input-light abtest-ramp">
                  <br>
                  <lable for="ramping_18">RAMP 18:  </lable>
                  <input type="text" name="ramping_18" id="ramping_18" v-model="rampings.ramping_18" placeholder="RAMP 18" class="txt input-light abtest-ramp">
                  <br>
                  <lable for="ramping_19">RAMP 19:  </lable>
                  <input type="text" name="ramping_19" id="ramping_19" v-model="rampings.ramping_19" placeholder="RAMP 19" class="txt input-light abtest-ramp">
                  <br>
                  <lable for="ramping_20">RAMP 20:  </lable>
                  <input type="text" name="ramping_20" id="ramping_20" v-model="rampings.ramping_20" placeholder="RAMP 20" class="txt input-light abtest-ramp">
                  <br>
                  <br><br>
                  <button v-on:click="submitFile($event)" class="btn the-submit">Provision</button>
                </form>

              </div>


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
        operationChose:'abtest',
        whiteLists:{
          seg1:'',
          seg2:'',
          seg3:''
        },
        rampings:{

        }
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


