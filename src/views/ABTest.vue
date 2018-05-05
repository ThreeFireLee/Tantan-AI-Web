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
                <form action="" :model="abtest" ref="abtest" method="post" id="abtest"  enctype="multipart/form-data">
                  <lable for="hbaseTablePut3">Table Name:  </lable>
                  <input type="text" name="hbaseTablePut3" id="hbaseTablePut3" v-model="abtest.hbaseTablePut3" placeholder="Table Name" class="txt input-light table-name-css">
                  <br>
                  <lable for="colFamilyPut3">Column Family:</lable>
                  <input type="text" name="colFamilyPut3" id="colFamilyPut3" v-model="abtest.colFamilyPut3" placeholder="Col Family" class="txt input-light col-family-css">
                  <br><br>
                  <label>Experiment name</label>
                  <label class="abtest-right-move">Hash Id</label><br>
                  <input type="text" name="experiment_name" id="experiment_name" v-model="abtest.experiment_name" placeholder="name" class="txt input-light abtest-Name-css">
                  <input type="text" name="hash_id" id="hash_id" v-model="abtest.hash_id" placeholder="hash id" class="txt input-light abtest-Hash-css">
                  <br><br>
                  <input type="text" name="seg1_name" v-model="abtest.seg1_name" placeholder="treatment1 name"class="input-light seg-name">
                  <input type="text" name="seg1[]" v-model="abtest.seg1" placeholder="white list 1" class="txt input-light abtest-seg">
                  <br>
                  <input type="text" name="seg2_name" id="seg2_name" v-model="abtest.seg2_name" placeholder="treatment2 name"class="input-light seg-name">
                  <input type="text" name="seg2" id="seg2" v-model="abtest.seg2" placeholder="white list 2" class="txt input-light abtest-seg">
                  <br>
                  <input type="text" name="seg3_name" id="seg3_name" v-model="abtest.seg3_name" placeholder="treatment3 name"class="input-light seg-name">
                  <input type="text" name="seg3" id="seg3" v-model="abtest.seg3" placeholder="white list 3" class="txt input-light abtest-seg">
                  <br>
                  <input type="text" name="seg4_name" id="seg4_name" v-model="abtest.seg3_name" placeholder="treatment4 name"class="input-light seg-name">
                  <input type="text" name="seg4" id="seg4" v-model="abtest.seg4" placeholder="white list 4" class="txt input-light abtest-seg">
                  <br>
                  <input type="text" name="seg5_name" id="seg5_name" v-model="abtest.seg5_name" placeholder="treatment5 name"class="input-light seg-name">
                  <input type="text" name="seg5" id="seg5" v-model="abtest.seg5" placeholder="white list 5" class="txt input-light abtest-seg">
                  <br><br>
                  <label>Operator: </label>
                  <input type="text" name="op_name" id="op_name" v-model="abtest.op_name" placeholder="operator name"class="input-light seg-name">
                  <br><br>
                  <button v-on:click="submitForReview($event)" class="btn">Review</button>
                  <button v-on:click="submitWhiteList($event)" class="btn the-submit">Provision</button>
                </form>
                <label>Notification List: </label>
                <select class="abtest-notification-list">
                  <option>p1</option>
                  <option>p2</option>
                  <option>p3</option>
                  <option>p4</option>
                  <option>p5</option>
                  <option>p6</option>
                </select>

              </div>


              <div class="model-quarter-div">
                <p2>Total Percent: </p2>
                <input type="text"  value="" id="sum" v-on:click="cal">
                <form action="" :model="rampings" ref="rampings" method="post" id="rampings"  enctype="multipart/form-data">
                  <input type="text" name="ramping_1" id="ramping_1" v-model="rampings.ramping_1" placeholder="" class="txt input-light abtest-ramp">
                  %
                  <input type="text" name="ramp_model_1" id="ramp_model_1" v-model="rampings.ramp_model_1" placeholder="Treat 1 name"class="input-light abtest-ramp-name">
                  <br>
                  <input type="text" name="ramping_2" id="ramping_2" v-model="rampings.ramping_2" placeholder="" class="txt input-light abtest-ramp">
                  %
                  <input type="text" name="ramp_model_2" id="ramp_model_2" v-model="rampings.ramp_model_2" placeholder="Treat 2 name"class="input-light abtest-ramp-name">
                  <br>
                  <input type="text" name="ramping_3" id="ramping_3" v-model="rampings.ramping_3" placeholder="" class="txt input-light abtest-ramp">
                  %
                  <input type="text" name="ramp_model_3" id="ramp_model_3" v-model="rampings.ramp_model_3" placeholder="Treat 3 name"class="input-light abtest-ramp-name">
                  <br>
                  <input type="text" name="ramping_4" id="ramping_4" v-model="rampings.ramping_4" placeholder="" class="txt input-light abtest-ramp">
                  %
                  <input type="text" name="ramp_model_4" id="ramp_model_4" v-model="rampings.ramp_model_4" placeholder="Treat 4 name"class="input-light abtest-ramp-name">
                  <br>
                  <input type="text" name="ramping_5" id="ramping_5" v-model="rampings.ramping_5" placeholder="" class="txt input-light abtest-ramp">
                  %
                  <input type="text" name="ramp_model_5" id="ramp_model_5" v-model="rampings.ramp_model_5" placeholder="Treat 5 name"class="input-light abtest-ramp-name">
                  <br>
                  <input type="text" name="ramping_6" id="ramping_6" v-model="rampings.ramping_6" placeholder="" class="txt input-light abtest-ramp">
                  %
                  <input type="text" name="ramp_model_6" id="ramp_model_6" v-model="rampings.ramp_model_6" placeholder="Treat 6 name"class="input-light abtest-ramp-name">
                  <br>
                  <input type="text" name="ramping_7" id="ramping_7" v-model="rampings.ramping_7" placeholder="" class="txt input-light abtest-ramp">
                  %
                  <input type="text" name="ramp_model_7" id="ramp_model_7" v-model="rampings.ramp_model_7" placeholder="Treat 7 name"class="input-light abtest-ramp-name">
                  <br>
                  <input type="text" name="ramping_8" id="ramping_8" v-model="rampings.ramping_8" placeholder="" class="txt input-light abtest-ramp">
                  %
                  <input type="text" name="ramp_model_8" id="ramp_model_8" v-model="rampings.ramp_model_8" placeholder="Treat 8 name"class="input-light abtest-ramp-name">
                  <br>
                  <input type="text" name="ramping_9" id="ramping_9" v-model="rampings.ramping_9" placeholder="" class="txt input-light abtest-ramp">
                  %
                  <input type="text" name="ramp_model_9" id="ramp_model_9" v-model="rampings.ramp_model_9" placeholder="Treat 9 name"class="input-light abtest-ramp-name">
                  <br>
                  <input type="text" name="ramping_10" id="ramping_10" v-model="rampings.ramping_10" placeholder="" class="txt input-light abtest-ramp">
                  %
                  <input type="text" name="ramp_model_10" id="ramp_model_10" v-model="rampings.ramp_model_10" placeholder="Treat 10 name"class="input-light abtest-ramp-name">
                  <br>
                  <input type="text" name="ramping_11" id="ramping_11" v-model="rampings.ramping_11" placeholder="" class="txt input-light abtest-ramp">
                  %
                  <input type="text" name="ramp_model_11" id="ramp_model_11" v-model="rampings.ramp_model_11" placeholder="Treat 11 name"class="input-light abtest-ramp-name">
                  <br>
                  <input type="text" name="ramping_12" id="ramping_12" v-model="rampings.ramping_12" placeholder="" class="txt input-light abtest-ramp">
                  %
                  <input type="text" name="ramp_model_12" id="ramp_model_12" v-model="rampings.ramp_model_12" placeholder="Treat 12 name"class="input-light abtest-ramp-name">
                  <br>
                  <input type="text" name="ramping_13" id="ramping_13" v-model="rampings.ramping_13" placeholder="" class="txt input-light abtest-ramp">
                  %
                  <input type="text" name="ramp_model_13" id="ramp_model_13" v-model="rampings.ramp_model_13" placeholder="Treat 13 name"class="input-light abtest-ramp-name">
                  <br>
                  <input type="text" name="ramping_14" id="ramping_14" v-model="rampings.ramping_14" placeholder="" class="txt input-light abtest-ramp">
                  %
                  <input type="text" name="ramp_model_14" id="ramp_model_14" v-model="rampings.ramp_model_14" placeholder="Treat 14 name"class="input-light abtest-ramp-name">
                  <br>
                  <input type="text" name="ramping_15" id="ramping_15" v-model="rampings.ramping_15" placeholder="" class="txt input-light abtest-ramp">
                  %
                  <input type="text" name="ramp_model_15" id="ramp_model_15" v-model="rampings.ramp_model_15" placeholder="Treat 15 name"class="input-light abtest-ramp-name">
                  <br>
                  <input type="text" name="ramping_16" id="ramping_16" v-model="rampings.ramping_16" placeholder="" class="txt input-light abtest-ramp">
                  %
                  <input type="text" name="ramp_model_16" id="ramp_model_16" v-model="rampings.ramp_model_16" placeholder="Treat 16 name"class="input-light abtest-ramp-name">
                  <br>
                  <input type="text" name="ramping_17" id="ramping_17" v-model="rampings.ramping_17" placeholder="" class="txt input-light abtest-ramp">
                  %
                  <input type="text" name="ramp_model_17" id="ramp_model_17" v-model="rampings.ramp_model_17" placeholder="Treat 17 name"class="input-light abtest-ramp-name">
                  <br>
                  <input type="text" name="ramping_18" id="ramping_18" v-model="rampings.ramping_18" placeholder="" class="txt input-light abtest-ramp">
                  %
                  <input type="text" name="ramp_model_18" id="ramp_model_18" v-model="rampings.ramp_model_18" placeholder="Treat 18 name"class="input-light abtest-ramp-name">
                  <br>
                  <input type="text" name="ramping_19" id="ramping_19" v-model="rampings.ramping_19" placeholder="" class="txt input-light abtest-ramp">
                  %
                  <input type="text" name="ramp_model_19" id="ramp_model_19" v-model="rampings.ramp_model_19" placeholder="Treat 19 name"class="input-light abtest-ramp-name">
                  <br>
                  <input type="text" name="ramping_20" id="ramping_20" v-model="rampings.ramping_20" placeholder="" class="txt input-light abtest-ramp">
                  %
                  <input type="text" name="ramp_model_20" id="ramp_model_20" v-model="rampings.ramp_model_20" placeholder="Treat 20 name"class="input-light abtest-ramp-name">
                  <!--{{rampSum}}-->
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

        // abtest:{
        //   hbaseTablePut3:'',
        //   colFamilyPut3:'3',
        //   wlName:'4',
        //   HashId:'5',
        //   seg1_name:'6',
        //   seg2_name:'7',
        //   seg3_name:'8',
        //   seg1:'11',
        //   seg2:'11',
        //   seg3:'11',
        //   op_name:''
        // },

      abtest:{
        experiment_name:'',
        // "experiment_id":'1',
         hash_id:'',
      //   "whitelists":[
      //   {
      //     "seg1":'',
      //     "seg1_name":''
      //   }
      // ]
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
      cal(){
        let ramp1 = document.getElementById("ramping_1").value;
        let ramp2 = document.getElementById("ramping_2").value;
        let ramp3 = document.getElementById("ramping_3").value;
        let ramp4 = document.getElementById("ramping_4").value;
        let ramp5 = document.getElementById("ramping_5").value;
        let ramp6 = document.getElementById("ramping_6").value;
        let ramp7 = document.getElementById("ramping_7").value;
        let ramp8 = document.getElementById("ramping_8").value;
        let ramp9 = document.getElementById("ramping_9").value;
        let ramp10 = document.getElementById("ramping_10").value;
        let ramp11 = document.getElementById("ramping_11").value;
        let ramp12 = document.getElementById("ramping_12").value;
        let ramp13 = document.getElementById("ramping_13").value;
        let ramp14 = document.getElementById("ramping_14").value;
        let ramp15 = document.getElementById("ramping_15").value;
        let ramp16 = document.getElementById("ramping_16").value;
        let ramp17 = document.getElementById("ramping_17").value;
        let ramp18 = document.getElementById("ramping_18").value;
        let ramp19 = document.getElementById("ramping_19").value;
        let ramp20 = document.getElementById("ramping_20").value;

        document.getElementById("sum").value=(parseInt(ramp1)+parseInt(ramp2)+parseInt(ramp3)+parseInt(ramp4)+
        parseInt(ramp5)+parseInt(ramp6)+parseInt(ramp7)+parseInt(ramp8)+parseInt(ramp9)+parseInt(ramp10)+parseInt(ramp11)
          +parseInt(ramp12)+parseInt(ramp13)+parseInt(ramp14)+parseInt(ramp15)+parseInt(ramp16)+parseInt(ramp17)+parseInt(ramp18)
          +parseInt(ramp19)+parseInt(ramp20));
      },
      // rampSum:function () {
      //   return parseInt(this.rampings.ramping_1) + parseInt(this.rampings.ramping_2);
      // },
      submitWhiteList(event){
        event.preventDefault();
        // let formData = JSON.stringify(this.InputWithType);
        //let a =  qs.stringify(this.hbaseTablePut);

        let formData = new FormData();
        // formData.append('hbaseTablePut3', this.abtest.hbaseTablePut3);
        // formData.append('colFamilyPut3', this.abtest.colFamilyPut3);
        // formData.append('wlName', this.abtest.wlName);
        // formData.append('HashId', this.abtest.HashId);
        // formData.append('seg1_name', this.abtest.seg1_name);
        // formData.append('seg2_name', this.abtest.seg2_name);
        // formData.append('seg3_name', this.abtest.seg3_name);
        // formData.append('seg1', this.abtest.seg1);
        // formData.append('seg2', this.abtest.seg2);
        // formData.append('seg3', this.abtest.seg3);
        // formData.append('op_name', this.abtest.op_name);
        let aatest = JSON.stringify(this.abtest);
        formData.append('abtestData', aatest);


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


