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
      path: '/loadModel',
      name: 'LoadModel',
      component: () => import('@/views/LoadModel/LoadModel')
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
      path: '/3dModels',
      name: '3DModels',
      component: () => import('@/views/3DModels/3DModels')
    },
    {
      path: '/clock',
      name: 'Clock',
      component: () => import('@/views/Clock/Clock')
    },
    {
      path: '/selectionIndicator',
      name: 'SelectionIndicator',
      component: () => import('@/views/SelectionIndicator/SelectionIndicator')
    },
    {
      path: '/echarts',
      name: 'echarts',
      component: EchartsDemo
    }
  ]
})
