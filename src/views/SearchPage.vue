<template>
  <div>
    <nav-header></nav-header>
    <nav-bread-crumb>
      <span>A/B Testing Search</span>
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
            <el-form action="" class="demo-dynamic" method="post" enctype="multipart/form-data">
              <lable for="hbaseTablePut4">Table Name:  </lable>
              <el-input
                placeholder="Default value here"
                v-model="hbaseTablePut4"
                :disabled="true"
                style="width:250px"
                class="table-name-css">
              </el-input>
              <br>
              <lable for="colFamilyPut4">Column Family:</lable>
              <el-input
                placeholder="Default value here"
                v-model="colFamilyPut4"
                :disabled="true"
                style="width:250px"
                class="col-family-css">
              </el-input>
              <br>
            <label>Row Key: </label>
            <el-input placeholder="row key" v-model="rowKeyPut4" style="width: 250px" clearable class="ab-serach-rowkey"></el-input>
            <br>
            <label>User Id: </label>
            <el-input placeholder="user id" v-model="searchUserId" style="width: 250px; margin-left: 59px" clearable></el-input>
            <br>
            <el-button type="primary" style="margin: 20px 0 0 150px" @click="onRetrieveUserId($event)">Search Id</el-button>
            <br><br><br><br><br><br> <br><br><br><br><br><br> <br><br><br><br><br>
            </el-form>

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
        rowKeyPut4:'',
        searchUserId:'',
        hbaseTablePut4:'treatment_store',
        colFamilyPut4:'f'
      }
    },

    components: {
      NavHeader:NavHeader,
      SideNav:SideNav,
      NavBreadCrumb:NavBreadCrumb
    },
    methods:{

      //retrieve with user id
      onRetrieveUserId(event){
        event.preventDefault();
        if(this.rowKeyPut4 == ""){
          this.$message({
            showClose: true,
            message: '警告,row key不能为空！',
            type: 'warning'
          });
          return false;
        }
        if(this.searchUserId == ""){
          this.$message({
            showClose: true,
            message: '警告,user id不能为空！',
            type: 'warning'
          });
          return false;
        }

        axios.post("/historyScan/ABTestUserId",
          {
            rowKey:this.rowKeyPut4,
            hbaseTable: this.hbaseTablePut4,
            colFamily: this.colFamilyPut4,
            searchUserId: this.searchUserId
          },

        ).then(rst =>{
          var res = rst.data;
          if(res.status == 0) {
            const h = this.$createElement;
            this.$msgbox({
              title: 'Treatment Section',
              message: h('p', null, [
                h('span', null, 'Treatment: '),
                h('i', { style: 'color: teal' }, res.result.treatment_el),
              ]),
              confirmButtonText: '确定'
            })
          }else if(res.status == 1) {
            this.$message.error('错误，无此row key！');
          }else{
            this.$message.error('错误，无此user id！');
          }
        });

      }
    }

  }
</script>
