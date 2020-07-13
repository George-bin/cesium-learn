'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://47.95.129.34:9002/dps"',
  _3D_ADDRESS: '"http://47.95.129.34:9002/3dview/3d.html"',
  // BASE_API: '"http://localhost/dps"',
  BASE_API: '"http://47.95.129.34:9005/dps"',
  NGINX_PATH: '"http://47.95.129.34:9005/file/git/imgDir/"',
  // NGINX_PATH: '"http://192.168.1.104/gis2/"',
  GIS_HOST: '""'
})
 
