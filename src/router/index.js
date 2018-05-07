import Vue from 'vue'
import Router from 'vue-router'

import History from '../views/History.vue'
import GoodList from './../views/GoodList.vue'
import ABTest from './../views/ABTest.vue'
import CreateExp from './../views/ABTestCreate.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name:'GoodList',
      component: GoodList
    },
    {
      path:'/history',
      name:'History',
      component: History
    },
    {
      path:'/abtest',
      name:'ABTest',
      component: ABTest
    }
    // {
    //   path:'/abtest/createExp',
    //   name:'CreateExp',
    //   component: CreateExp
    // }
  ]
})
