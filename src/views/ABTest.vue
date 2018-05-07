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
              <form action=""  method="post" enctype="multipart/form-data">
                <!--:model="abtest1" id="abtest1"-->
                <div class="model-quarter-div">
                <!--<form action="" :model="abtest1" id="abtest1" method="post" enctype="multipart/form-data">-->

                  <label>Operator: </label>
                  <input type="text" name="operator_name" id="operator_name" v-model="abtest1.operator_name" placeholder="operator name"class="input-light seg-name">
                  <br><br>
                  <lable for="experiment_id">experiment id:</lable>
                  <input type="text" name="experiment_id" id="experiment_id" v-model="abtest1.experiment_id" placeholder="1,2,3..." class="txt input-light table-name-css">
                  <br>
                  <lable for="hbaseTablePut3">Table Name:  </lable>
                  <input type="text" name="hbaseTablePut3" id="hbaseTablePut3" v-model="abtest1.hbaseTablePut3" placeholder="Table Name" class="txt input-light table-name-css">
                  <br>
                  <lable for="rowKeyPut3">Row Key:</lable>
                  <input type="text" name="rowKeyPut3" id="rowKeyPut3" v-model="abtest1.rowKeyPut3" placeholder="row key" class="txt input-light row-key-css">
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
                    <input type="text" v-model="l.user_ids" placeholder="white list(user ids)" class="txt input-light abtest-seg">
                    </div>
                   <br><br>
                  <button v-on:click="submitForReview($event)" class="btn">Review</button>
                  <button v-on:click="submitWhiteList($event)" class="btn the-submit">Provision</button>

                <!--</form>-->
                <br>
                <label>Notification List: </label>
                <select class="abtest-notification-list">
                  <option>AI推荐事业部</option>
                  <option>wuxianren@p1.com</option>
                  <option>hubo@p1.com</option>
                  <option>zhoushan@p1.com</option>
                  <option>tanyunzhi@p1.com</option>
                  <option>liumeng@p1.com</option>
                  <option>gaomochi@p1.com</option>
                  <option>huanghaihun@p1.com</option>
                  <option>liao@p1.com</option>
                  <option>lihuili@p1.com</option>
                  <option>yangzeyu@p1.com</option>
                  <option>chencangxiong@p1.com</option>
                  <option>pengdesheng@p1.com</option>
                  <option>liyan@p1.com</option>
                  <option>wuzuxiang@p1.com</option>


                </select>
                  <br>
                  <button v-on:click="submitRollBack($event)" class="btn">Roll Back</button>
              </div>


              <div class="model-quarter-div">
                <p2>Total Percent: </p2> {{_rampings}}
                <br>
                <div v-for="l in abtest1.abtestCore.ramp">
                  <br>
                  <input type="text" v-model="l.percentage" placeholder="" class="txt input-light abtest-ramp">%
                  <input type="text" v-model="l.treatment" placeholder="treatment name" class="input-light abtest-ramp-name">
                  <br>
                </div>
                <br><br>
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
        rowKeyPut3:'',
        ramping_1:'',
        abtestCore:{
            experiment_name:'tantan-rec-male-mlc0',
            hash_id:'111111',
            whitelists: [{
              user_ids: '20,20,10,10',
              treatment:'test1'
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
              percentage:'',
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
            {//10
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
      submitForReview(event){
        event.preventDefault();
        let abtestDataReviewOri = JSON.stringify(this.abtest1.abtestCore);
        let abtestDataReview =  abtestDataReviewOri
          .replace('{"user_ids":"","treatment":""},','')
          .replace('{"user_ids":"","treatment":""},','')
          .replace('{"user_ids":"","treatment":""},','')
          .replace('{"user_ids":"","treatment":""},','')
          .replace('{"user_ids":"","treatment":""},','')


          .replace(',{"treatment":"","percentage":""}','')
          .replace(/{"treatment":"","percentage":""},/,'')
          .replace(',{"treatment":"","percentage":""}','')
          .replace(/{"treatment":"","percentage":""},/,'')
          .replace(',{"treatment":"","percentage":""}','')
          .replace(/{"treatment":"","percentage":""},/,'')
          .replace(',{"treatment":"","percentage":""}','')
          .replace(/{"treatment":"","percentage":""},/,'')
          .replace(',{"treatment":"","percentage":""}','')
          .replace(/{"treatment":"","percentage":""},/,'')
          .replace(',{"treatment":"","percentage":""}','')
          .replace(/{"treatment":"","percentage":""},/,'')
          .replace(',{"treatment":"","percentage":""}','')
          .replace(/{"treatment":"","percentage":""},/,'')
          .replace(',{"treatment":"","percentage":""}','')
          .replace(/{"treatment":"","percentage":""},/,'')


        alert("Your json: \n" + abtestDataReview);
      },
      submitWhiteList(event){
        event.preventDefault();
        //parse user_ids to array
        this.abtest1.abtestCore.whitelists = this.abtest1.abtestCore.whitelists.map(x =>({
          user_ids: x.user_ids.split(',').filter(x => x.trim()).map(x => Number(x)),
          treatment: x.treatment
          // 先分割 ， 字符串 然后 过滤掉空字符串。
          // 因为如果本身是空字符串 的话 会生成一个长度是1的空字符串列表
          //user_ids: x.user_ids.split('，').filter(x => x.trim())

        }));

        this.abtest1.abtestCore.ramp= this.abtest1.abtestCore.ramp.map(y =>({
          treatment: y.treatment,
          percentage: parseInt(y.percentage)
        }));
        let formData = new FormData();
        let abtestDataOri = JSON.stringify(this.abtest1.abtestCore);
        let abtestData =  abtestDataOri
          .replace(/{"user_ids":[],"treatment":""},/,'')
          .replace(',{"user_ids":[],"treatment":""}','')
          .replace(/{"user_ids":[],"treatment":""},/,'')
          .replace(',{"user_ids":[],"treatment":""}','')
          .replace(/{"user_ids":[],"treatment":""},/,'')
          .replace(',{"user_ids":[],"treatment":""}','')
          .replace(/{"user_ids":[],"treatment":""},/,'')
          .replace(',{"user_ids":[],"treatment":""}','')
          .replace(/{"user_ids":[],"treatment":""},/,'')
          .replace(',{"user_ids":[],"treatment":""}','')


          .replace(',{"treatment":"","percentage":null}','')
          .replace(/{"treatment":"","percentage":null},/,'')
          .replace(',{"treatment":"","percentage":null}','')
          .replace(/{"treatment":"","percentage":null},/,'')
          .replace(',{"treatment":"","percentage":null}','')
          .replace(/{"treatment":"","percentage":null},/,'')
          .replace(',{"treatment":"","percentage":null}','')
          .replace(/{"treatment":"","percentage":null},/,'')
          .replace(',{"treatment":"","percentage":null}','')
          .replace(/{"treatment":"","percentage":null},/,'')
          .replace(',{"treatment":"","percentage":null}','')
          .replace(/{"treatment":"","percentage":null},/,'')
          .replace(',{"treatment":"","percentage":null}','')
          .replace(/{"treatment":"","percentage":null},/,'')
          .replace(',{"treatment":"","percentage":null}','')
          .replace(/{"treatment":"","percentage":null},/,'')

        //let a = this.abtest1.abtestCore.whitelists;
        //this.abtest1.abtestCore.whitelists = this.abtest1.abtestCore.whitelists.filter(x => !x.treatment.trim() && !x.user_ids.trim());

        // if (!this.abtest1.abtestCore.whitelists[1].user_ids.trim() && !this.abtest1.abtestCore.whitelists[1].treatment.trim()) {
        //   this.abtest1.abtestCore.whitelists = this.abtest1.abtestCore.whitelists.slice(0,1)
        // }


        formData.append('hbaseTablePut3', this.abtest1.hbaseTablePut3);
        formData.append('colFamilyPut3', this.abtest1.colFamilyPut3);
        formData.append('rowKeyPut3', this.abtest1.rowKeyPut3);
        formData.append('experiment_name', this.abtest1.abtestCore.experiment_name);
        formData.append('abtestData', abtestData);
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
