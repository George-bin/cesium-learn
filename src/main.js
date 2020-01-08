// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入cesium样式文件
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
Vue.prototype.$Cesium = Cesium

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
  router,
  components: { App },
  template: '<App/>'
})
