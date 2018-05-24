<template>
  <div class="nav-breadcrumb-wrap">
    <div class="container">
      <nav class="nav-breadcrumb">
        <a href="/">Home</a>
        <slot></slot>
      </nav>
    </div>

  </div>
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
