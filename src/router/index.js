import Vue from 'vue'
import Router from 'vue-router'

import History from '../views/History.vue'
import GoodList from './../views/GoodList.vue'

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
    }
  ]
})
