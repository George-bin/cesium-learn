<template>
  <div class="two-dimension-main-component">
    <!--鼠标在地球上的实时坐标-->
    <!-- <div v-if="realTimeCoordinates.lng" class="real-time-coordinates">
      <p>经度: {{ realTimeCoordinates.lng.toFixed(2) }} 纬度: {{ realTimeCoordinates.lat.toFixed(2) }}</p>
    </div> -->
    <div v-show="false" id="heatmap" />
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { gis } from '@/config/'
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ["fileName"],
  data() {
    return {
      // viewer: this.cesium,
      point1: "116.06,39.42",
      point2: "116.96,40.42",
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
      // 三维坐标系datasource
      d3CoordinateSystemDatasource: null,
      // 动画面板
      animationPolygonDatasource: null,
      // 执行时间
      executeSeconds: 0,
      // stop: 停止 starting: 播放中
      animationStatus: "",
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
      // 是否绘制三维坐标系
      isDraw3DCoordinateSystem: false,
      // 截取的坐标
      cutoutPosition: [],
      cutoutPolygonDatasource: null,
      // 当前选定实体集合
      activeEntityCollection: null,
      // 实时坐标
      realTimeCoordinates: {
        lng: "",
        lat: "",
        alt: ""
      },
      // 图层datasource
      coverageDatasource: null,
      // 图层坐标
      drawCoverageCoordinate: null,
      isShowCoverage: false,
      // 材质数组
      cutoutWallMaterialArr: [],
      // 局部分析
      isLocalAnalysis: false,
      initCameraData: {
        lon: "",
        lat: "",
        height: "",
        heading: "",
        pitch: ""
      }
    };
  },
  watch: {
    animationStatus: function(val, oldVal) {
      this.$emit("dataSync", {
        key: "animationStatus",
        value: val
      });
    },
    coordinateSystemDatasource: function(val, oldVal) {
      this.$emit("dataSync", {
        key: "coordinateSystemDatasource",
        value: val
      });
    },
    isShowCoverage: function(val, oldVal) {
      this.$emit("dataSync", {
        key: "isShowCoverage",
        value: val
      });
    },
    isCutout: function(val, oldVal) {
      this.$emit("dataSync", {
        key: "isCutout",
        value: val
      });
    },
    activeEntityCollection: function(val, oldVal) {
      this.$emit("dataSync", {
        key: "activeEntityCollection",
        value: val
      });
    },
    isDrawCoordinateSystem: function(val, oldVal) {
      this.$emit("dataSync", {
        key: "isDrawCoordinateSystem",
        value: val
      });
    },
    isLocalAnalysis: function(val, oldVal) {
      this.$emit("dataSync", {
        key: "isLocalAnalysis",
        value: val
      });
    },
    d3CoordinateSystemDatasource: function(val, oldVal) {
      this.$emit("dataSync", {
        key: "d3CoordinateSystemDatasource",
        value: val
      });
    },
    isDraw3DCoordinateSystem: function(val, oldVal) {
      this.$emit("dataSync", {
        key: "isDraw3DCoordinateSystem",
        value: val
      });
    }
  },
  mounted() {
    // this.init()
    // 鼠标事件
    this.onMouseEvent();
    // 设置相机位置
    // const point = Cesium.Cartesian3.fromDegrees(117.46, 37.42, 200000.0)
    // viewer.camera.setView({
    //   destination: point,
    //   orientation: {
    //     heading: Cesium.Math.toRadians(-10.0),
    //     pitch: Cesium.Math.toRadians(-40),
    //     roll: 0.0
    //   }
    // })
    this.$nextTick(() => {
      // 动画
      this.$on("playRealtimeViewModel", () => {
        this.playRealtimeViewModel();
      });
      this.$on("stopRealtimeViewModel", () => {
        this.stopRealtimeViewModel();
      });
      this.$on("restRealtimeViewModel", () => {
        this.restRealtimeViewModel();
      });
      // 绘制坐标系
      this.$on("handleDrawCoordinateSystem", () => {
        this.handleDrawCoordinateSystem();
      });
      // 绘制三维坐标系
      this.$on("handleDraw3DCoordinateSystem", () => {
        this.handleDraw3DCoordinateSystem();
      });
      // 绘制剖面
      this.$on("handleCutoutPolygon", () => {
        this.handleCutoutPolygon();
      });
      // 显示20层图层
      this.$on("handleToggleShow", () => {
        this.handleToggleShow();
      });
      // 取消绘制
      this.$on("handleCancelDraw", () => {
        if (this.isCutout || this.isDrawCoordinateSystem) {
          this.mouseDrawEventHandler && this.mouseDrawEventHandler.destroy();
          viewer.entities.remove(viewer.entities.getById("cutoutPolyline"));
          // 重新设置鼠标事件对象
          this.onMouseEvent();
        }
      });
      // 局部分析
      this.$on("handleLocalAnalysis", () => {
        this.handleLocalAnalysis();
      });
    });
  },
  methods: {
    ...mapActions(["GetLineData"]),
    ...mapMutations(["SET_INIT_CAMERA_HEIGHT"]),
    init() {
      /*eslint-disable*/
      // 设置静态资源目录
      // buildModuleUrl.setBaseUrl('../../../static/Cesium/')
      viewer = new Cesium.Viewer("china", {
        shouldAnimate: false,
        navigationHelpButton: false, // 是否显示帮助信息控件
        animation: false, //不创建动画控件
        timeline: false, //不创建时间线控件
        fullscreenButton: false, // 是否显示全屏按钮
        sceneModePicker: false, // 2D/3D切换
        baseLayerPicker: false, // 选择图层控件
        imageryProvider: Cesium.createOpenStreetMapImageryProvider({
          url:
            "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}"
        })
        // imageryProvider : new Cesium.UrlTemplateImageryProvider({
        //   url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
        //   layer: "tdtVecBasicLayer",
        //   style: "default",
        //   format: "image/jpeg",
        //   tileMatrixSetID: "GoogleMapsCompatible",
        //   show: false,
        //   maximumLevel: 13,
        //   minimumLevel: 3
        // })
      });
      // 去除版权信息
      viewer._cesiumWidget._creditContainer.style.display = "none";

      // 删除默认的影像图层
      // viewer.imageryLayers.remove(viewer.imageryLayers.get(0))

      // 增加谷歌影像底图
      // viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
      //   url: 'http://www.google.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}',
      //   tilingScheme: new Cesium.WebMercatorTilingScheme()})
      // )

      // 开启全球光照
      viewer.scene.globe.enableLighting = true;

      // Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(116.46, 39.92, 15000.0)

      viewer.homeButton.viewModel.command.beforeExecute.addEventListener(e => {
        e.cancel = true;
        //你要飞的位置
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(116.46, 39.92, 15000.0),
          orientation: {
            heading: 0.0,
            pitch: Cesium.Math.toRadians(-10),
            roll: 0.0
          }
        });
      });

      // 全国地图
      // viewer.entities.add({
      //   rectangle: {
      //     coordinates: Cesium.Rectangle.fromDegrees(73, 12.2, 135, 54.2),
      //     height: 0,
      //     material: new Cesium.ImageMaterialProperty({
      //       image: '../../../static/img/china.png',
      //       transparent: true, // 是否透明
      //       color: Cesium.Color.ALICEBLUE.withAlpha(0.5)
      //     })
      //   }
      // })
      viewer.clock.onTick.addEventListener(function(clock) {
        // console.log('啦啦啦')
      });
      viewer.clock.onStop.addEventListener(clock => {
        // console.log('动画停止啦')
        clearInterval(this.timer);
      });
    },
    // 局部分析（不创建动画面板）
    handleLocalAnalysis() {
      // console.log('局部分析')
      // 删除对应的canvas元素
      $("#heatmap .cut-wall").remove();
      $("#heatmap .coordinate-system-base-map").remove();
      this.isShowCoverage = false;
      viewer.dataSources.remove(this.coordinateSystemDatasource);
      viewer.dataSources.remove(this.animationPolygonDatasource);
      viewer.dataSources.remove(this.coverageDatasource);
      viewer.dataSources.remove(this.d3CoordinateSystemDatasource);
      this.coordinateSystemDatasource = null;
      this.animationPolygonDatasource = null;
      this.coverageDatasource = null;
      this.d3CoordinateSystemDatasource = null;
      this.animationStatus = "";
      // 绘制
      this.isLocalAnalysis = true;
      this.point1 = "122,40";
      this.point2 = "126,37";
      this.handleCreateCoordinateSystem();
      // 设置相机位置
      const point = Cesium.Cartesian3.fromDegrees(127, 30, 800000.0);
      viewer.camera.setView({
        destination: point,
        orientation: {
          heading: Cesium.Math.toRadians(-10.0),
          pitch: Cesium.Math.toRadians(-40),
          roll: 0.0
        }
      });
      this.$emit("hideBaseMap");
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
          gis.nginxFilePath + this.fileName + "/z.png",
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
            gis.nginxFilePath + this.fileName + "/row/row" + item.a.y + ".png",
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
            gis.nginxFilePath + this.fileName + "/col/col" + item.a.x + ".png",
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
              gis.nginxFilePath + this.fileName + "/z" + i + ".png",
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

    // 生成canvas图片
    createCanvasImage(className, startLocationX, startLocationY, cutoutWidth, cutoutHeight, width, height, imgSrc, bgColor) {
      return new Promise((resolve, reject) => {
        let container = document.getElementById("heatmap");
        let newCanvas = document.createElement("canvas");
        newCanvas.width = width;
        newCanvas.height = height;
        newCanvas.className = className;
        container.appendChild(newCanvas);
        let context = newCanvas.getContext("2d");
        context.fillStyle = bgColor;
        context.fillRect(0, 0, width, height);
        let image = new Image();
        image.setAttribute("crossorigin", "anonymous");
        image.src = imgSrc;
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
          );
          resolve(newCanvas);
        };
      });
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
              // this.cutoutWallMaterialArr.push(`http://47.95.129.34:9002/file/map/line/${response}`)
              console.log(
                "实时获取剖面数据========================",
                gis.nginxFilePath + this.fileName + "/line/" + response
              );
              this.cutoutWallMaterialArr.push(
                gis.nginxFilePath + this.fileName + "/line/" + response
              );
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
          this.$emit("hideBaseMap");
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

    // 开始绘制二维坐标系
    handleDrawCoordinateSystem() {
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

    // 开始绘制三维坐标系
    handleDraw3DCoordinateSystem() {
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
    },

    // 开始截取剖面
    handleCutoutPolygon() {
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
          // console.log('response=============', response)
          resolve(response);
        });
      });
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

    // 删除实体
    handleDeleteentitly() {
      if (!this.activeEntityCollection) return;
      this.activeEntityCollection.removeAll();
      this.activeEntityCollection = null;
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
    }
  },
  destroyed() {
    clearInterval(this.timer);
    // viewer = null
  }
};
</script>

<style lang="scss">
.two-dimension-main-component {
  /*height: calc(100vh - 60px);*/
  /*overflow: auto;*/
  #china {
    height: 100%;
  }

  .toolbars {
    position: fixed;
    top: 130px;
    right: 20px;

    .toolbars-item {
      .title {
        font-size: 18px;
        font-weight: normal;
        color: #cfb100;
      }

      .content {
        margin-top: 10px;
      }
    }

    .animation-section {
      .content {
        display: flex;

        span {
          width: 70px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background: white;
          cursor: pointer;
        }

        span + span {
          margin-left: 10px;
        }
      }
    }

    .draw-section {
      .content {
        display: flex;

        span {
          width: 110px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background: white;
          cursor: pointer;
        }

        span + span {
          margin-left: 10px;
        }
      }
    }

    .cut-out-polygon-manage {
      .content {
        display: flex;

        span {
          width: 110px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background: white;
          cursor: pointer;
        }

        span + span {
          margin-left: 10px;
        }
      }
    }

    .toolbars-item + .toolbars-item {
      margin-top: 10px;
    }
  }

  .real-time-coordinates {
    position: fixed;
    bottom: 8px;
    right: 40px;
    color: #29ce00;
    background: rgba(0, 0, 0, 0.5);
  }

  // .map-choose-point {
  //   position: fixed;
  //   /*top: */
  // }

  .create-coordinate-system {
    position: fixed;
    top: 220px;
    right: 20px;
  }

  .cesium-viewer-animationContainer,
  .cesium-viewer-timelineContainer {
    /*display: none;*/
  }

  .cesium-viewer-animationContainer {
    display: none;
  }

  // #heatmap {
  //   height: 5000px;
  // }
}
</style>
