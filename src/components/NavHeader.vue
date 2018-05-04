<template>
  <header class="header">
    <symbol id="icon-cart" viewBox="0 0 38 32">
      <title>cart</title>
        </symbol>
    <div class="navbar">
      <div class="navbar-left-container">
        <a href="/">
          <!--<img class="navbar-brand-logo" src="/static/valve.jpg">-->
          <h2><p></p>TanTan AI</h2>
          </a>
      </div>
      <div class="navbar-right-container" style="display: flex;">
        <div class="navbar-menu-container">
          <!--<a href="/" class="navbar-link">我的账户</a>-->
          <span class="navbar-link"></span>
          <!--<a href="javascript:;" class="navbar-link" @click="loginModalFlag=true">Login</a>-->
          <!--<a href="javascript:void(0)" class="navbar-link">Logout</a>-->

            <span class="navbar-cart-count"></span>
            <a class="navbar-link navbar-cart-link" href="/#/history">
              <!--<a href="/#/history">-->
                <!--<a class="navbar-link">History</a>-->
            <!--</a>-->
            </a>

        </div>
      </div>
    </div>
    <div class="md-modal modal-msg md-modal-transition"  v-bind:class="{'md-show':loginModalFlag}">
      <div class="md-modal-inner">
        <div class="md-top">
          <div class="md-title">Login in</div>
          <button class="md-close" @click="loginModalFlag=false">Close</button>
        </div>
        <div class="md-content">
          <div class="confirm-tips">
            <div class="error-wrap">
              <span class="error error-show" v-show="errorTip">用户名或者密码错误</span>
            </div>
            <ul>
              <li class="regi_form_input">
                <i class="icon IconPeople"></i>
                <input type="text" tabindex="1" name="loginname" v-model="userName" class="regi_login_input regi_login_input_left" placeholder="User Name" data-type="loginname">
              </li>
              <li class="regi_form_input noMargin">
                <i class="icon IconPwd"></i>
                <input type="password" tabindex="2"  name="password" v-model="userPwd" class="regi_login_input regi_login_input_left login-input-no input_text" placeholder="Password" @keyup.enter="login">
              </li>
            </ul>
          </div>
          <div class="login-wrap">
            <a href="javascript:;" class="btn-login" @click="login">登  录</a>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-if="loginModalFlag" @click="loginModalFlag=false"></div>
  </header>
</template>

<script>
    import './../assets/css/login.css'
    import axios from 'axios'
    export default {
       data(){
         return{
           userName:'',
           userPwd:'',
           errorTip:false,
           loginModalFlag:false
         }
       },
      methods:{
        login(){
          if(!this.userName || !this.userPwd){
            this.errorTip = true;
            return;
          }
          axios.post("/users/login",{
            userName:this.userName,
            userPwd:this.userPwd
          }).then((response)=>{
            let res = response.data;
            if(res.status=="0"){
              this.errorTip = false;
              this.loginModalFlag = false;
              this.$store.commit("updateUserInfo",res.result.userName);
              this.getCartCount();
            }else{
              this.errorTip = true;
            }
          });
        }
      }
    }
</script>
