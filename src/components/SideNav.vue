<template>
  <el-aside width="280px">
    <el-menu
      router
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color=" #E4E7ED"
      >

      <!-- class="el-menu-vertical-demo"-->
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-star-on"></i>
          <span slot="title">Model</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/">Stage</el-menu-item>
          <el-menu-item index="/modelproduct">Production</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">A/B Testing</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/abtest">Stage</el-menu-item>
          <el-menu-item index="/abtestproduct">Production</el-menu-item>
          <!--<el-menu-item index="/searchpage">Search</el-menu-item>-->
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="/history">
        <template slot="title">
          <i class="el-icon-tickets"></i>
          <span slot="title">Experiments</span>
        </template>
      </el-menu-item>

    </el-menu>
  </el-aside>
</template>

<script>
    export default {
      name: "side-nav",
      methods: {
        handleOpen(key, keyPath) {
          console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
          console.log(key, keyPath);
        }
      }
    }
</script>

<style scoped>

</style>
