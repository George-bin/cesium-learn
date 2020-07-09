import request from '@/utils/request'

export function getLineData(param) {
  return request({
    url: 'line',
    method: 'get',
    params: param
  })
}
export function generateImg(fileName) {
  return request({
    url: 'generateImg/'+fileName,
    method: 'get'
  })
}
