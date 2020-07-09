<template>
  <div class="clock-component">
    <div id="cesiumContainer" style="height: 100vh;"></div>
    <!-- 实时坐标 -->
    <real-time-coordinates :realTimeCoordinates="realTimeCoordinates"></real-time-coordinates>
  </div>
</template>

<script>
export default {
  name: "",
  props: {},
  components: {
    RealTimeCoordinates: () => import('@/components/RealTimeCoordinates')
  },
  data() {
    return {
      realTimeCoordinates: {
        lng: 0,
        lat: 0,
        height: 0
      }
    };
  },
  computed: {},
  watch: {
  },
  created() {
    window.camera = null;
    window.viewer = null;
  },
  mounted() {
    this.initCesium();
    this.initCesiumClock();
    this.createEntity();
    // this.initCesiumCamera();
    this.initCesiumMouseEvent();
  },
  methods: {
    initCesium() {
      window.viewer = new Cesium.Viewer("cesiumContainer", {
        // 是否创建动画小器件，左下角仪表
        animation: true,
        // 是否显示时间轴
        timeline: true,
        // 是否显示右上角的帮助按钮
        navigationHelpButton: false,
        // 是否显示图层选择器
        baseLayerPicker: false,
        // 地球表面贴图
        imageryProvider: new Cesium.UrlTemplateImageryProvider({
          url:
            "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
          maximumLevel: 30,
          minimumLevel: 3
        })
      });
      window.camera = viewer.scene.camera;
      console.log("世界坐标中的相机风向", camera.directionWC);

      // 去除版权信息
      window.viewer._cesiumWidget._creditContainer.style.display = "none";
      // 显示桢速
      window.viewer.scene.debugShowFramesPerSecond = true;

      // 代码控制animation和timeline控件
      // viewer.animation.container.style.visibility = 'hidden';
      // viewer.timeline.container.style.visibility = 'hidden';
      // viewer.timeline.container.style.visibility = 'visible';

      // 监听实体集合的变动
      viewer.entities.collectionChanged.addEventListener(function(
        collection,
        added,
        removed,
        changed
      ) {
        console.log("collection", collection);
        console.log("added", added);
        console.log("removed", removed);
        console.log("changed", changed);
      });

      // home键
      viewer.homeButton.viewModel.command.beforeExecute.addEventListener(e => {
        this.pitch = -90;
        e.cancel = true;
        viewer.scene.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(111.012, 35.02, 5000),
          orientation: {
            heading: Cesium.Math.toRadians(this.heading),
            pitch: Cesium.Math.toRadians(this.pitch),
            roll: Cesium.Math.toRadians(this.roll)
          },
          duration: 2,
          maximumHeight: 2000,
          pitchAdjustHeight: 2000,
          endTransform: Cesium.Matrix4.IDENTITY
        });
      });

      // 监听视角变化
      // camera.changed.addEventListener(function(event) {
      //   console.log('视角变化', event)
      // });
    },
    // 初始化相机位置
    initCesiumCamera() {
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(90, 30, 500000),
        orientation: {
          heading: 0.0,
          pitch: -Cesium.Math.PI_OVER_TWO,
          roll: 0.0
        }
      });
    },
    // 初始化Cesium clock
    initCesiumClock() {
      let date = new Date();
      //可返回格林威治时间和本地时间之间的时差
      let h = 0 - date.getTimezoneOffset();
      viewer.animation.viewModel.timeFormatter = function(date, viewModel) {
        //重新构造一个当前系统时间的儒略日
        let dateZone = Cesium.JulianDate.addMinutes(date,h,new Cesium.JulianDate());
        let gregorianDate = Cesium.JulianDate.toGregorianDate(dateZone);
        let millisecond = Math.round(gregorianDate.millisecond );
        //倍速是否小于1，小于1则显示毫秒级
        if(Math.abs(viewModel._clockViewModel.multiplier) < 1){
          return Cesium.sprintf("%02d:%02d:%02d.%03d",gregorianDate.hour,gregorianDate.minute,gregorianDate.second,gregorianDate.millisecond);
        }
        return Cesium.sprintf("%02d:%02d:%02d",gregorianDate.hour,gregorianDate.minute,gregorianDate.second);
      }

       //设置日期
      viewer.animation.viewModel.dateFormatter = function(date, viewModel) {
        let dateZone = Cesium.JulianDate.addMinutes(date,h,new Cesium.JulianDate());
        let gregorianDate = Cesium.JulianDate.toGregorianDate(dateZone);
        //设置格式为xx/xx/xx，格式可自定义为任意你想要的
        return Cesium.sprintf("%4d/%02d/%02d",gregorianDate.year,gregorianDate.month,gregorianDate.day);
      }
    },
    // 初始化鼠标事件
    initCesiumMouseEvent() {
      // 处理用户输入事件
      let mouseDrawEventHandler = new Cesium.ScreenSpaceEventHandler(
        viewer.scene.canvas
      );
      mouseDrawEventHandler.setInputAction(function(click) {
        console.log("左键单击事件：", click);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      mouseDrawEventHandler.setInputAction(movement => {
        // console.log('鼠标移动', movement)
        // 选择球体上的一个坐标
        let cartesian = viewer.scene.camera.pickEllipsoid(
          movement.endPosition,
          viewer.scene.globe.ellipsoid
        );

        // 鼠标实时位置
        if (cartesian) {
          let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(
            cartesian
          );
          let lat = Cesium.Math.toDegrees(cartographic.latitude);
          let lng = Cesium.Math.toDegrees(cartographic.longitude);
          // let height = cartographic.height;
          this.realTimeCoordinates = {
            lng: lng.toFixed(5),
            lat: lat.toFixed(5),
            height: Math.ceil(camera.positionCartographic.height)
          };
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },
    // 初始化Cesium指北针
    initCesiumNavigation() {
      let options = {};
      // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
      options.defaultResetView = Cesium.Rectangle.fromDegrees(80, 22, 130, 50);
      // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
      options.enableCompass = true;
      // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
      options.enableZoomControls = false;
      // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
      options.enableDistanceLegend = false;
      // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
      options.enableCompassOuterRing = true;
      CesiumNavigation(viewer, options);
    },
    // 创建实体
    createEntity() {}
  }
};
</script>

<style lang="scss">
.clock-component {
  // 全屏按钮
  .cesium-viewer-fullscreenContainer {
    display: none !important;
    // right: 8px;
    // top: 8px;
  }
}
</style>
