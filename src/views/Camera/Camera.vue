<template>
  <div class="camera-component">
    <div id="cesiumContainer" style="height: 100vh;"></div>
  </div>
</template>

<script>
export default {
  name: "",
  props: {},
  components: {},
  data() {
    return {
      startMousePosition: "",
      mousePosition: "",
      flags: {
        rotateLeft: false,
        rotateRight: false,
        moveUp: false,
        moveDown: false,
        moveLeft: false,
        moveRight: false
      }
    };
  },
  computed: {},
  watch: {},
  created() {
    window.viewer = null;
  },
  mounted() {
    this.initCesium();
    this.createEntity();
    this.initCesiumCamera();
    this.initKeyboardEvent();
  },
  methods: {
    initCesium() {
      window.viewer = new Cesium.Viewer("cesiumContainer", {
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
    },
    // 初始化cesium鼠标事件
    initCesiumMouseEvent() {
      let self = this;
      let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(function(click) {
        console.log("左键单击事件：", click);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    // 初始化相机
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
    // 创建实体
    createEntity() {},
    // 相机围绕屏幕中心店坐标转换视角
    flyToPosition() {
      var result = viewer.camera.pickEllipsoid(
        new Cesium.Cartesian2(
          viewer.canvas.clientWidth / 2,
          viewer.canvas.clientHeight / 2
        )
      );
      var curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(result);
      var lon = (curPosition.longitude * 180) / Math.PI;
      var lat = (curPosition.latitude * 180) / Math.PI;
      var height = viewer.scene.globe.ellipsoid.cartesianToCartographic(
        viewer.camera.position
      ).height;

      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, height),
        orientation: {
          heading: 0, // 方向
          pitch: Cesium.Math.toRadians(-90), // 倾斜角度
          roll: 0
        }
      });
    },
    // 初始化键盘事件
    initKeyboardEvent() {
      let self = this;
      let scene = viewer.scene;
      let canvas = viewer.canvas;
      canvas.setAttribute("tabindex", "0"); // needed to put focus on the canvas
      canvas.onclick = function() {
        canvas.focus();
      };
      let ellipsoid = viewer.scene.globe.ellipsoid;

      // 禁用默认相机控制事件
      scene.screenSpaceCameraController.enableRotate = false; // 旋转相机
      scene.screenSpaceCameraController.enableTranslate = false; // 平移相机
      scene.screenSpaceCameraController.enableZoom = false; // 相机缩放
      scene.screenSpaceCameraController.enableTilt = false; // 倾斜相机
      scene.screenSpaceCameraController.enableLook = false; // 自由视角

      document.addEventListener(
        "keydown",
        function(e) {
          var flagName = self.getFlagForKeyCode(e.keyCode);
          if (typeof flagName !== "undefined") {
            self.flags[flagName] = true;
          }
        },
        false
      );

      document.addEventListener(
        "keyup",
        function(e) {
          var flagName = self.getFlagForKeyCode(e.keyCode);
          if (typeof flagName !== "undefined") {
            self.flags[flagName] = false;
          }
        },
        false
      );
      // 更新相机（每当调用时间轴时触发）
      viewer.clock.onTick.addEventListener(function(clock) {
        var camera = viewer.camera;

        var cameraHeight = ellipsoid.cartesianToCartographic(camera.position)
          .height;
        var moveRate = cameraHeight / 100.0;

        if (self.flags.rotateLeft) {
          camera.rotateLeft(0.01);
        }
        if (self.flags.rotateRight) {
          camera.rotateRight(0.01);
        }
        if (self.flags.moveUp) {
          camera.moveUp(moveRate);
        }
        if (self.flags.moveDown) {
          camera.moveDown(moveRate);
        }
        if (self.flags.moveLeft) {
          camera.moveLeft(moveRate);
        }
        if (self.flags.moveRight) {
          camera.moveRight(moveRate);
        }
      });
    },
    // 获取按键的值
    getFlagForKeyCode(keyCode) {
      console.log('keyCode:', keyCode)
      switch (keyCode) {
        // w
        case 87:
          return "moveUp";
        case "S".charCodeAt(0):
          return "moveDown";
        case "D".charCodeAt(0):
          return "moveRight";
        case "A".charCodeAt(0):
          return "moveLeft";
        case "Q".charCodeAt(0):
          return "rotateLeft";
        case "E".charCodeAt(0):
          return "rotateRight";
        default:
          return undefined;
      }
    }
  }
};
</script>

<style lang="scss">
</style>
