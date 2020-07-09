import axios from 'axios'
import { Message } from 'element-ui'
import router from '../router'

// 创建axios实例
const service = axios.create({
  // api的base_url
  baseURL: process.env.BASE_API,
  // 请求超时时间
  timeout: 60000,
  // 允许携带cookie
  withCredentials: false
})
// request拦截器
service.interceptors.request.use(config => {
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    let { errcode } = response.data
    let hash = location.hash
    switch (errcode) {
      case 991:
        if (hash !== '#/login') {
          Message({
            type: 'warning',
            message: '用户登录态失效!'
          })
        }
        sessionStorage.removeItem('auth')
        router.push('/login')
        break
      default:
    }
    return response
  },
  error => {
    return Promise.reject(error)
  })

export default service
