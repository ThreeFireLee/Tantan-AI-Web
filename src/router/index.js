import Vue from 'vue'
import Router from 'vue-router'

import History from '../views/History.vue'
import GoodList from './../views/GoodList.vue'
import ABTest from './../views/ABTest.vue'
import ABTestProduct from './../views/ABTestProduct.vue'
import ModelProduct from './../views/ModelProduct.vue'
import SearchPage from './../views/SearchPage'
import ModelList from './../views/ModelList'


import Test1 from '../../static/configure/l2/dark-canary/config'
import Test2 from '../../static/configure/l2/dev/config'
import Test3 from '../../static/configure/l2/prod/config'
import Test4 from '../../static/configure/l2/staging/config'
import Test5 from '../../static/configure/ranker/dark-canary/config'
import Test6 from '../../static/configure/ranker/dev/config'
import Test7 from '../../static/configure/ranker/prod/config'
import Test8 from '../../static/configure/ranker/staging/config'

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
      path:'/modelproduct',
      name:'ModelProduct',
      component: ModelProduct
    },



    {
      path:'/configure/l2/dark-canary/config',
      name:'Test1',
      component: Test1
    },
    {
      path:'/configure/l2/dev/config',
      name:'Test2',
      component: Test2
    },
    {
      path:'/configure/l2/prod/config',
      name:'Test3',
      component: Test3
    },
    {
      path:'/configure/l2/staging/config',
      name:'Test4',
      component: Test4
    },
    {
      path:'/configure/ranker/dark-canary/config',
      name:'Test5',
      component: Test5
    },
    {
      path:'/configure/ranker/dev/config',
      name:'Test6',
      component: Test6
    },
    {
      path:'/configure/ranker/prod/config',
      name:'Test7',
      component: Test7
    },
    {
      path:'/configure/ranker/staging/config',
      name:'Test8',
      component: Test8
    }
  ]
})
