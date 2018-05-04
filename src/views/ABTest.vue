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
              <dd><a href="javascript:void(0)" v-bind:class="{'cur':operationChose=='abtest'}" @click="operationChose='abtest'">A/B Testing</a></dd>
              <!--<dd><a href="javascript:void(0)" v-bind:class="{'cur':operationChose=='wait-test'}" @click="operationChose='wait-test'">Wait for test</a></dd>-->
            </dl>
          </div>

          <!-- main operation panel-->
          <div class="accessory-list-wrap">
            <div class="model-main">
              <!--<div class="model-quarter-div">-->
                <!--<button type="primary" class="btn only-create-button"><a href="/#/abtest/createExp">Create Experiment</a></button>-->
              <!--</div>-->

              <div class="model-quarter-div">
                <form action="" :model="whiteLists" ref="whiteLists" method="post" id="whiteLists"  enctype="multipart/form-data">
                  <lable for="hbaseTablePut3">Table Name:  </lable>
                  <input type="text" name="hbaseTablePut3" id="hbaseTablePut3" v-model="whiteLists.hbaseTablePut3" placeholder="Table Name" class="txt input-light table-name-css">
                  <br>
                  <lable for="rowKeyPut3">Input Key: </lable>
                  <input type="text" name="rowKeyPut3" id="rowKeyPut3" v-model="whiteLists.rowKeyPut3" placeholder="Your Key" class="txt input-light row-key-css">
                  <br>
                  <lable for="colFamilyPut3">Column Family:</lable>
                  <input type="text" name="colFamilyPut3" id="colFamilyPut3" v-model="whiteLists.colFamilyPut3" placeholder="Col Family" class="txt input-light col-family-css">
                  <br><br>
                  <label>Name</label>
                  <label class="abtest-right-move">Hash Id</label><br>
                  <input type="text" name="wlName" id="wlName" v-model="whiteLists.wlName" placeholder="name" class="txt input-light abtest-Name-css-css">
                  <input type="text" name="HashId" id="HashId" v-model="whiteLists.HashId" placeholder="hash id" class="txt input-light abtest-Hash-css">
                  <br><br>
                  <input type="text" name="seg1_name" id="seg1_name" v-model="whiteLists.seg1_name" placeholder="seg1 name"class="input-light seg-name">
                  <input type="text" name="seg1" id="seg1" v-model="whiteLists.seg1" placeholder="white list 1" class="txt input-light abtest-seg">
                  <br>
                  <input type="text" name="seg2_name" id="seg2_name" v-model="whiteLists.seg2_name" placeholder="seg2 name"class="input-light seg-name">
                  <input type="text" name="seg2" id="seg2" v-model="whiteLists.seg2" placeholder="white list 2" class="txt input-light abtest-seg">
                  <br>
                  <input type="text" name="seg3_name" id="seg3_name" v-model="whiteLists.seg3_name" placeholder="seg3 name"class="input-light seg-name">
                  <input type="text" name="seg3" id="seg3" v-model="whiteLists.seg3" placeholder="white list 3" class="txt input-light abtest-seg">

                  <br><br>
                  <button v-on:click="submitForReview($event)" class="btn">Review</button>
                  <button v-on:click="submitWhiteList($event)" class="btn the-submit">Provision</button>
                </form>

              </div>


              <div class="model-quarter-div">
                <form action="" :model="rampings" ref="rampings" method="post" id="rampings"  enctype="multipart/form-data">
                  <input type="text" name="ramp_model_1" id="ramp_model_1" v-model="rampings.ramp_model_1" placeholder="Model 1 name"class="input-light">
                  <input type="text" name="ramping_1" id="ramping_1" v-model="rampings.ramping_1" placeholder="%" class="txt input-light abtest-ramp">
                  <br>
                  <input type="text" name="ramp_model_2" id="ramp_model_2" v-model="rampings.ramp_model_2" placeholder="Model 2 name"class="input-light">
                  <input type="text" name="ramping_2" id="ramping_2" v-model="rampings.ramping_2" placeholder="%" class="txt input-light abtest-ramp">
                  <br>
                  <input type="text" name="ramp_model_3" id="ramp_model_3" v-model="rampings.ramp_model_3" placeholder="Model 3 name"class="input-light">
                  <input type="text" name="ramping_3" id="ramping_3" v-model="rampings.ramping_3" placeholder="%" class="txt input-light abtest-ramp">
                  <br>
                  <input type="text" name="ramp_model_4" id="ramp_model_4" v-model="rampings.ramp_model_4" placeholder="Model 4 name"class="input-light">
                  <input type="text" name="ramping_4" id="ramping_4" v-model="rampings.ramping_4" placeholder="%" class="txt input-light abtest-ramp">
                  <br>
                  <input type="text" name="ramp_model_5" id="ramp_model_5" v-model="rampings.ramp_model_5" placeholder="Model 5 name"class="input-light">
                  <input type="text" name="ramping_5" id="ramping_5" v-model="rampings.ramping_5" placeholder="%" class="txt input-light abtest-ramp">
                  <br>
                  <input type="text" name="ramp_model_6" id="ramp_model_6" v-model="rampings.ramp_model_6" placeholder="Model 6 name"class="input-light">
                  <input type="text" name="ramping_6" id="ramping_6" v-model="rampings.ramping_6" placeholder="%" class="txt input-light abtest-ramp">
                  <br>
                  <input type="text" name="ramp_model_7" id="ramp_model_7" v-model="rampings.ramp_model_7" placeholder="Model 7 name"class="input-light">
                  <input type="text" name="ramping_7" id="ramping_7" v-model="rampings.ramping_7" placeholder="%" class="txt input-light abtest-ramp">
                  <br>
                  <input type="text" name="ramp_model_8" id="ramp_model_8" v-model="rampings.ramp_model_8" placeholder="Model 8 name"class="input-light">
                  <input type="text" name="ramping_8" id="ramping_8" v-model="rampings.ramping_8" placeholder="%" class="txt input-light abtest-ramp">
                  <br>
                  <input type="text" name="ramp_model_9" id="ramp_model_9" v-model="rampings.ramp_model_9" placeholder="Model 9 name"class="input-light">
                  <input type="text" name="ramping_9" id="ramping_9" v-model="rampings.ramping_9" placeholder="%" class="txt input-light abtest-ramp">
                  <br>
                  <input type="text" name="ramp_model_10" id="ramp_model_10" v-model="rampings.ramp_model_10" placeholder="Model 10 name"class="input-light">
                  <input type="text" name="ramping_10" id="ramping_10" v-model="rampings.ramping_10" placeholder="%" class="txt input-light abtest-ramp">
                  <br>
                  <input type="text" name="ramp_model_11" id="ramp_model_11" v-model="rampings.ramp_model_11" placeholder="Model 11 name"class="input-light">
                  <input type="text" name="ramping_11" id="ramping_11" v-model="rampings.ramping_11" placeholder="%" class="txt input-light abtest-ramp">
                  <br>
                  <input type="text" name="ramp_model_12" id="ramp_model_12" v-model="rampings.ramp_model_12" placeholder="Model 12 name"class="input-light">
                  <input type="text" name="ramping_12" id="ramping_12" v-model="rampings.ramping_12" placeholder="%" class="txt input-light abtest-ramp">
                  <br>
                  <input type="text" name="ramp_model_13" id="ramp_model_13" v-model="rampings.ramp_model_13" placeholder="Model 13 name"class="input-light">
                  <input type="text" name="ramping_13" id="ramping_13" v-model="rampings.ramping_13" placeholder="%" class="txt input-light abtest-ramp">
                  <br>
                  <input type="text" name="ramp_model_14" id="ramp_model_14" v-model="rampings.ramp_model_14" placeholder="Model 14 name"class="input-light">
                  <input type="text" name="ramping_14" id="ramping_14" v-model="rampings.ramping_14" placeholder="%" class="txt input-light abtest-ramp">
                  <br>
                  <input type="text" name="ramp_model_15" id="ramp_model_15" v-model="rampings.ramp_model_15" placeholder="Model 15 name"class="input-light">
                  <input type="text" name="ramping_15" id="ramping_15" v-model="rampings.ramping_15" placeholder="%" class="txt input-light abtest-ramp">
                  <br>
                  <input type="text" name="ramp_model_16" id="ramp_model_16" v-model="rampings.ramp_model_16" placeholder="Model 16 name"class="input-light">
                  <input type="text" name="ramping_16" id="ramping_16" v-model="rampings.ramping_16" placeholder="%" class="txt input-light abtest-ramp">
                  <br>
                  <input type="text" name="ramp_model_17" id="ramp_model_17" v-model="rampings.ramp_model_17" placeholder="Model 17 name"class="input-light">
                  <input type="text" name="ramping_17" id="ramping_17" v-model="rampings.ramping_17" placeholder="%" class="txt input-light abtest-ramp">
                  <br>
                  <input type="text" name="ramp_model_18" id="ramp_model_18" v-model="rampings.ramp_model_18" placeholder="Model 18 name"class="input-light">
                  <input type="text" name="ramping_18" id="ramping_18" v-model="rampings.ramping_18" placeholder="%" class="txt input-light abtest-ramp">
                  <br>
                  <input type="text" name="ramp_model_19" id="ramp_model_19" v-model="rampings.ramp_model_19" placeholder="Model 19 name"class="input-light">
                  <input type="text" name="ramping_19" id="ramping_19" v-model="rampings.ramping_19" placeholder="%" class="txt input-light abtest-ramp">
                  <br>
                  <input type="text" name="ramp_model_20" id="ramp_model_20" v-model="rampings.ramp_model_20" placeholder="Model 20 name"class="input-light">
                  <input type="text" name="ramping_20" id="ramping_20" v-model="rampings.ramping_20" placeholder="%" class="txt input-light abtest-ramp">
                  <br><br><br>
                  <p2>Total Percent: </p2>
                  <!--<input type="text"  value="" id="sum" v-on:click="cal">-->
                  {{rampSum}}
                  <br><br>
                  <button v-on:click="submitRamp($event)" class="btn the-submit">Provision</button>
                </form>
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
  //import NavFooter from '@/components/NavFooter.vue'

  export default {
    data(){
      return{
        message:'',
        operationChose:'abtest',

        whiteLists:{
          hbaseTablePut3:[''],
          rowKeyPut3:'2',
          colFamilyPut3:'3',
          wlName:'4',
          HashId:'5',
          seg1_name:'6',
          seg2_name:'7',
          seg3_name:'8',
          seg1:'11',
          seg2:'11',
          seg3:'11'
        },

        rampings:{
          ramping_1:'',
          ramping_2:''
        }
      }
    },
    components: {
      NavHeader:NavHeader,
      // NavFooter:NavFooter,
      NavBreadCrumb:NavBreadCrumb
    },
    methods: {
      // cal(){
      //   document.getElementById("sum").value=(parseInt(document.getElementById("ramping_1").value)+parseInt(document.getElementById("ramping_2").value));
      // },
      rampSum:function () {
        return parseInt(this.rampings.ramping_1) + parseInt(this.rampings.ramping_2);
      },
      submitWhiteList(event){
        event.preventDefault();
        // let formData = JSON.stringify(this.InputWithType);
        //let a =  qs.stringify(this.hbaseTablePut);

        let formData = new FormData();
        formData.append('hbaseTablePut3', this.whiteLists.hbaseTablePut3);
        formData.append('rowKeyPut3', this.whiteLists.rowKeyPut3);
        formData.append('colFamilyPut3', this.whiteLists.colFamilyPut3);
        formData.append('wlName', this.whiteLists.wlName);
        formData.append('HashId', this.whiteLists.HashId);
        formData.append('seg1_name', this.whiteLists.seg1_name);
        formData.append('seg2_name', this.whiteLists.seg2_name);
        formData.append('seg3_name', this.whiteLists.seg3_name);
        formData.append('seg1', this.whiteLists.seg1);
        formData.append('seg2', this.whiteLists.seg2);
        formData.append('seg3', this.whiteLists.seg3);


        let config = {
          headers:{'Content-Type':'multipart/form-data'}
        };


        axios.post("/parser/uploadABtest", formData
          ,config
        ).then(rst =>{
          console.log(rst.data);
          console.log('Success! From node.js');
        })
          .catch(function(){
            this.fileUpRes = 'failed';
            console.log('FAILURE!!');
          });
      }

    }


  }

</script>


