
import { getLineData } from '@/api/cesium'

const cesium = {
  state: {
    // token: getToken(),
    // name: '',
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
    }
  }

}

export default cesium
