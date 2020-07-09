<template>
  <div :style="{ height: screenHeight + 'px' }" class="china-2d-component">
    <div id="china" />
    <!-- 收集侧边栏icon -->
    <div v-if="isMobile" class="mobile-aside-swict" @click="handleClickMobileAside(true)">
      <i class="el-icon-s-unfold"></i>
    </div>
    <!-- 导航栏 -->
    <div
      class="toolbars-section"
      :class="{
        'toolbars-section-mobile': isMobile && openMobileAside
      }"
      @click="handleClickMobileAside(false)">
      <div class="toolbars-section-box" @click.stop="">
        <!--获取指定时间的数据-->
        <div class="toolbars-item">
          <h3 class="toolbars-item-title">选择指定时间的数据</h3>
          <div style="margin-top: 5px">
            <el-date-picker
              v-model="selectedData"
              :picker-options="startDateChecked"
              :clearable="true"
              :editable="true"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              style="width:130px;"
              size="small"
              type="date"
              placeholder="选择日期"
              @change="selectedDataChange"
            /><br>
            <el-time-select
              v-model="selectedTime"
              :picker-options="{
                start: '00:00',
                step: '00:10',
                end: '23:50',
              }"
              style="width:130px; margin-top: 5px"
              size="small"
              placeholder="选择时间"
              @change="selectedDataChange"
            />
          </div>
        </div>
        <!--切换地图背景-->
        <div class="toolbars-item">
          <h3 class="toolbars-item-title">地图模式切换</h3>
          <div class="toolbars-item-content">
            <div class="son-item">
              <div class="content" @click="exitTwoDimension">
                <span title="白天" @click="handleSwitchMap('white')">
                  <i
                    :style="{color: mapModel === 'white' ? '#ffc633' : 'white'}"
                    class="iconfont icon-baitian-qing"
                  />
                </span>
                <span title="夜间" @click="handleSwitchMap('night')">
                  <i
                    :style="{color: mapModel === 'night' ? '#ffc633': 'white'}"
                    class="iconfont icon-wanshang-qing"
                  />
                </span>
                <span title="卫星" @click="handleSwitchMap('weixing')">
                  <i :style="{color: mapModel === 'weixing' ? '#ffc633' : 'white'}" class="iconfont icon-weixing" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <!--辅助背景云图-->
        <!-- @click="exitTwoDimension" -->
        <div class="auxiliary-line-section toolbars-item">
          <h3 class="toolbars-item-title">气象数据</h3>
          <div class="toolbars-item-content">
            <div class="son-item">
              <div class="content">
                <span title="经纬度" @click="handleSwitchCloudChart('grid')">
                  <i
                    :style="{color: useBaseMap === 'grid' ? '#ffc633' : 'white'}"
                    class="iconfont icon-wanggediqiu"
                  />
                </span>
                <span title="无经纬度" @click="handleSwitchCloudChart('noGrid')">
                  <i
                    :style="{color: useBaseMap === 'noGrid' ? '#ffc633' : 'white'}"
                    class="iconfont icon-iconset0403"
                  />
                </span>
                <span title="隐藏图层" @click="hiddenImage()">
                  <i
                    :style="{color: !useBaseMap ? '#ffc633' : 'white'}"
                    class="iconfont icon-dituleiwanggequ"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
        <!--二维分析-->
        <div class="toolbars-item two-dimension">
          <h2 class="toolbars-item-title">二维气象分析</h2>
          <div class="toolbars-item-content">
            <!--绘制坐标系-->
            <div class="draw-section son-item">
              <div class="content">
                <span title="绘制十字" @click="handleDrawCoordinateSystem">
                  <i
                    :style="{color: isDrawCoordinateSystem ? '#ffc633' : 'white'}"
                    class="iconfont icon-jiaochacross19"
                  />
                </span>
                <span title="开始动画" @click="playRealtimeViewModel">
                  <i
                    :style="{
                      color: animationStatus === 'starting' ? '#ffc633' : 'white',
                      cursor: coordinateSystemDatasource && !this.isLocalAnalysis ? 'pointer' : 'no-drop'
                    }"
                    class="iconfont icon-kaishi"
                  />
                </span>
                <span title="暂停动画" @click="stopRealtimeViewModel">
                  <i
                    :style="{
                      color: animationStatus === 'stop' ? '#ffc633' : 'white',
                      cursor: coordinateSystemDatasource && !this.isLocalAnalysis ? 'pointer' : 'no-drop'
                    }"
                    class="iconfont icon-zanting"
                  />
                </span>
                <span title="重新播放" @click="restRealtimeViewModel">
                  <i
                    :style="{
                      cursor: coordinateSystemDatasource && !this.isLocalAnalysis ? 'pointer' : 'no-drop'
                    }"
                    class="iconfont icon-zhongbo"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
        <!--三维分析-->
        <div class="toolbars-item three-dimension">
          <h2 class="toolbars-item-title">三维气象分析</h2>
          <div class="toolbars-item-content">
            <!--绘制坐标系-->
            <div class="draw-section son-item">
              <div class="content">
                <span title="绘制三维" @click="handleDraw3DCoordinateSystem">
                  <i
                    :style="{color: isDraw3DCoordinateSystem ? '#ffc633' : 'white'}"
                    class="iconfont icon-duocengjiegou"
                  />
                </span>
                <span title="显示/隐藏立体层" @click="handleToggleShow">
                  <i
                    :style="{
                      color: isShowCoverage ? '#ffc633' : 'white',
                      cursor: d3CoordinateSystemDatasource && !isLocalAnalysis ? 'pointer' : 'no-drop'
                    }"
                    class="iconfont icon-yincangshijuangailan"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
        <!--切面分析-->
        <div v-if="!isMobile" class="clude-section toolbars-item">
          <h3 class="toolbars-item-title">切面分析</h3>
          <div class="toolbars-item-content">
            <div class="son-item">
              <div class="content">
                <span title="绘制切面" @click="handleCutoutPolygon">
                  <i
                    :style="{color: isCutout ? '#ffc633' : 'white'}"
                    class="iconfont icon-icon-test"
                  />
                </span>
                <span title="删除切面" @click="handleDeleteentitly">
                  <i
                    :style="{
                      color: activeEntityCollection ? '#ffc633' : 'white',
                      cursor: activeEntityCollection ? 'pointer' : 'no-drop'
                    }"
                    class="iconfont icon-iconfontshanchu"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
        <!--移动云图-->
        <div class="clude-section toolbars-item">
          <h3 class="toolbars-item-title">移动云图</h3>
          <div class="toolbars-item-content">
            <div class="son-item">
              <div class="content">
                <span title="移动云图" @click="handleClickMoveImage">
                  <i
                    :style="{color: activeModule === 'moveCloud' ? '#ffc633' : 'white'}"
                    class="iconfont icon-yun"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
        <!--多层立体-->
        <div class="clude-section toolbars-item">
          <h3 class="toolbars-item-title">3D模型</h3>
          <div class="toolbars-item-content">
            <div class="son-item">
              <div class="content">
                <span title="3D展示" @click="handleGo3D">
                  <i class="iconfont icon-D" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 用于裁切canvas -->
    <div id="canvas-package" />
    <!-- 存放热力图 -->
    <div v-show="false" id="heatmap" />
    <div v-if="!isMobile" class="color-line-img">
      <img src="../../../static/img/color-line.png" style="width: 300px; height: 50px;" >
    </div>
    <!--鼠标在地球上的实时坐标-->
    <div v-if="realTimeCoordinates.lng" class="real-time-coordinates">
      <p>经度: {{ realTimeCoordinates.lng.toFixed(2) }}<br>纬度: {{ realTimeCoordinates.lat.toFixed(2) }}</p>
    </div>
  </div>
</template>

<script>

// import * as Cesium from 'Cesium'
// import 'cesium/Widgets/widgets.css'
import { removeMoveImage, drawMoveImage, moveImage } from '@/utils/moveImage'
import { removeLevel, showLevel, drawImageLevel } from '@/utils/imageLevel'
import { gis } from '@/config/'
import { mapState, mapActions, mapMutations } from 'vuex'

window.viewer = null
export default {
  components: {
    twoDimension: () => import('@/components/twoDimension')
  },
  data() {
    return {
      openMobileAside: false,
      selectedTime: '',
      selectedData: '',
      dataTime: '',
      // 当前功能模块
      activeModule: 'twoDimension',
      initViewerComplete: false,
      screenHeight: '',
      // ngint: 黑色、white: 白色、weixing: 卫星
      mapModel: 'night',
      mapType:
        'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
      // mapType: 'http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}',
      point1: '116.06,39.42',
      point2: '116.96,40.42',
      // 纵向面板
      lengthwaysPolygon: {
        a: { lng: 116.06, lat: 39.42 },
        b: { lng: 116.06, lat: 40.42 }
      },
      // 横向面板
      crosswisePolygon: {
        a: { lng: 116.06, lat: 40.42 },
        b: { lng: 116.96, lat: 40.42 }
      },
      // 坐标轴范围
      coordinateSystemScope: {
        a: {},
        b: {}
      },
      // 坐标系datasource
      coordinateSystemDatasource: null,
      // 三维分析坐标系datasource
      d3CoordinateSystemDatasource: null,
      // 动画面板
      animationPolygonDatasource: null,
      // 执行时间
      executeSeconds: 0,
      // stop: 停止 starting: 播放中
      animationStatus: '',
      timer: null,
      // 经度步长
      lngSpeed: 0,
      // 纬度步长
      latSpeed: 0,
      // 当前纵向面板坐标
      activeLengthwaysCoor: [],
      // 当前横向面板坐标
      activeCrosswiseCoor: [],
      // 绘制鼠标事件对象
      mouseDrawEventHandler: null,
      // 鼠标事件对象
      mouseEventHandler: null,
      // 是否截取剖面
      isCutout: false,
      // 是否绘制坐标系
      isDrawCoordinateSystem: false,
      // 是否三维绘制坐标系
      isDraw3DCoordinateSystem: false,
      // 截取的坐标
      cutoutPosition: [],
      cutoutPolygonDatasource: null,
      // 当前选定实体集合
      activeEntityCollection: null,
      // 实时坐标
      realTimeCoordinates: {
        lng: '',
        lat: '',
        alt: ''
      },
      // canvas中的图片地址
      canvasImgSrc: '',
      fullTimer: false,
      showImage: false,
      isShowCoverage: false,
      intervalInfo: '',
      // 白天模式
      daytimeMode: false,
      // 加载云图
      useBaseMap: 'noGrid',
      // 移动云图
      isMoveCloud: false,
      // 局部分析
      isLocalAnalysis: false,
      currentCenterHeight: null,
      currentCenterLat: null,
      currentCenterLng: null,
      initCameraData: {},
      recordCamera: false,
      startDateChecked: this.beginDate()
    }
  },
  computed: {
    ...mapState({
      isMobile: state => state.share.isMobile
    }),
    getInitCameraData() {
      // 获取store中的数据
      return this.$store.state.cesium.getInitCameraData
    }
  },
  watch: {
    screenHeight(val) {
      // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
      if (!this.fullTimer) {
        // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
        this.screenHeight = val
        this.fullTimer = true
        const that = this
        setTimeout(function() {
          // 打印screenWidth变化的值
          // console.log(that.screenHeight)
          that.fullTimer = false
        }, 400)
      }
    }
  },
  created() {
    // eslint-disable-next-line no-undef
    viewer = null
  },
  mounted() {
    this.init()
    this.SET_INIT_CAMERA_HEIGHT(null)
    this.initViewerComplete = true
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight
        that.screenHeight = window.screenHeight
      })()
    }
    this.onMouseEvent()

    // setInterval(() => {
    //     console.log(viewer.camera)
    // }, 1000)
    if (this.isMobile) {
      $('.cesium-viewer-geocoderContainer')
        .css({ display: 'none' })
    }
  },
  methods: {
    ...mapActions(["GetLineData"]),
    ...mapMutations(["SET_INIT_CAMERA_HEIGHT"]),
    /**
     * 打开移动端侧边栏
     */
    handleClickMobileAside (boolean) {
      this.openMobileAside = boolean
    },
    selectedDataChange() {
      if (this.selectedData && this.selectedTime) {
        this.dataTime =
          this.selectedData.replace(/-/g, '') + '_' + this.selectedTime.replace(':', '') + '00'
        sessionStorage.setItem('dataTime', this.dataTime)
        sessionStorage.setItem('selectedData', this.selectedData)
        sessionStorage.setItem('selectedTime', this.selectedTime)
        location.reload()
      } else {
        this.dataTime = ''
      }
      console.log('selectedDataChange===========', this.dataTime)
    },
    beginDate() {
      // 提出开始时间必须小于今天
      // const self = this
      return {
        disabledDate(time) {
          const date = new Date()
          return time.getTime() > date.getTime() - 24 * 60 * 60 // 开始时间不选时，结束时间最大值小于等于当天
        }
      }
    },
    // 隐藏全国云图
    handleHideBaseMap() {
      this.hiddenImage()
    },
    // 选择二维分析图
    handleSwitchTwoDimension() {
      this.activeModule = 'twoDimension'
      // eslint-disable-next-line no-undef
      viewer.dataSources.removeAll()
      this.animationStatus = ''
      this.isDrawCoordinateSystem = false
      this.isLocalAnalysis = false
      this.isShowCoverage = false
      this.isCutout = false
      this.coordinateSystemDatasource = null
      this.activeEntityCollection = null
      // eslint-disable-next-line no-undef
      removeLevel(viewer, this.showImage)
      // eslint-disable-next-line no-undef
      removeMoveImage(viewer)
    },
    // 3D展示
    handleGo3D() {
      window.open(process.env._3D_ADDRESS)
      // window.open('http://localhost/cesium+three/3d.html')
      // this.$router.push('/china3d')
    },
    // 退出二维分析
    exitTwoDimension() {
      this.$refs.twoDimension.$emit('handleCancelDraw')
      // eslint-disable-next-line no-undef
      viewer.dataSources.removeAll()
      this.animationStatus = ''
      this.isDrawCoordinateSystem = false
      this.isLocalAnalysis = false
      this.isShowCoverage = false
      this.isCutout = false
      this.coordinateSystemDatasource = null
      this.activeEntityCollection = null
      // eslint-disable-next-line no-undef
      removeLevel(viewer, this.showImage)
      // eslint-disable-next-line no-undef
      removeMoveImage(viewer)
    },
    hiddenImage() {
      this.useBaseMap = ''
      /* eslint-disable */
      const chinaGridEntity = viewer.entities.getById('chinaGrid')
      const china = viewer.entities.getById('china')
      /* eslint-enable */
      chinaGridEntity.show = false
      china.show = false
    },
    // 显示立体图层
    showLevelInfo() {
      this.activeModule = '3DCloud'
      this.hiddenImage()
      this.exitTwoDimension()
      /* eslint-disable */
      removeMoveImage(viewer)
      showLevel(viewer)
      if (viewer.entities.getById(`3d-map-0`)) {
        showLevel(viewer)
      } else {
        for (let i = 0; i <= 19; i++) {
          setTimeout(() => {
            drawImageLevel(viewer, i)
          }, 1000 * i)
        }
      }
      /* eslint-enable */
    },
    handleSwitchCloudChart(type) {
      // if(this.dataTime===""){
      //   this.$message.warning("请选择指定时间的数据")
      //   return;
      // }
      if (this.useBaseMap === type) return
      this.useBaseMap = type
      /* eslint-disable */
      const chinaGridEntity = viewer.entities.getById('chinaGrid')
      const china = viewer.entities.getById('china')
      /* eslint-enable */
      // viewer.entities.remove(chinaGridEntity)
      // viewer.entities.remove(china)
      if (type === 'grid') {
        // 全国地图带网格
        chinaGridEntity.show = true
        china.show = false
      } else {
        // 全国地图不带网格
        chinaGridEntity.show = false
        china.show = true
      }
    },
    setTooltip() {
      /* eslint-disable */
      viewer.homeButton.viewModel.tooltip = '初始位置'
      viewer.fullscreenButton.viewModel.tooltip = '全屏显示'
      /* eslint-enable */
    },
    // 切换白天和黑夜地图
    handleSwitchMap(type) {
      this.mapModel = type
      switch (type) {
        case 'white':
          this.mapType = 'http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
          break
        case 'night':
          this.mapType = 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
          break
        default:
          this.mapType = 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'
      }
      // 删除默认的影像图层
      // eslint-disable-next-line no-undef
      viewer.imageryLayers.remove(viewer.imageryLayers.get(0))
      // 增加影像底图
      // eslint-disable-next-line no-undef
      viewer.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          url: this.mapType
          // layer: 'tdtVecBasicLayer',
          // format: 'image/jpeg',
          // tileMatrixSetID: 'GoogleMapsCompatible',
          // show: false,
          // maximumLevel: 13,
          // minimumLevel: 3
          // tilingScheme: new Cesium.WebMercatorTilingScheme()
        })
      )
      // viewer.terrainProvider = Cesium.createWorldTerrain()
      // viewer.scene.globe.enableLighting = true
    },
    init() {
      // home定位到中国范围
      // Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(40, 22, 70, 50)

      // 设置静态资源目录
      // buildModuleUrl.setBaseUrl('../../../static/Cesium/')
      // Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiZGI5MmJjZS05N2VhLTQ4MTEtYmU5Ni1iNDRkMGRlZmVjMzkiLCJpZCI6MTg4NDIsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzQ0OTg3Mjl9.o6NVGjAHEOP5oyqTldLeaXf-pwPelcwNniBf8ZsxBow';
      // 单击显示点位坐标信息
      const that = this
      // eslint-disable-next-line no-undef
      viewer = new Cesium.Viewer('china', {
        infoBox: false,
        shouldAnimate: false, // 让场景中的动画自动播放
        navigationHelpButton: false, // 是否显示帮助信息控件
        animation: false, // 不创建动画控件
        scene3DOnly: true, // 每个几何实例仅以3D渲染以节省GPU内存
        timeline: false, // 不创建时间线控件
        sceneModePicker: false,
        baseLayerPicker: false,
        // fullscreenButton: true, // 是否显示全屏按钮
        // imageryProvider : Cesium.createOpenStreetMapImageryProvider({url : this.mapType}),
        imageryProvider: new Cesium.UrlTemplateImageryProvider({
          url: this.mapType
        })
      })

      // 去除版权信息
      // eslint-disable-next-line no-undef
      viewer._cesiumWidget._creditContainer.style.display = 'none'
      // 禁止相机地形穿透
      this.cameraStop()
      // this._local = new CesiumLocal(viewer)
      // this.setTooltip()
      /* 三维球转动添加监听事件 */
      // eslint-disable-next-line no-undef
      viewer.camera.changed.addEventListener(function(percentage) {
        const currentPosition = that.getCenterPosition()
        // 打印中心点坐标、高度、当前范围坐标
        that.currentCenterHeight = currentPosition.height
        that.currentCenterLat = currentPosition.lat
        that.currentCenterLng = currentPosition.lon

        // console.log("当前中心点坐标高度======", currentPosition.height);
        // console.log("当前中心点坐标经纬度======", currentPosition.lat, "   ", currentPosition.lon);
      })
      /* eslint-disable */
      // 初始化的时候获取数据日期
      this.dataTime = sessionStorage.getItem('dataTime')
      this.selectedData = sessionStorage.getItem('selectedData')
      this.selectedTime = sessionStorage.getItem('selectedTime')
      let imgBaseUrl = this.isMobile ?  gis.nginxFilePath + this.dataTime + '/mobile' :  gis.nginxFilePath + this.dataTime + '/pc'
      console.log(gis.nginxFilePath + this.dataTime + '/grid.png')
      if (this.dataTime) {
        // 全国-带网格
        viewer.entities.add({
          id: 'chinaGrid',
          show: false,
          rectangle: {
            coordinates: Cesium.Rectangle.fromDegrees(73, 12.2, 135, 54.2),
            height: 0,
            material: new Cesium.ImageMaterialProperty({
              image: imgBaseUrl + '/grid.png',
              transparent: true // 是否透明
            })
          }
        })
        // 全国-不带网格
        viewer.entities.add({
          id: 'china',
          show: true,
          rectangle: {
            coordinates: Cesium.Rectangle.fromDegrees(73, 12.2, 135, 54.2),
            height: 0,
            material: new Cesium.ImageMaterialProperty({
              image: imgBaseUrl + '/z.png',
              transparent: true, // 是否透明
              // color: Cesium.Color.ALICEBLUE.withAlpha(0)
            })
          }
        })
      }
      /* eslint-enable */

      // 绘制移动云图
      // setTimeout(() => {
      //   drawMoveImage(viewer)
      //   // 绘制多层云图
      //   // for (let i = 0; i <= 20; i++) {
      //   //   drawImageLevel(viewer, i)
      //   // }
      // }, 5000)
      // eslint-disable-next-line no-undef
      viewer.clock.onStop.addEventListener(clock => {
        if (process.env.NODE_ENV === 'development') console.log('动画停止啦')
        clearInterval(this.timer)
      })

      // 点击home键进行跳转
      // eslint-disable-next-line no-undef
      viewer.homeButton.viewModel.command.beforeExecute.addEventListener(
        function(e) {
          e.cancel = true
          // 你要飞的位置
          that.flytoPosition()
        }
      )

      setTimeout(() => {
        that.flytoPosition()
      }, 2000)
    },
    /* 获取camera高度  */
    getCameraHeight() {
      /* eslint-disable */
      if (viewer) {
        var scene = viewer.scene
        var ellipsoid = scene.globe.ellipsoid
        var height = ellipsoid.cartesianToCartographic(viewer.camera.position)
          .height
        return height
      }
      /* eslint-enable */
    },
    /**
     * 获取camera中心点坐标
     */
    getCenterPosition() {
      /* eslint-disable */
      var result = viewer.camera.pickEllipsoid(
        new Cesium.Cartesian2(
          viewer.canvas.clientWidth / 2,
          viewer.canvas.clientHeight / 2
        )
      )
      /* eslint-enable */
      var curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(result)
      var lon = (curPosition.longitude * 180) / Math.PI
      var lat = (curPosition.latitude * 180) / Math.PI
      var height = this.getCameraHeight()
      return {
        lon: lon,
        lat: lat,
        height: height
      }
    },
    ajustHeight(tileset) {
      // tileset调整高度
      var heightOffset = 200000
      var boundingSphere = tileset.boundingSphere
      var cartographic = Cesium.Cartographic.fromCartesian(
        boundingSphere.center
      )
      var surface = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        0.0
      )
      var offset = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        heightOffset
      )
      var translation = Cesium.Cartesian3.subtract(
        offset,
        surface,
        new Cesium.Cartesian3()
      )
      tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
    },

    flytoPosition() {
      var rectangle = Cesium.Rectangle.fromDegrees(73, 12.2, 135, 54.2)
      // 你要飞的位置
      // eslint-disable-next-line no-undef
      viewer.camera.flyTo({
        destination: rectangle,
        orientation: {
          heading: 25, // 方向
          pitch: Cesium.Math.toRadians(-89.91), // 倾斜角度
          roll: 0
        }
      })
    },
    // 禁止相机地形穿透
    cameraStop() {
      /* eslint-disable */
      viewer.clock.onTick.addEventListener(function() {
        if (viewer.camera.pitch > 0) {
          viewer.scene.screenSpaceCameraController.enableTilt = false
        }
      })

      var mousePosition, startMousePosition
      var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
      handler.setInputAction(function(movement) {
        mousePosition = startMousePosition = Cesium.Cartesian3.clone(
          movement.position
        )
        handler.setInputAction(function(movement) {
          mousePosition = movement.endPosition
          var y = mousePosition.y - startMousePosition.y
          if (y > 0) {
            viewer.scene.screenSpaceCameraController.enableTilt = true
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
      }, Cesium.ScreenSpaceEventType.MIDDLE_DOWN)
      /* eslint-enable */
    },
    createCanvasImage(
      className,
      startLocationX,
      startLocationY,
      cutoutWidth,
      cutoutHeight,
      width,
      height,
      imgSrc
    ) {
      return new Promise((resolve, reject) => {
        const container = document.getElementById('canvas-package')
        const newCanvas = document.createElement('canvas')
        newCanvas.width = width
        newCanvas.height = height
        newCanvas.className = className
        container.appendChild(newCanvas)
        const context = newCanvas.getContext('2d')
        const image = new Image()
        image.setAttribute('crossorigin', 'anonymous')
        image.src = imgSrc
        image.onload = function() {
          // console.log('canvas绘图啦')
          context.drawImage(
            image,
            startLocationX,
            startLocationY,
            cutoutWidth,
            cutoutHeight,
            0,
            0,
            width,
            height
          )
          resolve(newCanvas)
        }
      })
    },

    // 移动云图
    handleClickMoveImage() {
      // 隐藏多层效果
      this.activeModule = 'moveCloud'
      this.flytoPosition()
      this.exitTwoDimension()
      this.hiddenImage()
      /* eslint-disable */
      removeLevel(viewer, this.showImage)
      moveImage(viewer, this.intervalInfo)
      /* eslint-enable */
    },

    // 数据同步
    twoDimensionDataSync({ key, value }) {
      this[key] = value
    },

    // 开始绘制坐标系
    handleDrawCoordinateSystem() {
      if (this.useBaseMap === '') {
        this.handleSwitchCloudChart('noGrid')
      }
      this.handleInitCamera()
      this.handleSwitchTwoDimension()
      // this.$refs.twoDimension.$emit('handleDrawCoordinateSystem')
      viewer.entities.remove(viewer.entities.getById("cutoutPolyline"));
      // 删除三维坐标系数据 start
      viewer.dataSources.remove(this.d3CoordinateSystemDatasource);
      viewer.dataSources.remove(this.coverageDatasource);
      this.d3CoordinateSystemDatasource = null;
      this.coverageDatasource = null;
      this.isShowCoverage = false;
      this.isDraw3DCoordinateSystem = false;
      // 删除三维坐标系数据 end

      this.isLocalAnalysis = false;
      this.isCutout = false;

      // 避免鼠标事件冲突 start
      this.mouseEventHandler && this.mouseEventHandler.destroy();
      this.mouseEventHandler = null;
      this.mouseDrawEventHandler && this.mouseDrawEventHandler.destroy();
      this.mouseDrawEventHandler = null;
      // 避免鼠标事件冲突 end

      this.isDrawCoordinateSystem = !this.isDrawCoordinateSystem;
      if (this.isDrawCoordinateSystem) {
        // 删除对应的canvas元素
        $("#heatmap .cut-wall").remove();
        $("#heatmap .coordinate-system-base-map").remove();
        viewer.dataSources.remove(this.coordinateSystemDatasource);
        viewer.dataSources.remove(this.animationPolygonDatasource);
        this.coordinateSystemDatasource = null;
        this.animationPolygonDatasource = null;
        this.onDrawMouseEvent();
      }
    },

    // 返回初始视角
    handleInitCamera() {
      // 设置镜头位置与方向
      console.log(
        'this.getInitCameraData===返回初始视角===',
        this.getInitCameraData
      )
      if (this.getInitCameraData) {
        const initialPosition = new Cesium.Cartesian3.fromDegrees(
          Number(this.getInitCameraData.lon),
          Number(this.getInitCameraData.lat),
          Number(this.getInitCameraData.height)
        )
        const homeCameraView = {
          destination: initialPosition,
          orientation: {
            heading: Cesium.Math.toRadians(
              Number(this.getInitCameraData.heading)
            ),
            pitch: Cesium.Math.toRadians(Number(this.getInitCameraData.pitch)),
            roll: 0.0
          }
        }
        // eslint-disable-next-line no-undef
        viewer.scene.camera.setView(homeCameraView)
      }
    },

    // 绘制三维分析坐标系
    handleDraw3DCoordinateSystem() {
      if (this.useBaseMap === '') {
        this.handleSwitchCloudChart('noGrid')
      }
      this.handleSwitchTwoDimension()
      this.handleInitCamera()
      // this.$refs.twoDimension.$emit('handleDraw3DCoordinateSystem')
      this.isCutout = false;
      // 删除三维坐标系数据 start
      this.isDrawCoordinateSystem = false;
      viewer.dataSources.remove(this.coordinateSystemDatasource);
      viewer.dataSources.remove(this.animationPolygonDatasource);
      this.coordinateSystemDatasource = null;
      this.animationPolygonDatasource = null;
      // 删除三维坐标系数据 end
      this.isLocalAnalysis = false;

      // 避免鼠标事件冲突 start
      this.mouseEventHandler && this.mouseEventHandler.destroy();
      this.mouseEventHandler = null;
      // 避免鼠标事件冲突 end

      this.isDraw3DCoordinateSystem = !this.isDraw3DCoordinateSystem;
      if (this.isDraw3DCoordinateSystem) {
        // 删除对应的canvas元素
        $("#heatmap .cut-wall").remove();
        $("#heatmap .coordinate-system-base-map").remove();
        viewer.dataSources.remove(this.d3CoordinateSystemDatasource);
        viewer.dataSources.remove(this.coverageDatasource);
        this.coverageDatasource = null;
        this.d3CoordinateSystemDatasource = null;
        this.isShowCoverage = false;
        this.onDrawMouseEvent();
      }
      // this.isDraw3DCoordinateSystem = false
    },

    // 开始截取剖面
    handleCutoutPolygon() {
      if (this.useBaseMap === '') {
        this.handleSwitchCloudChart('noGrid')
      }
      this.handleSwitchTwoDimension()
      this.handleInitCamera()
      // this.$refs.twoDimension.$emit('handleCutoutPolygon')
      // 绘制3维
      this.isDraw3DCoordinateSystem = false;
      this.cutoutWallMaterialArr = [];
      // console.log(this.mouseDrawEventHandler)
      // 当前动画的时间
      let currentTime = JSON.parse(JSON.stringify(viewer.clock.currentTime));
      // 销毁之前鼠标绘制事件对象
      this.mouseDrawEventHandler && this.mouseDrawEventHandler.destroy();
      this.mouseDrawEventHandler = null;
      // this.isLocalAnalysis = false
      this.isDrawCoordinateSystem = false;

      this.cutoutPosition = [];
      if (this.isCutout) {
        this.isCutout = false;
        // this.cutoutPolygonDatasource && viewer.dataSources.remove(this.cutoutPolygonDatasource, true)
        // this.cutoutPolygonDatasource = null
        viewer.entities.remove(viewer.entities.getById("cutoutPolyline"));
      } else {
        // 避免鼠标事件冲突 start
        this.mouseEventHandler && this.mouseEventHandler.destroy();
        this.mouseEventHandler = null;
        // 避免鼠标事件冲突 end

        this.isCutout = true;
        // this.cutoutPolygonDatasource && viewer.dataSources.remove(this.cutoutPolygonDatasource, true)
        // this.cutoutPolygonDatasource = null
        // 避免因为删除剖面导致动画重绘
        viewer.clock.currentTime = currentTime;
        viewer.entities.remove(viewer.entities.getById("cutoutPolyline"));
        this.onDrawMouseEvent();
      }
      // this.isCutout = false
    },

    // 删除实体
    handleDeleteentitly() {
      if (!this.activeEntityCollection) return
      this.activeEntityCollection.removeAll()
      this.activeEntityCollection = null

      // viewer.dataSources.removeAll()
    },

    // 显示/隐藏图层
    handleToggleShow() {
      if (!this.d3CoordinateSystemDatasource) return;
      let height = 360000;
      this.isShowCoverage = !this.isShowCoverage;
      // 三维气象分析
      this.isDraw3DCoordinateSystem = false;

      if (this.coverageDatasource) {
        // console.log('this.coverageDatasource', this.coverageDatasource)
        this.coverageDatasource.entities.show = this.isShowCoverage;
        // for (let i = 0; i <= 19; i++) {
        //   let entity = this.coverageDatasource.entities.getById(`coordinate-system-base-map${i}`)
        //   entity.show = this.isShowCoverage
        // }
      } else {
        let { a, b } = this.drawCoverageCoordinate;
        let coordinateSystemCzml = [
          {
            id: "document",
            name: "Coverage Manage",
            version: "1.0"
          }
        ];
        let coordinateSystem = viewer.dataSources.add(
          Cesium.CzmlDataSource.load(coordinateSystemCzml)
        );
        coordinateSystem.then(datasource => {
          this.coverageDatasource = datasource;
          for (let i = 0; i < 20; i++) {
            this.createCanvasImage(
              `coordinate-system-base-map coordinate-system-base-map${i}`,
              this.getClipData({ lng: a.lng, lat: b.lat }).clipX,
              this.getClipData({ lng: a.lng, lat: b.lat }).clipY,
              Math.abs(
                this.getClipData({
                  lng: a.lng,
                  lat: b.lat
                }).clipX - this.getClipData({ lng: b.lng, lat: b.lat }).clipX
              ),
              Math.abs(
                this.getClipData({
                  lng: a.lng,
                  lat: b.lat
                }).clipY - this.getClipData({ lng: a.lng, lat: a.lat }).clipY
              ),
              Math.abs(
                this.getClipData({
                  lng: a.lng,
                  lat: b.lat
                }).clipX - this.getClipData({ lng: b.lng, lat: b.lat }).clipX
              ),
              Math.abs(
                this.getClipData({
                  lng: a.lng,
                  lat: b.lat
                }).clipY - this.getClipData({ lng: a.lng, lat: a.lat }).clipY
              ),
              // `http://47.95.129.34:9002/file/china/z${i}.png`,
              `${gis.nginxFilePath}${this.dataTime}/z${i.toString().padStart(2, '0')}.png`,
              "rgba(10,20,36,0)"
            ).then(canvas => {
              datasource.entities.add({
                id: `coordinate-system-base-map${i}`,
                rectangle: {
                  coordinates: Cesium.Rectangle.fromDegrees(
                    a.lng,
                    a.lat,
                    b.lng,
                    b.lat
                  ),
                  height: height * ((i + 1) / 20),
                  material: new Cesium.ImageMaterialProperty({
                    image: canvas,
                    transparent: true, // 是否透明
                    color: Cesium.Color.ALICEBLUE.withAlpha(0.5)
                  })
                }
              });
            });
          }
        });
      }
    },

    // 局部分析
    handleLocalAnalysis() {
      this.$refs.twoDimension.$emit('handleLocalAnalysis')
    },

    // 监听绘制鼠标事件
    onDrawMouseEvent() {
      // 处理用户输入事件
      this.mouseDrawEventHandler = new Cesium.ScreenSpaceEventHandler(
        viewer.scene.canvas
      );
      let positions = [];
      let poly = undefined;
      // 左键单击
      this.mouseDrawEventHandler.setInputAction(movement => {
        // console.log('左键点击', movement)
        if (!viewer.scene.camera) {
          return;
        }

        let cartesian = viewer.scene.camera.pickEllipsoid(
          movement.position,
          viewer.scene.globe.ellipsoid
        );
        if (positions.length == 0) {
          // 克隆对象，返回包含相同属性的新对象
          this.getInitCamera(movement);
          positions.push(cartesian.clone());
        }
        positions.push(cartesian);
        this.cutoutPosition = JSON.parse(JSON.stringify(positions));
        // 实时获取剖面数据
        if (this.isCutout && this.cutoutPosition.length >= 3) {
          let arr = JSON.parse(JSON.stringify(this.cutoutPosition));
          arr.pop();
          let i = this.cutoutWallMaterialArr.length;
          for (; i < arr.length - 1; i++) {
            this.getLineDataInfo({
              a: {
                x: parseInt(
                  this.getClipData(this.d3ToLng(this.cutoutPosition[i])).clipX
                ),
                y: parseInt(
                  this.getClipData(this.d3ToLng(this.cutoutPosition[i])).clipY
                )
              },
              b: {
                x: parseInt(
                  this.getClipData(this.d3ToLng(this.cutoutPosition[i + 1]))
                    .clipX
                ),
                y: parseInt(
                  this.getClipData(this.d3ToLng(this.cutoutPosition[i + 1]))
                    .clipY
                )
              }
            }).then(response => {
              this.cutoutWallMaterialArr.push(`http://47.95.129.34:9002/file/map/line/${response}`)
              // this.cutoutWallMaterialArr.push(
              //   gis.nginxFilePath + this.dataTime + "/line/" + response
              // );
            });
          }
        }
        // 剖面最多可绘制5个点
        if (this.isCutout && this.cutoutPosition.length === 6) {
          this.mouseDrawEventHandler && this.mouseDrawEventHandler.destroy();
          this.mouseDrawEventHandler = null;
          this.isCutout = false;

          // 删除截取线条
          viewer.entities.remove(viewer.entities.getById("cutoutPolyline"));
          this.cutoutPosition.pop();
          // 开始绘制剖面
          setTimeout(() => {
            this.handleDrawCutoutPolygon(180000.0);
          }, 1000);

          // 重新设置鼠标事件对象
          this.onMouseEvent();
        }
        // 绘制坐标系
        if (
          (this.isDrawCoordinateSystem || this.isDraw3DCoordinateSystem) &&
          this.cutoutPosition.length === 3
        ) {
          // 绘制完成隐藏地图 start
          // this.$emit("hideBaseMap");
          this.handleHideBaseMap()
          // 绘制完成隐藏地图 end
          let self = this;
          this.mouseDrawEventHandler && this.mouseDrawEventHandler.destroy();
          this.mouseDrawEventHandler = null;
          this.isCutout = false;

          // 删除截取线条
          viewer.entities.remove(viewer.entities.getById("cutoutPolyline"));
          this.cutoutPosition.pop();
          // console.log('坐标系的范围', this.cutoutPosition)

          this.point1 = transitionCoordinate(this.cutoutPosition[0]);
          this.point2 = transitionCoordinate(this.cutoutPosition[1]);

          // 坐标转换
          function transitionCoordinate(cartesian3) {
            let ellipsoid = viewer.scene.globe.ellipsoid;
            let cartographic = ellipsoid.cartesianToCartographic(cartesian3);
            let lat = Cesium.Math.toDegrees(cartographic.latitude);
            let lng = Cesium.Math.toDegrees(cartographic.longitude);
            return `${lng},${lat}`;
          }

          // this.isDrawCoordinateSystem = false
          // this.isDraw3DCoordinateSystem = false
          // 二维分析
          if (this.isDrawCoordinateSystem) this.animationStatus = "stop";
          this.handleCreateCoordinateSystem();
          this.onMouseEvent();
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      this.mouseDrawEventHandler.setInputAction(movement => {
        // console.log('鼠标移动', movement)
        // 选择球体上的一个坐标
        let cartesian = viewer.scene.camera.pickEllipsoid(
          movement.endPosition,
          viewer.scene.globe.ellipsoid
        );
        // console.log('cartesian', cartesian)
        if (positions.length >= 1) {
          // 如果定义了对象，则返回true，否则返回false
          if (!Cesium.defined(poly)) {
            poly = new PolyLinePrimitive(positions);
          } else {
            positions.pop();
            // cartesian.y += (1 + Math.random());
            positions.push(cartesian);
          }
        }

        // 鼠标实时位置
        if (cartesian) {
          let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(
            cartesian
          );
          let lat = Cesium.Math.toDegrees(cartographic.latitude);
          let lng = Cesium.Math.toDegrees(cartographic.longitude);
          let alt = cartographic.height;
          this.realTimeCoordinates = {
            lng,
            lat,
            alt
          };
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      this.mouseDrawEventHandler.setInputAction(movement => {
        // 绘制坐标系忽略右击事件
        if (this.isDrawCoordinateSystem || this.isDraw3DCoordinateSystem)
          return;

        // console.log('右击事件')
        this.mouseDrawEventHandler && this.mouseDrawEventHandler.destroy();
        this.mouseDrawEventHandler = null;
        this.isCutout = false;

        // 删除截取线条
        viewer.entities.remove(viewer.entities.getById("cutoutPolyline"));
        this.cutoutPosition.pop();
        // console.log('this.cutoutWallMaterialArr', this.cutoutWallMaterialArr)
        // 开始绘制剖面
        setTimeout(() => {
          console.log("开始绘制剖面了");
          console.log(
            "this.cutoutWallMaterialArr============================",
            this.cutoutWallMaterialArr
          );
          this.handleDrawCutoutPolygon(180000.0);
        }, 5000);
        // 调整角度
        this.$emit("flytoPosition");
        // 重新设置鼠标事件对象
        this.onMouseEvent();
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

      let self = this;
      let PolyLinePrimitive = (function() {
        function _(positions) {
          this.options = {
            id: "cutoutPolyline",
            polyline: {
              show: true,
              positions: [],
              material: new Cesium.Color(1, 0, 0, 1),
              width: 2
            }
          };
          this.positions = positions;
          this._init();
        }

        _.prototype._init = function() {
          let _self = this;
          let _update = function() {
            // console.log('更新坐标', _self.positions)
            return _self.positions;
          };
          //实时更新polyline.positions（由回调函数惰性地计算其值的属性） => 定期检索position
          this.options.polyline.positions = new Cesium.CallbackProperty(
            _update,
            false
          );
          viewer.entities.add(this.options);
        };
        return _;
      })();
    },

    // 鼠标事件监听
    onMouseEvent() {
      let ellipsoid = viewer.scene.globe.ellipsoid;
      this.mouseEventHandler = new Cesium.ScreenSpaceEventHandler(
        viewer.scene.canvas
      );

      this.mouseEventHandler.setInputAction(movement => {
        let pick = viewer.scene.pick(movement.position);
        // Cesium.defined(pick) && console.log(pick.id.id)
        if (Cesium.defined(pick) && pick.id.id.indexOf("wall") > -1) {
          // console.log('pick', pick.id.id)
          // console.log('pick', pick)
          this.activeEntityCollection = pick.id.entityCollection;
        } else {
          this.activeEntityCollection = null;
        }
      }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

      this.mouseEventHandler.setInputAction(movement => {
        let cartesian = viewer.camera.pickEllipsoid(
          movement.endPosition,
          ellipsoid
        );
        if (cartesian) {
          let cartographic = ellipsoid.cartesianToCartographic(cartesian);
          let lat = Cesium.Math.toDegrees(cartographic.latitude);
          let lng = Cesium.Math.toDegrees(cartographic.longitude);
          let alt = cartographic.height;
          this.realTimeCoordinates = {
            lng,
            lat,
            alt
          };
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },

    getInitCamera(movement) {
      //得到当前三维场景
      var scene = viewer.scene;
      var camera = viewer.camera;
      //得到当前三维场景的椭球体
      var ellipsoid = scene.globe.ellipsoid;
      var cartesianPick = viewer.scene.pickPosition(movement.position);
      if (cartesianPick) {
        // var cartographic = ellipsoid.cartesianToCartographic(cartesianPick);
        // var lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(7);
        // var lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(7);
        var result = viewer.camera.pickEllipsoid(
          new Cesium.Cartesian2(
            viewer.canvas.clientWidth / 2,
            viewer.canvas.clientHeight / 2
          )
        );
        var curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
          result
        );
        var lon = (curPosition.longitude * 180) / Math.PI;
        var lat = (curPosition.latitude * 180) / Math.PI;
        //相机高度
        var height = viewer.camera.positionCartographic.height.toFixed(0);
        var heading = Cesium.Math.toDegrees(camera.heading).toFixed(2);
        var pitch = Cesium.Math.toDegrees(camera.pitch).toFixed(2);
        this.initCameraData = {
          lon: lon,
          lat: lat,
          height: height,
          heading: heading,
          pitch: pitch
        };
        this.SET_INIT_CAMERA_HEIGHT(this.initCameraData);
      }
    },

    // 创建坐标轴 localAnalysis: 是否为局部分析（不创建动画面板）
    handleCreateCoordinateSystem() {
      // 停止动画
      clearInterval(this.timer);
      viewer.clock.shouldAnimate = false;

      // 116.06,40.42 116.96,39.42
      // console.log(this.point1.split(','))
      // console.log(this.point2.split(','))
      let point1 = this.point1.split(",").map(item => {
        return Number(item);
      });
      let point2 = this.point2.split(",").map(item => {
        return Number(item);
      });
      let extrudedHeight = 0;
      if (this.isDraw3DCoordinateSystem) {
        extrudedHeight = 400000;
      } else {
        extrudedHeight = 200000;
      }

      // point1坐标位置信息
      let point1Location = {};

      // 1、对比两点的经纬度，建立坐标方位
      // 经度对比 => 判断出左右
      if (point1[0] < point2[0]) {
        // 在左
        point1Location.left = true;
      } else {
        // 在右
        point1Location.left = false;
      }
      // 纬度对比 => 判断出上下
      if (point1[1] > point2[1]) {
        // 在上
        point1Location.top = true;
      } else {
        // 在下
        point1Location.top = false;
      }
      // point1位于左上角的位置
      if (point1Location.left && point1Location.top) {
        this.drawCoverageCoordinate = {
          a: {
            lng: point1[0],
            lat: point2[1]
          },
          b: {
            lng: point2[0],
            lat: point1[1]
          }
        };

        this.drawCoordinateSystem({
          a: {
            lng: point1[0],
            lat: point2[1]
          },
          b: {
            lng: point2[0],
            lat: point1[1]
          },
          height: 0,
          extrudedHeight: extrudedHeight
        });

        this.lengthwaysPolygon = {
          a: { lng: point1[0], lat: point2[1] },
          b: { lng: point1[0], lat: point1[1] }
        };
        this.crosswisePolygon = {
          a: { lng: point1[0], lat: point1[1] },
          b: { lng: point2[0], lat: point1[1] }
        };
      } else if (point1Location.left && !point1Location.top) {
        this.drawCoverageCoordinate = {
          a: {
            lng: point1[0],
            lat: point1[1]
          },
          b: {
            lng: point2[0],
            lat: point2[1]
          }
        };
        // point1位于左下角的位置
        this.drawCoordinateSystem({
          a: {
            lng: point1[0],
            lat: point1[1]
          },
          b: {
            lng: point2[0],
            lat: point2[1]
          },
          height: 0,
          extrudedHeight: extrudedHeight
        });

        this.lengthwaysPolygon = {
          a: { lng: point1[0], lat: point1[1] },
          b: { lng: point1[0], lat: point2[1] }
        };
        this.crosswisePolygon = {
          a: { lng: point1[0], lat: point2[1] },
          b: { lng: point2[0], lat: point2[1] }
        };
      } else if (!point1Location.left && point1Location.top) {
        // point1位于右上角的位置
        this.drawCoverageCoordinate = {
          a: {
            lng: point2[0],
            lat: point2[1]
          },
          b: {
            lng: point1[0],
            lat: point1[1]
          }
        };
        this.drawCoordinateSystem({
          a: {
            lng: point2[0],
            lat: point2[1]
          },
          b: {
            lng: point1[0],
            lat: point1[1]
          },
          height: 0,
          extrudedHeight: extrudedHeight
        });

        this.lengthwaysPolygon = {
          a: { lng: point2[0], lat: point2[1] },
          b: { lng: point2[0], lat: point1[1] }
        };
        this.crosswisePolygon = {
          a: { lng: point2[0], lat: point1[1] },
          b: { lng: point1[0], lat: point1[1] }
        };
      } else {
        // point1位于右下角的位置
        this.drawCoverageCoordinate = {
          a: {
            lng: point2[0],
            lat: point1[1]
          },
          b: {
            lng: point1[0],
            lat: point2[1]
          }
        };
        this.drawCoordinateSystem({
          a: {
            lng: point2[0],
            lat: point1[1]
          },
          b: {
            lng: point1[0],
            lat: point2[1]
          },
          height: 0,
          extrudedHeight: extrudedHeight
        });

        this.lengthwaysPolygon = {
          a: { lng: point2[0], lat: point1[1] },
          b: { lng: point2[0], lat: point2[1] }
        };
        this.crosswisePolygon = {
          a: { lng: point2[0], lat: point2[1] },
          b: { lng: point1[0], lat: point2[1] }
        };
      }

      // 算出经纬度移动的步长
      this.lngSpeed =
        (this.crosswisePolygon.b.lng - this.lengthwaysPolygon.a.lng) /
        ((5 * 60) / 20) /
        10;
      this.latSpeed =
        (this.lengthwaysPolygon.b.lat - this.lengthwaysPolygon.a.lat) /
        ((5 * 60) / 20) /
        10;

      // 绘制动画面板
      if (this.isDrawCoordinateSystem || this.isLocalAnalysis) {
        this.drawAnimationPolygon({
          lengthwaysPolygon: this.lengthwaysPolygon,
          crosswisePolygon: this.crosswisePolygon,
          height: 0.0,
          extrudedHeight: 180000
        });
      }
      // 绘制三维立体图层
      if (this.isDraw3DCoordinateSystem) {
        this.handleToggleShow();
      }
      // 绘制完成（关闭标志位）
      this.isDrawCoordinateSystem = false;
      this.isDraw3DCoordinateSystem = false;
    },

    // 绘制坐标系 a: 左下角 b: 右下角 c: 右上角 d: 左上角 height: 相对于球体的高度 extrudedHeight: 坐标系的高度
    // a: -90, 38 b: -80, 38 c: -80, 44 d: -90, 44
    drawCoordinateSystem({ a, b, height, extrudedHeight }) {
      // console.log('坐标系a:', a)
      // console.log('坐标系b:', b)
      let coordinateSystemCzml = [
        {
          id: "document",
          name: "Coordinate System",
          version: "1.0"
        },
        {
          id: `Line1`,
          polyline: {
            positions: {
              cartographicDegrees: [
                a.lng,
                a.lat,
                height,
                b.lng,
                a.lat,
                height,
                b.lng,
                b.lat,
                height,
                a.lng,
                b.lat,
                height,
                a.lng,
                a.lat,
                height
              ]
            },
            material: {
              solidColor: {
                color: {
                  rgba: [250, 0, 0, 255]
                }
              }
            },
            width: 1
          }
        },
        {
          id: `Line2`,
          polyline: {
            positions: {
              cartographicDegrees: [
                a.lng,
                a.lat,
                extrudedHeight,
                b.lng,
                a.lat,
                extrudedHeight,
                b.lng,
                b.lat,
                extrudedHeight,
                a.lng,
                b.lat,
                extrudedHeight,
                a.lng,
                a.lat,
                extrudedHeight
              ]
            },
            material: {
              solidColor: {
                color: {
                  rgba: [250, 0, 0, 255]
                }
              }
            },
            width: 1
          }
        },
        {
          id: `Line3`,
          polyline: {
            positions: {
              cartographicDegrees: [
                a.lng,
                a.lat,
                height,
                a.lng,
                a.lat,
                extrudedHeight
              ]
            },
            material: {
              solidColor: {
                color: {
                  rgba: [250, 0, 0, 255]
                }
              }
            },
            width: 1
          }
        },
        {
          id: `Line4`,
          polyline: {
            positions: {
              cartographicDegrees: [
                b.lng,
                a.lat,
                height,
                b.lng,
                a.lat,
                extrudedHeight
              ]
            },
            material: {
              solidColor: {
                color: {
                  rgba: [250, 0, 0, 255]
                }
              }
            },
            width: 1
          }
        },
        {
          id: `Line5`,
          polyline: {
            positions: {
              cartographicDegrees: [
                b.lng,
                b.lat,
                height,
                b.lng,
                b.lat,
                extrudedHeight
              ]
            },
            material: {
              solidColor: {
                color: {
                  rgba: [250, 0, 0, 255]
                }
              }
            },
            width: 1
          }
        },
        {
          id: `Line6`,
          polyline: {
            positions: {
              cartographicDegrees: [
                a.lng,
                b.lat,
                height,
                a.lng,
                b.lat,
                extrudedHeight
              ]
            },
            material: {
              solidColor: {
                color: {
                  rgba: [250, 0, 0, 255]
                }
              }
            },
            width: 1
          }
        }
      ];
      // console.log('this.getClipData({ lng: a.lng, lat: b.lat }).clipX:', this.getClipData({ lng: a.lng, lat: b.lat }).clipX)
      // console.log('this.getClipData({ lng: a.lng, lat: b.lat }).clipY:', this.getClipData({ lng: a.lng, lat: b.lat }).clipY)
      // console.log('width:',  Math.abs(this.getClipData({ lng: a.lng, lat: b.lat }).clipX - this.getClipData({ lng: b.lng, lat: b.lat }).clipX))
      // console.log('height:',  Math.abs(this.getClipData({ lng: a.lng, lat: b.lat }).clipY - this.getClipData({ lng: a.lng, lat: a.lat }).clipY))

      let coordinateSystem = viewer.dataSources.add(
        Cesium.CzmlDataSource.load(coordinateSystemCzml)
      );
      coordinateSystem.then(datasource => {
        if (this.isDrawCoordinateSystem) {
          this.coordinateSystemDatasource = datasource;
        } else {
          this.d3CoordinateSystemDatasource = datasource;
        }
        this.createCanvasImage(
          "coordinate-system-base-map",
          this.getClipData({ lng: a.lng, lat: b.lat }).clipX,
          this.getClipData({ lng: a.lng, lat: b.lat }).clipY,
          Math.abs(
            this.getClipData({ lng: a.lng, lat: b.lat }).clipX -
              this.getClipData({
                lng: b.lng,
                lat: b.lat
              }).clipX
          ),
          Math.abs(
            this.getClipData({ lng: a.lng, lat: b.lat }).clipY -
              this.getClipData({
                lng: a.lng,
                lat: a.lat
              }).clipY
          ),
          Math.abs(
            this.getClipData({ lng: a.lng, lat: b.lat }).clipX -
              this.getClipData({
                lng: b.lng,
                lat: b.lat
              }).clipX
          ),
          Math.abs(
            this.getClipData({ lng: a.lng, lat: b.lat }).clipY -
              this.getClipData({
                lng: a.lng,
                lat: a.lat
              }).clipY
          ),
          gis.nginxFilePath + this.dataTime + "/z.png",
          // 'http://47.95.129.34:9002/file/china/z.png',
          "rgba(10,20,36,0.7)"
        ).then(canvas => {
          datasource.entities.add({
            rectangle: {
              coordinates: Cesium.Rectangle.fromDegrees(
                a.lng,
                a.lat,
                b.lng,
                b.lat
              ),
              height: 0,
              material: new Cesium.ImageMaterialProperty({
                image: canvas,
                transparent: true // 是否透明
                // color: Cesium.Color.ALICEBLUE.withAlpha(0.5)
              })
            }
          });
        });
        // setTimeout(() => {
        //   datasource.entities.add({
        //     rectangle: {
        //       coordinates: Cesium.Rectangle.fromDegrees(a.lng, a.lat, b.lng, b.lat),
        //       height: 0,
        //       material: new Cesium.ImageMaterialProperty({
        //         image: imgDatasource,
        //         transparent: true, // 是否透明
        //         color: Cesium.Color.ALICEBLUE.withAlpha(0.5)
        //       })
        //     }
        //   })
        // }, 1000)
      });
      viewer.zoomTo(coordinateSystem);
    },

    // 绘制动画面板 lengthwaysPolygon: 横向运动面板的两点坐标 crosswisePolygon: 纵向运动面板的两点坐标  height: 相对于球体的高度 extrudedHeight: 面板的高度
    drawAnimationPolygon({
      lengthwaysPolygon,
      crosswisePolygon,
      height,
      extrudedHeight
    }) {
      let YSpeed = (crosswisePolygon.a.lat - lengthwaysPolygon.a.lat) / 3;
      let XSpeed = (lengthwaysPolygon.a.lng - crosswisePolygon.b.lng) / 3;

      // 计算整个动画运动过程的点数
      // 纵向
      let lengthwaysPositionArr = [];
      // 横向
      let crosswisePositionArr = [];

      // console.log('lengthwaysPolygon:', lengthwaysPolygon)
      // console.log('crosswisePolygon:', crosswisePolygon)

      let CrosswiseMaterialList = [];
      let LengthwaysMaterialList = [];
      let startTime = Date.parse("2012-08-04T16:00:00Z");
      let lngSpeed =
        Math.abs(crosswisePolygon.b.lng - crosswisePolygon.a.lng) / (5 * 60);
      let latSpeed =
        Math.abs(lengthwaysPolygon.a.lat - crosswisePolygon.a.lat) / (5 * 60);
      // debugger
      for (let i = 0; i < 150; i++) {
        if (this.isLocalAnalysis) {
          if (i === 0) {
            lengthwaysPositionArr.push({
              a: {
                x: parseInt(
                  this.getClipData({
                    lng: lengthwaysPolygon.a.lng + lngSpeed * i * 2,
                    lat: lengthwaysPolygon.a.lat
                  }).clipX
                ),
                y: parseInt(
                  this.getClipData({
                    lng: lengthwaysPolygon.a.lng + lngSpeed * i * 2,
                    lat: lengthwaysPolygon.a.lat
                  }).clipY
                )
              },
              b: {
                x: parseInt(
                  this.getClipData({
                    lng: lengthwaysPolygon.b.lng + lngSpeed * i * 2,
                    lat: lengthwaysPolygon.b.lat
                  }).clipX
                ),
                y: parseInt(
                  this.getClipData({
                    lng: lengthwaysPolygon.b.lng + lngSpeed * i * 2,
                    lat: lengthwaysPolygon.b.lat
                  }).clipY
                )
              }
            });
            crosswisePositionArr.push({
              a: {
                x: parseInt(
                  this.getClipData({
                    lng: crosswisePolygon.a.lng,
                    lat: crosswisePolygon.a.lat - latSpeed * i * 2
                  }).clipX
                ),
                y: parseInt(
                  this.getClipData({
                    lng: crosswisePolygon.a.lng,
                    lat: crosswisePolygon.a.lat - latSpeed * i * 2
                  }).clipY
                )
              },
              b: {
                x: parseInt(
                  this.getClipData({
                    lng: crosswisePolygon.b.lng,
                    lat: crosswisePolygon.b.lat - latSpeed * i * 2
                  }).clipX
                ),
                y: parseInt(
                  this.getClipData({
                    lng: crosswisePolygon.b.lng,
                    lat: crosswisePolygon.b.lat - latSpeed * i * 2
                  }).clipY
                )
              }
            });
          }
        } else {
          lengthwaysPositionArr.push({
            a: {
              x: parseInt(
                this.getClipData({
                  lng: lengthwaysPolygon.a.lng + lngSpeed * i * 2,
                  lat: lengthwaysPolygon.a.lat
                }).clipX
              ),
              y: parseInt(
                this.getClipData({
                  lng: lengthwaysPolygon.a.lng + lngSpeed * i * 2,
                  lat: lengthwaysPolygon.a.lat
                }).clipY
              )
            },
            b: {
              x: parseInt(
                this.getClipData({
                  lng: lengthwaysPolygon.b.lng + lngSpeed * i * 2,
                  lat: lengthwaysPolygon.b.lat
                }).clipX
              ),
              y: parseInt(
                this.getClipData({
                  lng: lengthwaysPolygon.b.lng + lngSpeed * i * 2,
                  lat: lengthwaysPolygon.b.lat
                }).clipY
              )
            }
          });
          crosswisePositionArr.push({
            a: {
              x: parseInt(
                this.getClipData({
                  lng: crosswisePolygon.a.lng,
                  lat: crosswisePolygon.a.lat - latSpeed * i * 2
                }).clipX
              ),
              y: parseInt(
                this.getClipData({
                  lng: crosswisePolygon.a.lng,
                  lat: crosswisePolygon.a.lat - latSpeed * i * 2
                }).clipY
              )
            },
            b: {
              x: parseInt(
                this.getClipData({
                  lng: crosswisePolygon.b.lng,
                  lat: crosswisePolygon.b.lat - latSpeed * i * 2
                }).clipX
              ),
              y: parseInt(
                this.getClipData({
                  lng: crosswisePolygon.b.lng,
                  lat: crosswisePolygon.b.lat - latSpeed * i * 2
                }).clipY
              )
            }
          });
        }
        // CrosswiseMaterialList.push({
        //   "interval": `${new Date((startTime  + 2 * 1000 * i)).toISOString()}/${new Date((startTime  + 2 * 1000 * (i + i))).toISOString()}`,
        //   "uri": this.createCanvasImage(`lengthways-canvas${i}`, 420, 200, 100, require(`../../assets/images/${i+1}.png`))
        // })
      }
      // console.log(crosswisePositionArr)
      crosswisePositionArr.forEach((item, i) => {
        CrosswiseMaterialList.push({
          interval: `${new Date(
            startTime + 2 * 1000 * i
          ).toISOString()}/${new Date(
            startTime + 2 * 1000 * (i + i)
          ).toISOString()}`,
          uri: this.createWallCanvasImage(
            `cut-wall crosswise-canvas${i}`,
            item.a.x > item.b.x ? item.b.x : item.a.x,
            0,
            Math.abs(item.a.x - item.b.x),
            200,
            Math.abs(item.a.x - item.b.x),
            200,
            // `http://47.95.129.34:9002/file/map/row/png/row${item.a.y}.png`,
            gis.nginxFilePath + this.dataTime + "/row/row" + item.a.y + ".png",
            "rgba(240,240,240,0.5)"
          )
        });
      });
      lengthwaysPositionArr.forEach((item, i) => {
        LengthwaysMaterialList.push({
          interval: `${new Date(
            startTime + 2 * 1000 * i
          ).toISOString()}/${new Date(
            startTime + 2 * 1000 * (i + i)
          ).toISOString()}`,
          uri: this.createWallCanvasImage(
            `cut-wall lengthway-canvas${i}`,
            item.a.y > item.b.y ? item.b.y : item.a.y,
            0,
            Math.abs(item.a.y - item.b.y),
            200,
            Math.abs(item.a.y - item.b.y),
            200,
            // `http://47.95.129.34:9002/file/map/col/png/col${item.a.x}.png`,
            gis.nginxFilePath + this.dataTime + "/col/col" + item.a.x + ".png",
            "rgba(240,240,240,0.5)"
          )
        });
      });
      // console.log('CrosswiseMaterialList', CrosswiseMaterialList)
      // console.log('LengthwaysMaterialList', LengthwaysMaterialList)

      let PolygonCzml = [
        {
          id: "document",
          name: "CZML Polygon - Interpolating References",
          version: "1.0",
          clock: {
            interval: "2012-08-04T16:00:00Z/2012-08-04T16:05:00Z",
            currentTime: "2012-08-04T16:00:00Z",
            multiplier: 20,
            range: "CLAMPED"
          }
        },
        {
          id: "CrosswisePolygon",
          name: "CrosswisePolygon-Dynamic Polygon with Reference Properties",
          availability: "2012-08-04T16:00:00Z/2012-08-04T16:05:00Z",
          wall: {
            positions: {
              references: ["v1#position", "v2#position"]
            },
            material: {
              image: {
                transparent: false,
                image: CrosswiseMaterialList
              }
            }
          }
        },
        {
          id: "LengthwaysPolygon",
          name: "LengthwaysPolygon-Dynamic Polygon with Reference Properties",
          availability: "2012-08-04T16:00:00Z/2012-08-04T16:05:00Z",
          wall: {
            positions: {
              references: ["v4#position", "v3#position"]
            },
            material: {
              image: {
                transparent: false,
                image: LengthwaysMaterialList
              }
            }
          }
        },
        {
          id: "v1",
          position: {
            interpolationAlgorithm: "LINEAR",
            interpolationDegree: 1,
            interval: "2012-08-04T16:00:00Z/2012-08-04T16:05:00Z",
            epoch: "2012-08-04T16:00:00Z",
            cartographicDegrees: [
              0,
              crosswisePolygon.a.lng,
              crosswisePolygon.a.lat,
              extrudedHeight,
              // 100, crosswisePolygon.a.lng, crosswisePolygon.a.lat - YSpeed * 1, extrudedHeight,
              // 200, crosswisePolygon.a.lng, crosswisePolygon.a.lat - YSpeed * 2, extrudedHeight,
              300,
              crosswisePolygon.a.lng,
              crosswisePolygon.a.lat - YSpeed * 3,
              extrudedHeight
            ]
          }
        },
        {
          id: "v2",
          position: {
            interpolationAlgorithm: "LINEAR",
            interpolationDegree: 1,
            interval: "2012-08-04T16:00:00Z/2012-08-04T16:05:00Z",
            epoch: "2012-08-04T16:00:00Z",
            cartographicDegrees: [
              0,
              crosswisePolygon.b.lng,
              crosswisePolygon.b.lat,
              extrudedHeight,
              // 100, crosswisePolygon.b.lng, crosswisePolygon.b.lat - YSpeed * 1, extrudedHeight,
              // 200, crosswisePolygon.b.lng, crosswisePolygon.b.lat - YSpeed * 2, extrudedHeight,
              300,
              crosswisePolygon.b.lng,
              crosswisePolygon.b.lat - YSpeed * 3,
              extrudedHeight
            ]
          }
        },
        {
          id: "v3",
          position: {
            interpolationAlgorithm: "LINEAR",
            interpolationDegree: 1,
            interval: "2012-08-04T16:00:00Z/2012-08-04T16:05:00Z",
            epoch: "2012-08-04T16:00:00Z",
            cartographicDegrees: [
              0,
              lengthwaysPolygon.a.lng,
              lengthwaysPolygon.a.lat,
              extrudedHeight,
              // 100, lengthwaysPolygon.a.lng - XSpeed, lengthwaysPolygon.a.lat, extrudedHeight,
              // 200, lengthwaysPolygon.a.lng - XSpeed * 2, lengthwaysPolygon.a.lat, extrudedHeight,
              300,
              lengthwaysPolygon.a.lng - XSpeed * 3,
              lengthwaysPolygon.a.lat,
              extrudedHeight
            ]
          }
        },
        {
          id: "v4",
          position: {
            interpolationAlgorithm: "LINEAR",
            interpolationDegree: 1,
            interval: "2012-08-04T16:00:00Z/2012-08-04T16:05:00Z",
            epoch: "2012-08-04T16:00:00Z",
            cartographicDegrees: [
              0,
              lengthwaysPolygon.a.lng,
              lengthwaysPolygon.b.lat,
              extrudedHeight,
              // 100, lengthwaysPolygon.a.lng - XSpeed, lengthwaysPolygon.b.lat, extrudedHeight,
              // 200, lengthwaysPolygon.a.lng - XSpeed * 2, lengthwaysPolygon.b.lat, extrudedHeight,
              300,
              lengthwaysPolygon.a.lng - XSpeed * 3,
              lengthwaysPolygon.b.lat,
              extrudedHeight
            ]
          }
        }
      ];

      // Cesium.CzmlDataSource.load: 加载czml对象
      // viewer.dataSources.add: 加入DataSourceCollection集合中
      let redPolygon;
      setTimeout(() => {
        redPolygon = viewer.dataSources.add(
          Cesium.CzmlDataSource.load(PolygonCzml)
        );
        // viewer.zoomTo(redPolygon)
        redPolygon.then(dataSource => {
          this.animationPolygonDatasource = dataSource;
        });
      }, 1000);
      // viewer.zoomTo(coordinateSystem)
      // console.log('折线=========')
    },

    // 经纬度像素换算
    getClipData({ lng, lat }) {
      const westLon = 73; // 西经
      const eastLon = 135; // 东经
      const northLan = 54.2; // 北纬边界值
      const southLan = 12.2; // 南纬

      // let x1=123  //裁剪的西经
      // let x2=133 //裁剪的东经
      // let y1=44.2 //裁剪的北纬
      // let y2=34.2 //裁剪的南纬

      const clipX = (lng - westLon) * 100;
      const clipY = (northLan - lat) * 100;
      return {
        clipX,
        clipY
      };
    },

    // 生成canvas图片(动画面板)
    createWallCanvasImage(
      className,
      startLocationX,
      startLocationY,
      cutoutWidth,
      cutoutHeight,
      width,
      height,
      imgSrc,
      bgColor
    ) {
      let container = document.getElementById("heatmap");
      let newCanvas = document.createElement("canvas");
      newCanvas.width = width;
      newCanvas.height = height;
      newCanvas.className = className;
      container.appendChild(newCanvas);
      let context = newCanvas.getContext("2d");
      context.fillStyle = bgColor;
      context.fillRect(0, 0, width, height);
      // 翻转图片
      context.translate(0, height);
      context.scale(1, -1);
      let image = new Image();
      image.setAttribute("crossorigin", "anonymous");
      image.src = imgSrc;
      image.onload = function() {
        // console.log('canvas绘图啦')
        // console.log(startLocationX, startLocationY, cutoutWidth, cutoutHeight, width, height);
        context.drawImage(
          image,
          startLocationX,
          startLocationY,
          cutoutWidth,
          cutoutHeight,
          0,
          0,
          width,
          height
        );
      };
      return newCanvas;
    },

    // 3D空间坐标转为经纬度坐标
    d3ToLng(item) {
      let ellipsoid = viewer.scene.globe.ellipsoid;
      let cartographic = ellipsoid.cartesianToCartographic(item);
      let lat = Cesium.Math.toDegrees(cartographic.latitude);
      let lng = Cesium.Math.toDegrees(cartographic.longitude);
      return {
        lng,
        lat
      };
    },

    // 获取剖面png
    getLineDataInfo({ a, b }) {
      //x1=4400&x2=4500&y1=3200&y2=3400
      if (this.fileName == "") {
        console.log("未选择数据时间");
        return;
      }
      return new Promise((resolve, reject) => {
        // let data={
        //   x1: parseInt(this.getClipData(bar(this.cutoutPosition[0])).clipX),
        //   x2: parseInt(this.getClipData(bar(this.cutoutPosition[1])).clipX),
        //   y1: parseInt(this.getClipData(bar(this.cutoutPosition[0])).clipY),
        //   y2: parseInt(this.getClipData(bar(this.cutoutPosition[1])).clipY)
        // }
        let data = {
          fileName: this.fileName,
          x1: a.x,
          x2: b.x,
          y1: a.y,
          y2: b.y
        };
        this.GetLineData(data).then(response => {
          let { data } = response
          // console.log('response=============', response)
          resolve(data);
        });
      });
    },

    // 播放
    playRealtimeViewModel() {
      if (!this.coordinateSystemDatasource || this.isLocalAnalysis) return;
      clearInterval(this.timer);
      // 根据当前时间继续前进
      viewer.clock.tick();
      // viewer.clock.currentTime = viewer.clock.currentTime;
      viewer.clock.shouldAnimate = true;
      // console.log('经度步长', this.lngSpeed)
      // console.log('纬度步长', this.latSpeed)
      this.animationStatus = "starting";
      this.timer = setInterval(() => {
        this.executeSeconds += 1;
        this.activeLengthwaysCoor = [
          [
            this.lengthwaysPolygon.a.lng - this.lngSpeed * this.executeSeconds,
            this.lengthwaysPolygon.a.lat
          ],
          [
            this.lengthwaysPolygon.b.lng - this.lngSpeed * this.executeSeconds,
            this.lengthwaysPolygon.b.lat
          ]
        ];
        this.activeCrosswiseCoor = [
          [
            this.crosswisePolygon.a.lng,
            this.crosswisePolygon.a.lat - this.latSpeed * this.executeSeconds
          ],
          [
            this.crosswisePolygon.b.lng,
            this.crosswisePolygon.b.lat - this.latSpeed * this.executeSeconds
          ]
        ];
        // console.log('纵向面板坐标:', JSON.stringify(this.activeLengthwaysCoor))
        // console.log('横向面板坐标:', JSON.stringify(this.activeCrosswiseCoor))

        // viewer.entities.getById('crosswisePolygon')
      }, 100);
    },

    // 停止
    stopRealtimeViewModel() {
      if (!this.coordinateSystemDatasource || this.isLocalAnalysis) return;
      clearInterval(this.timer);
      this.animationStatus = "stop";
      // viewer.clock.currentTime = viewer.clock.stopTime;
      viewer.clock.shouldAnimate = false;
    },

    // 重新播放
    restRealtimeViewModel() {
      if (!this.coordinateSystemDatasource || this.isLocalAnalysis) return;
      clearInterval(this.timer);
      this.animationStatus = "starting";
      this.executeSeconds = 0;
      this.timer = setInterval(() => {
        this.executeSeconds += 1;
        this.activeLengthwaysCoor = [
          [
            this.lengthwaysPolygon.a.lng - this.lngSpeed * this.executeSeconds,
            this.lengthwaysPolygon.a.lat
          ],
          [
            this.lengthwaysPolygon.b.lng - this.lngSpeed * this.executeSeconds,
            this.lengthwaysPolygon.b.lat
          ]
        ];
        this.activeCrosswiseCoor = [
          [
            this.crosswisePolygon.a.lng,
            this.crosswisePolygon.a.lat - this.latSpeed * this.executeSeconds
          ],
          [
            this.crosswisePolygon.b.lng,
            this.crosswisePolygon.b.lat - this.latSpeed * this.executeSeconds
          ]
        ];
        // console.log('纵向面板坐标:', JSON.stringify(this.activeLengthwaysCoor))
        // console.log('横向面板坐标:', JSON.stringify(this.activeCrosswiseCoor))
      }, 100);
      viewer.clock.currentTime = viewer.clock.startTime;
      viewer.clock.shouldAnimate = true;
    },

    // 绘制剖面(二维)
    handleDrawCutoutPolygon(height) {
      let self = this;

      function bar(item) {
        let ellipsoid = viewer.scene.globe.ellipsoid;
        let cartographic = ellipsoid.cartesianToCartographic(item);
        let lat = Cesium.Math.toDegrees(cartographic.latitude);
        let lng = Cesium.Math.toDegrees(cartographic.longitude);
        return {
          lng,
          lat
        };
      }

      let width = this.getCanvasWidth({
        point1: bar(this.cutoutPosition[0]),
        point2: bar(this.cutoutPosition[1])
      });
      // console.log('绘制剖面')
      // console.log('this.cutoutPosition', this.cutoutPosition)
      if (this.cutoutPosition.length < 2) return console.log("取消绘制");
      let positionArr = [];
      // 地面坐标
      this.cutoutPosition.forEach(item => {
        let ellipsoid = viewer.scene.globe.ellipsoid;
        let cartographic = ellipsoid.cartesianToCartographic(item);
        let lat = Cesium.Math.toDegrees(cartographic.latitude);
        let lng = Cesium.Math.toDegrees(cartographic.longitude);
        // let alt = cartographic.height
        positionArr.push(lng, lat, height);
      });
      // console.log("获取经纬度=====",positionArr)
      let testArr = [];

      // 绘制剖面
      function drawWall(cutoutPosition) {
        let length = cutoutPosition.length - 1;
        let wallArr = [];
        for (let i = 0; i < length; i++) {
          let cartographicDegrees2 = [];
          cartographicDegrees2 = cartographicDegrees2
            .concat(positionArr.slice(3 * i, 3 * (i + 1)))
            .concat(positionArr.slice(3 * (i + 1), 3 * (i + 2)));
          testArr.push({
            id: `wall${i}-${Date.now()}`,
            wall: {
              // positions: [].concat(self.cutoutPosition.slice(2*i, 2*(i+1))).concat(self.cutoutPosition.slice(2*(i+1), 2*(i+2))),
              positions: Cesium.Cartesian3.fromDegreesArrayHeights(
                cartographicDegrees2
              ),
              material: new Cesium.ImageMaterialProperty({
                image: createCanvas(
                  `wall${i}-${Date.now()}`,
                  width,
                  100,
                  self.cutoutWallMaterialArr[i]
                ),
                transparent: false // 是否透明
                // color: Cesium.Color.BLACK.withAlpha(0.9)
              })
            }
          });
        }
        return wallArr;
      }

      let walls = drawWall(this.cutoutPosition);

      function createCanvas(className, width, height, imgSrc) {
        console.log("imgSrc===========================", imgSrc);
        let container = document.getElementById("heatmap");
        let newCanvas = document.createElement("canvas");
        newCanvas.width = width;
        newCanvas.height = height;
        newCanvas.className = className;
        container.appendChild(newCanvas);
        let context = newCanvas.getContext("2d");
        // context.globalAlpha = 0.5
        context.fillStyle = "rgba(240,240,240,0.9)";
        context.fillRect(0, 0, width, height);

        // 翻转图片
        context.translate(0, height);
        context.scale(1, -1);

        // let image = document.getElementById('canvas-img')
        let image = new Image();

        image.setAttribute("crossOrigin", "anonymous");
        image.src = imgSrc;
        image.onload = function() {
          // console.log('canvas绘图啦')
          // context.drawImage(image, 480, 120, 60, 40, 0, 0, width, height)
          context.drawImage(image, 0, 0, width, height);
        };
        // let canvas = document.getElementsByClassName(className)
        // console.log(canvas)
        return newCanvas;
      }

      // 绘制折线
      function drawPolylines(arr, height) {
        let polylineArr = [];
        let index = 0;

        function forEachArr(arr, height) {
          let positions = [];
          arr.forEach(item => {
            let ellipsoid = viewer.scene.globe.ellipsoid;
            let cartographic = ellipsoid.cartesianToCartographic(item);
            let lat = Cesium.Math.toDegrees(cartographic.latitude);
            let lng = Cesium.Math.toDegrees(cartographic.longitude);
            positions.push(lng, lat, height);
          });
          let obj = {
            id: `polylineV${index}`,
            polyline: {
              positions: {
                cartographicDegrees: positions
              },
              material: {
                solidColor: {
                  color: {
                    rgba: [255, 250, 0, 255]
                  }
                }
              },
              width: 1
            }
          };
          polylineArr.push(obj);
          index += 1;
        }

        for (let i = 0; i < 5; i++) {
          forEachArr(arr, height * (i / 4));
        }
        return polylineArr;
      }

      let polylines = drawPolylines(this.cutoutPosition, height);

      // 绘制折线两端的点
      function drawPoints(arr) {
        let cloneArr = JSON.parse(JSON.stringify(arr));
        let pointArr = [];
        let index = 0;

        function forEachArr(arr, height) {
          arr.forEach((item, i) => {
            if (i === 0 || i === arr.length - 1) {
              let ellipsoid = viewer.scene.globe.ellipsoid;
              let cartographic = ellipsoid.cartesianToCartographic(item);
              let lat = Cesium.Math.toDegrees(cartographic.latitude);
              let lng = Cesium.Math.toDegrees(cartographic.longitude);
              // 确定label在左侧还是右侧
              let a;
              if (i === 0) {
                a = Cesium.Math.toDegrees(
                  ellipsoid.cartesianToCartographic(arr[arr.length - 1])
                    .longitude
                );
              } else {
                a = Cesium.Math.toDegrees(
                  ellipsoid.cartesianToCartographic(arr[0]).longitude
                );
              }
              let point = {
                id: `pointV${index}`,
                position: {
                  cartographicDegrees: [lng, lat, height]
                },
                point: {
                  color: {
                    rgba: [255, 250, 0, 255]
                  },
                  pixelSize: 6
                },
                label: {
                  fillColor: {
                    rgba: [255, 255, 0, 255]
                  },
                  font: "10pt Lucida Console",
                  horizontalOrigin: a > lng ? "RIGHT" : "LEFT",
                  style: "FILL",
                  text: `${height}`,
                  verticalOrigin: "TOP"
                }
              };
              pointArr.push(point);
              index += 1;
            }
          });
        }

        for (let i = 0; i < 5; i++) {
          forEachArr(cloneArr, height * (i / 4));
        }
        return pointArr;
      }

      let points = drawPoints(this.cutoutPosition);

      let cutoutPolygonCzml = [
        {
          id: "document",
          name: "CZML Polygon - Interpolating References",
          version: "1.0"
        }
        // 绘制剖面
        // {
        //   "id": `wall-${Date.now()}`,
        //   // "availability":"2012-08-04T16:00:00Z/2012-08-04T16:05:00Z",
        //   "wall": {
        //     "positions": {
        //       "cartographicDegrees": positionArr
        //     },
        //     "perPositionHeight" : true,
        //     "material": {
        //       "solidColor": {
        //         "color": {
        //           "rgba" : [255, 255, 255, 50]
        //         }
        //       }
        //     }
        //   }
        // }
      ];

      // 添加剖面至czml
      cutoutPolygonCzml = cutoutPolygonCzml.concat(walls);

      // 添加折线和点至czml
      cutoutPolygonCzml = cutoutPolygonCzml.concat(polylines);
      cutoutPolygonCzml = cutoutPolygonCzml.concat(points);
      // console.log('cutoutPolygonCzml', cutoutPolygonCzml)
      let dataSources = new Cesium.CzmlDataSource();
      let cutoutPolygon = viewer.dataSources.add(
        dataSources.load(cutoutPolygonCzml)
      );
      cutoutPolygon.then(dataSource => {
        this.cutoutPolygonDatasource = dataSource;
        testArr.forEach(item => {
          dataSource.entities.add(item);
        });
        // console.log('indexOf:', viewer.dataSources.indexOf(this.cutoutPolygonDatasource))
      });
      viewer.zoomTo(cutoutPolygon);
      // this.$emit('hiddenImage')
      // console.log('绘制完成')
    },

    // 计算canvas宽度
    getCanvasWidth({ point1, point2 }) {
      // const westLon = 73 // 西经
      // const eastLon = 135 // 东经
      // const northLan = 54.2 // 北纬边界值
      // const southLan = 12.2 // 南纬

      // let x1=123  //裁剪的西经
      // let x2=133 //裁剪的东经
      // let y1=44.2 //裁剪的北纬
      // let y2=34.2 //裁剪的南纬

      let point3 = {
        lng: 0,
        lat: 0
      };

      let point1Location = {
        left: true,
        top: true
      };
      if (point1.lng < point2.lng) {
        // 在左
        point1Location.left = true;
      } else {
        // 在右
        point1Location.left = false;
      }
      // 纬度对比 => 判断出上下
      if (point1[1] > point2[1]) {
        // 在上
        point1Location.top = true;
      } else {
        // 在下
        point1Location.top = false;
      }
      // point1到point3
      let a = 0;
      // point1到point3
      let b = 0;
      // canvas宽度
      let c = 0;

      // point1位于左上角的位置
      if (point1Location.left && point1Location.top) {
        point3 = {
          lng: point2.lng,
          lat: point1.lat
        };
        a = Math.abs(point3.lng - point1.lng) * 100;
        b = Math.abs(point3.lat - point2.lat) * 100;
      } else if (point1Location.left && !point1Location.top) {
        // point1位于左下角的位置
        point3 = {
          lng: point1.lng,
          lat: point2.lat
        };
        a = Math.abs(point3.lat - point1.lat) * 100;
        b = Math.abs(point2.lng - point3.lng) * 100;
      } else if (!point1Location.left && point1Location.top) {
        // point1位于右上角的位置
        point3 = {
          lng: point2.lng,
          lat: point1.lat
        };
        a = Math.abs(point1.lng - point3.lng) * 100;
        b = Math.abs(point3.lat - point2.lat) * 100;
      } else {
        // point1位于右下角的位置
        point3 = {
          lng: point2.lng,
          lat: point1.lat
        };
        a = Math.abs(point3.lng - point1.lng) * 100;
        b = Math.abs(point2.lat - point3.lat) * 100;
      }

      c = Math.sqrt(a * a + b * b);
      return c;
    },
  },
  // eslint-disable-next-line vue/order-in-components
  destroyed() {
    // console.log('销毁组件啦123')
    // console.log('销毁组件啦123')
    // clearInterval(this.timer)
    // viewer = null
  }
}
</script>

<style lang="scss">
.china-2d-component {
  height: 100%;
  #china {
    height: 100vh;
  }
  .mobile-aside-swict {
    position: fixed;
    top: 8px;
    left: 45px;
    width: 27px;
    height: 27px;
    line-height: 27px;
    border: 1px solid rgba(68,68,68,1);
    text-align: center;
    background: rgba(48,51,54,1);
    i {
      font-size: 18px;
      color: white;
    }
  }
  .toolbars-section {
    position: fixed;
    top: 50px;
    left: 8px;
    font-size: 14px;
    .toolbars-item {
      .toolbars-item-title {
        font-size: 14px;
        font-weight: normal;
        // color: #008ec9;
        color: #12d5e8;
      }
      .toolbars-item-content {
        padding: 5px 10px;
        margin-top: 5px;
        border: 1px solid rgba(68, 68, 68, 0.8);
        background: rgba(48, 51, 54, 0.4);
        // border-radius: 10px;
        .son-item {
          .content {
            display: flex;
            span {
              text-align: center;
              /*background: white;*/
              cursor: pointer;

              .iconfont {
                font-size: 20px;
                color: white;
              }
            }

            span + span {
              margin-left: 10px;
            }
            }
        }

        .title {
          font-size: 12px;
          font-weight: normal;
          color: white;
        }
      }
      .el-date-editor {
        i {
          color: white;
        }
        .el-input__inner {
          height: 34px;
          padding-right: 10px;
          color: white;
          border: 1px solid rgba(68, 68, 68, 0.8);
          background: rgba(48, 51, 54, 0.4);
          border-radius: 0;
          // background: none;
          &::placeholder {
            color: #dfdfdf;
          }
        }
      }
    }
    .toolbars-item + .toolbars-item {
      margin-top: 10px;
    }
  }
  .color-line-img {
    position: fixed;
    right: 10px;
    bottom: 10px;
    width: 300px;
    padding: 5px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.1);
    z-index: 1;
  }
  .cesium-viewer-fullscreenContainer {
    position: absolute;
    top: 8px;
    left: 8px;
  }
  .real-time-coordinates {
    position: fixed;
    top: 50px;
    right: 10px;
    font-size: 12px;
    line-height: 1.5;
    color: #29ce00;
    // background: rgba(0, 0, 0, 0.5);
  }
  #heatmap {
    width: 500px;
    height: 500px;
  }
}
@media screen and (max-width: 1100px) {
  .china-2d-component {
    .toolbars-section {
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      transform: translateX(-100vw);
      transition: all 0.3s;
      .toolbars-section-box {
        padding-top: 50px;
        padding-left: 8px;
        width: 130px;
      }
    }
    .toolbars-section-mobile {
      transform: translateX(0);
    }
  }
}
</style>
