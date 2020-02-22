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
      path: '/introduction',
      name: 'Introduction',
      component: () => import('@/views/Introduction/Introduction')
    },
    {
      path: '/imageryProvider',
      name: 'ImageryProvider',
      component: () => import('@/views/ImageryProvider/ImageryProvider')
    },
    {
      path: '/terrian',
      name: 'Terrian',
      component: () => import('@/views/Terrian/Terrian')
    },
    {
      path: '/camera',
      name: 'Camera',
      component: () => import('@/views/Camera/Camera')
    },
    {
      path: '/gltf',
      name: 'Gltf',
      component: () => import('@/views/Gltf/Gltf')
    },
    {
      path: '/geometry',
      name: 'Geometry',
      component: () => import('@/views/Geometry/Geometry')
    },
    {
      path: '/echarts',
      name: 'echarts',
      component: EchartsDemo
    }
  ]
})
