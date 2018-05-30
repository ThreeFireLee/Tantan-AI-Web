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
          <div>
            <!--工具条-->
            <el-col :span="22" class="toolbar">
              <el-form :inline="true" :model="filters">
                <!--<el-form-item>-->
                  <!--<el-input  placeholder="Model Id"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item>-->
                  <!--<el-button type="primary" v-on:click="getUsers">查询</el-button>-->
                <!--</el-form-item>-->
                <!--<el-form-item>-->
                  <!--<el-button type="primary" @click="handleAdd">新增</el-button>-->
                <!--</el-form-item>-->
              </el-form>
            </el-col>
            <el-table
              :data="tableData"
              highlight-current-row
              border
              style="width: 100%;"
              :default-sort = "{prop: 'date', order: 'descending'}">
              <el-table-column
                sortable
                type="index"
                label="#"
                width="40">
              </el-table-column>
              <el-table-column
                sortable
                prop="date"
                label="Modified Date"
                width="180">
              </el-table-column>
              <el-table-column
                sortable
                prop="name"
                label="Model Id"
                width="460">
              </el-table-column>
              <el-table-column
                sortable
                prop="modelType"
                label="Model Type"
                width="290">
              </el-table-column>
            </el-table>
            <br><br>
            <!--<div class="block">-->
              <!--<span class="demonstration">完整功能</span>-->
              <!--<el-pagination-->
                <!--@size-change="handleSizeChange"-->
                <!--@current-change="handleCurrentChange"-->
                <!--:current-page="currentPage4"-->
                <!--:page-sizes="[100, 200, 300, 400]"-->
                <!--:page-size="100"-->
                <!--layout="total, sizes, prev, pager, next, jumper"-->
                <!--:total="400">-->
              <!--</el-pagination>-->
            <!--</div>-->
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
  import moment from 'moment'



  export default{
    data() {
      return {
        tableData:
          [{
          date: '',
          name: '',
          modelType: ''
        }]
      }
    },

    components: {
      NavHeader:NavHeader,
      SideNav:SideNav,
      NavBreadCrumb:NavBreadCrumb
    },
    mounted: function(){
      this.modelScan();
    },
    methods:{
      modelScan(){
        axios.get("/historyScan/modelScan"
        ).then(rst =>{

          var res = rst.data;
          if(res.status == 0) {

            let models = res.result.finalRst;
            let data = [];
            for (let i = 0; i < models.length; i++){
              let obj = {}
              obj.name= models[i].key;
              obj.date = moment(models[i].timestamp).format("YYYY-MM-DD HH:mm:ss");
              let objDeal = JSON.parse(models[i].$);
              obj.modelType= objDeal.modelType;
              data[i] = obj
            }


            this.tableData = data;

          }else{
            this.$message.error('错误，无此model id！');
          }

        });

      },

    }

  }
</script>
