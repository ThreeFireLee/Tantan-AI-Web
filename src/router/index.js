import Vue from 'vue'
import Router from 'vue-router'
import History from '../views/History.vue'
import ModelStage from '../views/ModelStage.vue'
import ABTest from './../views/ABTest.vue'
import ABTestProduct from './../views/ABTestProduct.vue'
import ModelProduct from './../views/ModelProduct.vue'
import SearchPage from './../views/SearchPage'
import ModelList from './../views/ModelList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name:'ModelStage',
      component: ModelStage
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
      path:'/modelproduct',
      name:'ModelProduct',
      component: ModelProduct
    }
  ]
})
