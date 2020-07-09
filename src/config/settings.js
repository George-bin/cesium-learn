﻿/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 *
 */
const gis = {
  // host: 'gis/'// 编译环境
  host: '', // 开发环境
  nginxFilePath: 'http://192.168.1.102/gis2/'
  // nginxFilePath: 'http://localhost:9002/file/'
}

export { gis }