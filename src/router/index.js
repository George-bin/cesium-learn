import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home/Home'
import EchartsDemo from '@/components/EchartsDemo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      // redirect: '/echarts'
      name: 'Home',
      component: Home
    },
    {
      path: '/echarts',
      name: 'echarts',
      component: EchartsDemo
    }
  ]
})
