import Vue from 'vue'
import Router from 'vue-router'

import History from '../views/History.vue'
import GoodList from './../views/GoodList.vue'
import ABTest from './../views/ABTest.vue'
import ABTestProduct from './../views/ABTestProduct.vue'
import ModelProduct from './../views/ModelProduct.vue'
import SearchPage from './../views/SearchPage'
import ModelList from './../views/ModelList'
import ABComparison from './../views/ABComparison'


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
      path:'/searchpage',
      name:'SearchPage',
      component: SearchPage
    },
    {
      path:'/modellist',
      name:'ModelList',
      component:ModelList
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
      path:'/abcomparison',
      name:'ABComparison',
      component: ABComparison
    },
    {
      path:'/modelproduct',
      name:'ModelProduct',
      component: ModelProduct
    }
  ]
})
