
import { getLineData } from '@/api/cesium'
import axios from 'axios'

const cesium = {
  state: {
    getInitCameraData: {}
  },

  mutations: {
    SET_INIT_CAMERA_HEIGHT: (state, val) => {
      console.log('SET_INIT_CAMERA_HEIGHT============================',val)
      state.getInitCameraData = val
    }
  },

  actions: {
    // 获取折线图片数据
    GetLineData({ commit }, data) {
      return new Promise((resolve, reject) => {
        getLineData(data).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 验证图片是否存在
    ValidateImg ({ commit }, data) {
      return new Promise((resolve, reject) => {
        axios.get(data)
          .then(() => {
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }

}

export default cesium
