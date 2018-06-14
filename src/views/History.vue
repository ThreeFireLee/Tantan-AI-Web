<template>
  <div>
    <nav-header></nav-header>
    <nav-bread-crumb>
      <span>AB Experiments</span>
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
            <!--工具条-->
            <div :span="22" class="toolbar">
              <el-form :inline="true" style="padding: 10px 0 0 20px">
                <el-form-item>
                  <el-input  placeholder="Type your row key here" v-model="rowKey" style="width: 300px" :disabled="false" prefix-icon="el-icon-search"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" v-on:click="getRst">查询</el-button>
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
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item >
                      <label style="font-weight: bolder">Experiment ID:     </label>
                      <span style="margin-right: 40px">{{ props.row.ex_id }}</span>
                      <label style="font-weight: bolder">Hash ID: </label>
                      <span>{{ props.row.hash_id }}</span>
                    </el-form-item>
                    <br>
                    <el-form-item>
                      <label style="font-weight: bolder">Content: </label>
                      <vue-json-pretty :path="'res'" :data="JSON.parse(props.row.content)" >
                      </vue-json-pretty>
                      <!--<tree-view :data="JSON.parse(props.row.content)" max-depth="2" style="width: 1000px"></tree-view>-->
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column
                sortable
                type="index"
                label="#"
                width="40">
              </el-table-column>
              <el-table-column
                prop="rowKey"
                label="Row Key"
                style="font-weight: bolder"
                width="290">
              </el-table-column>
              <el-table-column
                prop="name"
                label="Experiment Name"
                width="250">
              </el-table-column>
              <el-table-column
                prop="date"
                sortable
                label="Modified Date"
                width="220">
              </el-table-column>
              <el-table-column
                prop="operator_name"
                label="Operator"
                width="180">
              </el-table-column>

            </el-table>
            <br><br>

            <div class="block toolbar" >
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pagesize"
                style="padding: 15px 0 50px 550px"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.length">
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
  import './../assets/css/checkout.css'
  import NavHeader from './../components/NavHeader.vue'
  import SideNav from '../components/SideNav'
  import NavBreadCrumb from '@/components/NavBread'
  import axios from 'axios'
  import moment from 'moment'
  import VueJsonPretty from 'vue-json-pretty'



  export default{
    data() {
      return {
        tableData:[{
          date: '',
          ex_id:'',
          hash_id:'',
          operator_name:'',
          rowKey:'',
          name: '',
          content: ''
        }],
        loading:true,
        currentPage:1,
        pagesize:10,
        rowKey:''
      }
    },

    components: {
      NavHeader:NavHeader,
      SideNav:SideNav,
      NavBreadCrumb:NavBreadCrumb,
      VueJsonPretty
    },
    mounted: function(){
      this.getAbHistory();
    },
    methods:{
      handleSizeChange: function (size) {
        this.pagesize = size;
      },
      handleCurrentChange: function(currentPage){
        this.currentPage = currentPage;
      },



      getRst(){

        this.loading = true;
        axios.post("/historyScan/AbSearch",
          {
            rowKey:this.rowKey
          }

        ).then(result => {
          let res = result.data;
          if(res.status == "0"){
            let values = res.result.hbaseRst;
            var data = []
            for (let i = 0; i < values.length; i++){
              var obj = {}
              obj.rowKey = values[i].key;
              obj.date = moment(values[i].timestamp).format("YYYY-MM-DD HH:mm:ss");
              obj.content = values[i].$;
              let objDeal = JSON.parse(values[i].$);
              obj.operator_name = objDeal.operator_name;
              obj.name = objDeal.experiment_name;
              obj.ex_id = objDeal.experiment_id;
              obj.hash_id = objDeal.hash_id;
              data[i] = obj
            }
            this.tableData = data;
            this.loading = false;

          }
          else{
            this.$message.error('错误，无法获取A/B test 历史记录');
          }
        });

      },
      getAbHistory(){
        axios.get("/historyScan/AbHistory").then(result =>{
          var res = result.data;
          if(res.status == "0"){
            let values = res.result.hbaseRst;
            var data = []
            for (let i = 0; i < values.length; i++){
              var obj = {}
              obj.rowKey = values[i].key;
              obj.date = moment(values[i].timestamp).format("YYYY-MM-DD HH:mm:ss");
              obj.content = values[i].$;
              let objDeal = JSON.parse(values[i].$);
              obj.operator_name = objDeal.operator_name;
              obj.name = objDeal.experiment_name;
              obj.ex_id = objDeal.experiment_id;
              obj.hash_id = objDeal.hash_id;
              data[i] = obj
            }
            this.tableData = data;
            this.loading = false;

          }
          else{
            this.$message.error('错误，无法获取A/B test 历史记录');
          }
        });
      }

    }

  }
</script>
