<template>
  <div>
    <nav-header></nav-header>
    <nav-bread-crumb>
      <span>Model List</span>
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
            <div :span="22" class="toolbar">
              <el-form :inline="true" style="padding: 10px 0 0 20px">
                <el-form-item>
                  <el-input  placeholder="Model Id" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" v-on:click="getUsers">查询</el-button>
                </el-form-item>
                <!--<el-form-item>-->
                  <!--<el-button type="primary" @click="handleAdd">新增</el-button>-->
                <!--</el-form-item>-->
              </el-form>
            </div>
            <el-table
              :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
              highlight-current-row
              stripe
              border
              v-loading="loading"
              style="width: 100%; "
              :default-sort = "{prop: 'date', order: 'descending'}">
              <el-table-column
                sortable
                type="index"
                label="#"
                width="40">
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
              <el-table-column
                sortable
                prop="date"
                label="Modified Date"
                width="180">
              </el-table-column>
            </el-table>
            <br>
            <div class="block toolbar">

              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="100"
                style="padding: 15px 0 0 470px;"
                layout="prev, pager, next, jumper"
                :total="1000">
              </el-pagination>
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
        }],
        currentPage:1,
        pagesize:10
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
      handleSizeChange: function (size) {
        this.pagesize = size;
      },
      handleCurrentChange: function(currentPage){
        this.currentPage = currentPage;
      },
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
