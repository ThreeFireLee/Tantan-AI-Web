<template>
  <div>
    <nav-header></nav-header>
    <nav-bread-crumb>
      <span>A/B Comparison</span>
    </nav-bread-crumb>
    <div class="accessory-result-page">
      <div>
        <div>
        </div>
        <div class="accessory-result">
          <side-nav></side-nav>

          <!-- main operation panel -->
          <!--<div class="accessory-list-wrap">-->
          <div class="model-quarter-div">
            <el-form action="" class="demo-dynamic" method="post" enctype="multipart/form-data">
              <label>Key: </label>
              <el-input placeholder="row key" v-model="rowKey" style="width: 250px" clearable class="ab-serach-rowkey"></el-input>
              <el-button type="primary" style="margin-left: 20px;" @click="searchBoth($event)">Search</el-button>
              <br><br><br>
              <span style="font-weight: bolder;color: #000000;">Hbase:</span>
              <br><br><br>
                <vue-json-pretty :data="hbaseRst"></vue-json-pretty>
            </el-form>

            <br><br><br>
          </div>
          <div class="model-quarter-div">
            <div  style="margin-top: 86px">
            <span style="font-weight: bolder; color: #000000;">Redis:</span>
            </div>
            <br><br><br>
              <vue-json-pretty :data="redisRst"></vue-json-pretty>
            <br><br><br>
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
  import VueJsonPretty from 'vue-json-pretty'
  import axios from 'axios'



  export default{
    data() {
      return {
        dialogVisible: false,
        treatSeg:'',
        hbaseRst:'',
        redisRst:'',

        rowKey:'',
        hbaseTable:'treatment_store',
        colFamily:'f'
      }
    },

    components: {
      NavHeader:NavHeader,
      SideNav:SideNav,
      NavBreadCrumb:NavBreadCrumb,
      VueJsonPretty
    },
    methods:{
      /*

     make the comparison between data from redis and hbase

      */


    //   searchBoth(event){
    //     event.preventDefault();
    //
    //     axios.all([
    //       axios.post("/parser/hbaseABRetrieve",
    //         {
    //           rowKey:this.rowKey,
    //           hbaseTable: this.hbaseTable,
    //           colFamily: this.colFamily
    //         },
    //
    //       ),
    //       axios.post("/redisParserPro/redisABSearch",
    //         {
    //           rowKey:this.rowKey
    //         }
    //       )
    //     ]).then(axios.spread((hbaseRes, redisRes) =>{
    //   let res1 = hbaseRes.data;
    //   let res2 = redisRes.data;
    //   if(res1.status == 0) {
    //     let initialRst = res1.result.ABRst;
    //     this.hbaseRst = JSON.parse(initialRst);
    //
    //   }else{
    //     this.$message.error('注意，hbase内无此row key！');
    //     this.hbaseRst = "null";
    //   }
    //       if(res2.status == 0) {
    //         //content is the redis version json since it has one more key and version
    //         let initialRst = res2.result;
    //         initialRst = JSON.parse(initialRst);
    //         this.redisRst = initialRst.content;
    //
    //       }else{
    //         this.$message.error('注意，Redis内无此row key！');
    //         this.redisRst = "null";
    //       }
    //
    //
    // })).catch(function(){
    //       console.log('FAILURE!!');
    //     });;
    //   }

    }

  }
</script>

