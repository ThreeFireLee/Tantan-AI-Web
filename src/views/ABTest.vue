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
              <dd><a href="javascript:void(0)" v-bind:class="{'cur':operationChose=='abtest'}" @click="operationChose='abtest-1'">A/B Testing</a></dd>
              <!--<dd><a href="javascript:void(0)" v-bind:class="{'cur':operationChose=='wait-test'}" @click="operationChose='wait-test'">Wait for test</a></dd>-->
            </dl>
          </div>

          <!-- main operation panel-->
          <div class="accessory-list-wrap">
            <div class="model-main">
              <!--<div class="model-quarter-div">-->
                <!--<button type="primary" class="btn only-create-button"><a href="/#/abtest/createExp">Create Experiment</a></button>-->
              <!--</div>-->
              <form action="" :model="abtest1" id="abtest1" method="post" enctype="multipart/form-data">
                <div class="model-quarter-div">
                <!--<form action="" :model="abtest1" id="abtest1" method="post" enctype="multipart/form-data">-->
                  <lable for="hbaseTablePut3">Table Name:  </lable>
                  <input type="text" name="hbaseTablePut3" id="hbaseTablePut3" v-model="abtest1.hbaseTablePut3" placeholder="Table Name" class="txt input-light table-name-css">
                  <br>
                  <lable for="colFamilyPut3">Column Family:</lable>
                  <input type="text" name="colFamilyPut3" id="colFamilyPut3" v-model="abtest1.colFamilyPut3" placeholder="Col Family" class="txt input-light col-family-css">
                    <br><br>
                  <label>Experiment name</label>
                  <label class="abtest-right-move">Hash Id</label><br>
                  <input type="text" name="experiment_name" id="experiment_name" v-model="abtest1.abtestCore.experiment_name" placeholder="name" class="txt input-light abtest-Name-css">
                  <input type="text" name="hash_id" id="hash_id" v-model="abtest1.abtestCore.hash_id" placeholder="hash id" class="txt input-light abtest-Hash-css">

                  <div v-for="l in abtest1.abtestCore.whitelists">
                    <br><br>
                    <input type="text" v-model="l.treatment" placeholder="treatment name" class="input-light seg-name">
                    <input type="text" v-model="l.user_ids" placeholder="white list" class="txt input-light abtest-seg">
                    </div>
                  <br><br>
                  <label>Operator: </label>
                  <input type="text" name="operator_name" id="operator_name" v-model="abtest1.operator_name" placeholder="operator name"class="input-light seg-name">
                  <br><br>
                  <!--<button v-on:click="submitForReview($event)" class="btn">Review</button>-->
                  <button v-on:click="submitWhiteList($event)" class="btn the-submit">Provision</button>

                <!--</form>-->
                <br>
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
                <p2>Total Percent: </p2> {{_rampings}}
                <br>
                <div v-for="l in abtest1.abtestCore.ramp">
                  <br>
                  <input type="text" v-model="l.percentage" placeholder="" class="txt input-light abtest-ramp">%
                  <input type="text" v-model="l.treatment" placeholder="treatment name" class="input-light abtest-ramp-name">
                </div>

              </div>
              </form>
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
      return {
        message: '',
        operationChose: 'abtest-1',

      abtest1:{
        hbaseTablePut3:'test-abtest',
        colFamilyPut3:'col',
        ramping_1:'',
        abtestCore:{
            experiment_name:'tantan-rec-male-mlc0',
            hash_id:'111111',
            whitelists: [{
              user_ids: '20,20,10,10',
              treatment:''
            },
              {
                user_ids: '',
                treatment:''
              },
              {
                user_ids: '',
                treatment:''
              },
              {
                user_ids: '',
                treatment:''
              },
              {
                user_ids:'',
                treatment:''
              }
            ],
          ramp:[
            {
              treatment:'model_001_lr_like_mlc0',//"model_001_lr_like_mlc0",
              percentage:50
            },
            {
              treatment:'',
              percentage:''
            },
            {
              treatment:'',
              percentage:''
            },
            {
              treatment:'',
              percentage:''
            },
            {
              treatment:'',
              percentage:''
            },
            {
              treatment:'',
              percentage:''
            },
            {
              treatment:'',
              percentage:''
            },
            {
              treatment:'',
              percentage:''
            },
            {
              treatment:'',
              percentage:''
            },
            {
              treatment:'',
              percentage:''
            }
          ]

        },
        operator_name:'',
      },

        rampings:{
          ramping_6:'4',
          ramping_7:'3'
        }
      }
    },
    components: {
      NavHeader:NavHeader,
      // NavFooter:NavFooter,
      NavBreadCrumb:NavBreadCrumb
    },
    computed:{
      //RampSum: function() {
          //return parseInt(this.rampings.ramping_3) + parseInt(this.rampings.ramping_2);
      //}
      _rampings: {
        set: function (value) {
          this._rampings.ramping_6 = value;
        },
        get: function () {
          return parseInt(this.rampings.ramping_6) + parseInt(this.rampings.ramping_7);
        }
      }
    },
    methods: {

      submitWhiteList(event){
        event.preventDefault();
        //parse user_ids to array
        this.abtest1.abtestCore.whitelists = this.abtest1.abtestCore.whitelists.map(x =>({
          treatment: x.treatment,
          // 先分割 ， 字符串 然后 过滤掉空字符串。
          // 因为如果本身是空字符串 的话 会生成一个长度是1的空字符串列表
          //user_ids: x.user_ids.split('，').filter(x => x.trim())
          user_ids: x.user_ids.split(',').filter(x => x.trim()).map(x => Number(x))
        }));

        let formData = new FormData();
        let abtestData = JSON.stringify(this.abtest1.abtestCore);

        formData.append('hbaseTablePut3', this.abtest1.hbaseTablePut3);
        formData.append('colFamilyPut3', this.abtest1.colFamilyPut3);
        formData.append('experiment_name', this.abtest1.abtestCore.experiment_name);
        formData.append('abtestData', abtestData);
        //formData.append('rampData',abtestRamp);
        formData.append('operator_name', this.abtest1.operator_name);



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

<!--<input type="text" name="ramping_1" id="ramping_1" v-model="abtest1.ramping_1" placeholder="" class="txt input-light abtest-ramp">-->
<!--%-->
<!--<input type="text" name="ramp_model_1" id="ramp_model_1" v-model="abtest1.ramp_model_1" placeholder="Treat 1 name"class="input-light abtest-ramp-name">-->
<!--<br>-->
<!--<input type="text" name="ramping_2" id="ramping_2" v-model="abtest1.ramping_2" placeholder="" class="txt input-light abtest-ramp">-->
<!--%-->
<!--<input type="text" name="ramp_model_2" id="ramp_model_2" v-model="abtest1.ramp_model_2" placeholder="Treat 2 name"class="input-light abtest-ramp-name">-->
<!--<br>-->
<!--<input type="text" name="ramping_3" id="ramping_3" v-model="abtest1.ramping_3" placeholder="" class="txt input-light abtest-ramp">-->
<!--%-->
<!--<input type="text" name="ramp_model_3" id="ramp_model_3" v-model="abtest1.ramp_model_3" placeholder="Treat 3 name"class="input-light abtest-ramp-name">-->
<!--<br>-->
<!--<input type="text" name="ramping_4" id="ramping_4" v-model="abtest1.ramping_4" placeholder="" class="txt input-light abtest-ramp">-->
<!--%-->
<!--<input type="text" name="ramp_model_4" id="ramp_model_4" v-model="abtest1.ramp_model_4" placeholder="Treat 4 name"class="input-light abtest-ramp-name">-->
<!--<br>-->
<!--<input type="text" name="ramping_5" id="ramping_5" v-model="abtest1.ramping_5" placeholder="" class="txt input-light abtest-ramp">-->
<!--%-->
<!--<input type="text" name="ramp_model_5" id="ramp_model_5" v-model="abtest1.ramp_model_5" placeholder="Treat 5 name"class="input-light abtest-ramp-name">-->
<!--<br>-->
<!--<input type="text" name="ramping_6" id="ramping_6" v-model="_rampings.ramping_6" placeholder="" class="txt input-light abtest-ramp">-->
<!--%-->
<!--<input type="text" name="ramp_model_6" id="ramp_model_6" v-model="rampings.ramp_model_6" placeholder="Treat 6 name"class="input-light abtest-ramp-name">-->
<!--<br>-->
<!--<input type="text" name="ramping_7" id="ramping_7" v-model="_rampings.ramping_7" placeholder="" class="txt input-light abtest-ramp">-->
<!--%-->
<!--<input type="text" name="ramp_model_7" id="ramp_model_7" v-model="rampings.ramp_model_7" placeholder="Treat 7 name"class="input-light abtest-ramp-name">-->
<!--<br>-->
<!--<input type="text" name="ramping_8" id="ramping_8" v-model="rampings.ramping_8" placeholder="" class="txt input-light abtest-ramp">-->
<!--%-->
<!--<input type="text" name="ramp_model_8" id="ramp_model_8" v-model="rampings.ramp_model_8" placeholder="Treat 8 name"class="input-light abtest-ramp-name">-->
<!--<br>-->
<!--<input type="text" name="ramping_9" id="ramping_9" v-model="rampings.ramping_9" placeholder="" class="txt input-light abtest-ramp">-->
<!--%-->
<!--<input type="text" name="ramp_model_9" id="ramp_model_9" v-model="rampings.ramp_model_9" placeholder="Treat 9 name"class="input-light abtest-ramp-name">-->
<!--<br>-->
<!--<input type="text" name="ramping_10" id="ramping_10" v-model="rampings.ramping_10" placeholder="" class="txt input-light abtest-ramp">-->
<!--%-->
<!--<input type="text" name="ramp_model_10" id="ramp_model_10" v-model="rampings.ramp_model_10" placeholder="Treat 10 name"class="input-light abtest-ramp-name">-->
<!--<br>-->
<!--<input type="text" name="ramping_11" id="ramping_11" v-model="rampings.ramping_11" placeholder="" class="txt input-light abtest-ramp">-->
<!--%-->
<!--<input type="text" name="ramp_model_11" id="ramp_model_11" v-model="rampings.ramp_model_11" placeholder="Treat 11 name"class="input-light abtest-ramp-name">-->
<!--<br>-->
<!--<input type="text" name="ramping_12" id="ramping_12" v-model="rampings.ramping_12" placeholder="" class="txt input-light abtest-ramp">-->
<!--%-->
<!--<input type="text" name="ramp_model_12" id="ramp_model_12" v-model="rampings.ramp_model_12" placeholder="Treat 12 name"class="input-light abtest-ramp-name">-->
<!--<br>-->
<!--<input type="text" name="ramping_13" id="ramping_13" v-model="rampings.ramping_13" placeholder="" class="txt input-light abtest-ramp">-->
<!--%-->
<!--<input type="text" name="ramp_model_13" id="ramp_model_13" v-model="rampings.ramp_model_13" placeholder="Treat 13 name"class="input-light abtest-ramp-name">-->
<!--<br>-->
<!--<input type="text" name="ramping_14" id="ramping_14" v-model="rampings.ramping_14" placeholder="" class="txt input-light abtest-ramp">-->
<!--%-->
<!--<input type="text" name="ramp_model_14" id="ramp_model_14" v-model="rampings.ramp_model_14" placeholder="Treat 14 name"class="input-light abtest-ramp-name">-->
<!--<br>-->
<!--<input type="text" name="ramping_15" id="ramping_15" v-model="rampings.ramping_15" placeholder="" class="txt input-light abtest-ramp">-->
<!--%-->
<!--<input type="text" name="ramp_model_15" id="ramp_model_15" v-model="rampings.ramp_model_15" placeholder="Treat 15 name"class="input-light abtest-ramp-name">-->
<!--<br>-->
<!--<input type="text" name="ramping_16" id="ramping_16" v-model="rampings.ramping_16" placeholder="" class="txt input-light abtest-ramp">-->
<!--%-->
<!--<input type="text" name="ramp_model_16" id="ramp_model_16" v-model="rampings.ramp_model_16" placeholder="Treat 16 name"class="input-light abtest-ramp-name">-->
<!--<br>-->
<!--<input type="text" name="ramping_17" id="ramping_17" v-model="rampings.ramping_17" placeholder="" class="txt input-light abtest-ramp">-->
<!--%-->
<!--<input type="text" name="ramp_model_17" id="ramp_model_17" v-model="rampings.ramp_model_17" placeholder="Treat 17 name"class="input-light abtest-ramp-name">-->
<!--<br>-->
<!--<input type="text" name="ramping_18" id="ramping_18" v-model="rampings.ramping_18" placeholder="" class="txt input-light abtest-ramp">-->
<!--%-->
<!--<input type="text" name="ramp_model_18" id="ramp_model_18" v-model="rampings.ramp_model_18" placeholder="Treat 18 name"class="input-light abtest-ramp-name">-->
<!--<br>-->
<!--<input type="text" name="ramping_19" id="ramping_19" v-model="rampings.ramping_19" placeholder="" class="txt input-light abtest-ramp">-->
<!--%-->
<!--<input type="text" name="ramp_model_19" id="ramp_model_19" v-model="rampings.ramp_model_19" placeholder="Treat 19 name"class="input-light abtest-ramp-name">-->
<!--<br>-->
<!--<input type="text" name="ramping_20" id="ramping_20" v-model="rampings.ramping_20" placeholder="" class="txt input-light abtest-ramp">-->
<!--%-->
<!--<input type="text" name="ramp_model_20" id="ramp_model_20" v-model="rampings.ramp_model_20" placeholder="Treat 20 name"class="input-light abtest-ramp-name">-->
<!--<br><br>-->
