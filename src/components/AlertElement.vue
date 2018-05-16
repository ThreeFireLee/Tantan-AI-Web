<template>
  <div id="alert-content">
  <el-alert
    title="错误提示的文案"
    type="error"
    center
    show-icon
    style="width: 700px; margin-left: 70px"
    v-if="visible">
  </el-alert>
  </div>
</template>

<script>
    export default {
        name: "alert-element"
    }
</script>

<style scoped>

</style>
