<template>
  <div>
    <nav-header></nav-header>
    <nav-bread-crumb>
      <span>AB Production Experiments</span>
    </nav-bread-crumb>
    <div class="accessory-result-page">
      <div>
        <div>
        </div>
        <div class="accessory-result">
          <side-nav></side-nav>

          <!-- main operation panel -->
          <!--<div class="accessory-list-wrap">-->
          <div>
            <el-input
              type="textarea"
              readonly="readonly"
              style="width: 900px; margin-bottom: 50px"
              :autosize="{ minRows: 18}"
              placeholder="AB Result"
              v-model="valueShow">
            </el-input>
            <br>
            <!--<el-button type="primary" @click="getAbHistory($event)">Scan</el-button>-->
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
  import NavHeader from './../components/NavHeader.vue'
  import SideNav from '../components/SideNav'
  import NavBreadCrumb from '@/components/NavBread'
  import './../assets/css/checkout.css'
  import axios from 'axios'



    export default{
      data() {
        return {
          valueShow: ''
        }
      },

      components: {
        NavHeader:NavHeader,
        SideNav:SideNav,
        NavBreadCrumb:NavBreadCrumb
      },
      mounted: function(){
        this.getAbHistory();
      },
      methods:{
        getAbHistory(){
          // event.preventDefault()
          axios.get("/historyScan/AbHistory").then(result =>{
            var res = result.data;
            if(res.status == "0"){
              let resultShow = res.result.hbaseRst;
              this.valueShow = resultShow;
            }
            else{
              this.$message.error('错误，无法获取A/B test 历史记录');
            }
          });
        }

      }

    }
</script>
