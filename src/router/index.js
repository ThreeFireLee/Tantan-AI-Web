import Vue from 'vue'
import Router from 'vue-router'

import History from '../views/History.vue'
import GoodList from './../views/GoodList.vue'
import ABTest from './../views/ABTest.vue'
import ABTestProduct from './../views/ABTestProduct.vue'
import ModelProduct from './../views/ModelProduct.vue'

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
    },
    {
      path:'/abtestproduct',
      name:'ABTestProduct',
      component: ABTestProduct
    },
    {
      path:'/modelproduct',
      name:'ModelProduct',
      component: ModelProduct
    }

    // {
    //   path:'/abtest/createExp',
    //   name:'CreateExp',
    //   component: CreateExp
    // }
  ]
})
