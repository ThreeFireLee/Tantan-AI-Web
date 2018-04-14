<template>
  <header class="header">
    <symbol id="icon-cart" viewBox="0 0 38 32">
      <title>cart</title>
        </symbol>
    <div class="navbar">
      <div class="navbar-left-container">
        <a href="/">
          <img class="navbar-brand-logo" src="/static/valve.jpg"></a>
      </div>
      <div class="navbar-right-container" style="display: flex;">
        <div class="navbar-menu-container">
          <!--<a href="/" class="navbar-link">我的账户</a>-->
          <span class="navbar-link"></span>
          <a href="javascript:void(0)" class="navbar-link">Login</a>
          <a href="javascript:void(0)" class="navbar-link">Logout</a>
          <div class="navbar-cart-container">
            <span class="navbar-cart-count"></span>
            <a class="navbar-link navbar-cart-link" href="/#/cart">
              <a href="/">
                <img class="navbar-history-logo" src="/static/valve.jpg"></a>
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<!--<script>-->
    <!--export default {-->
        <!--name: "header"-->
    <!--}-->
<!--</script>-->
