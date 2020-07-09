// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
// 引入cesium样式文件
import * as Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
import '../static/css/iconfont/iconfont.css'
Vue.prototype.$Cesium = Cesium
window.Cesium = Cesium
// ion账户提供一个token去访问Bing影像底图
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmOWZmZWY1OS0zYTU1LTRmMGUtYjNiMy1mMWFlYzk3YTRkYzEiLCJpZCI6MTQ3MDgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjYyMDQyNDV9.tV8bTbhuvpVvblMieYm7KvRqUBFxEx-IHTCHMqynVi0"

// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 初始化css
import '../static/css/init.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
