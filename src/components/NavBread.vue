<template>

      <nav class="nav-breadcrumb" style="margin-left: 20px;">
        <a href="/">Home</a>
        <slot></slot>
      </nav>

</template>

<script>
    export default {
        name: "nav-bread-crum",
      data(){
        return {
          searchCriteria: '',
          breadcrumbItems: 'test'
        }
      },
    }
</script>

<style scoped>

</style>
