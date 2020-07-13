import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      // redirect: '/echarts'
      name: 'Home',
      component: () => import('@/views/China/China')
      // component: Home
    }
  ]
})
