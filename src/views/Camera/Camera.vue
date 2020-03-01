<template>
  <div class="camera-component">
    <div id="cesiumContainer" style="height: 100vh;"></div>
    <!-- 实时坐标 -->
    <div class="real-time-coordinates">
      <span>经度: {{realTimeCoordinates.lng}}</span>
      <span>纬度: {{realTimeCoordinates.lat}}</span>
      <span>视高: {{realTimeCoordinates.height}}米</span>
    </div>

    <!-- 相机操作 -->
    <section class="camera-operation">
      <!-- 飞行到指定区域 -->
      <div class="select-camera-position">
        <el-select
          v-model="cameraPosition"
          placeholder="Camera options"
          size="small"
          style="width: 100%"
          @change="handleChangeCameraOptions"
        >
          <el-option
            v-for="(item, index) in cameraPositionArr"
            :key="index"
            :label="item.label"
            :value="item.value"
          >{{item.label}}</el-option>
        </el-select>
      </div>
      <!-- 控制相机视角 -->
      <div class="control-camera-pres">
        <div class="control-camera-pres-item">
          <span class="label">heading</span>
          <input v-model="heading" type="range" :disabled="cameraPosition === 'other'" :min="-90" :max="90" />
          <span class="value">{{heading}}</span>
        </div>
        <div class="control-camera-pres-item">
          <span class="label">pitch</span>
          <input v-model="pitch" type="range" :disabled="cameraPosition === 'other'" :min="-90" :max="90" />
          <span class="value">{{pitch}}</span>
        </div>
        <div class="control-camera-pres-item">
          <span class="label">roll</span>
          <input v-model="roll" type="range" :disabled="cameraPosition === 'other'" :min="-90" :max="90" />
          <span class="value">{{roll}}</span>
        </div>
      </div>
    </section>
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
        moveForward: false,
        moveBackward: false,
        rotateLeft: false,
        rotateRight: false,
        moveUp: false,
        moveDown: false,
        moveLeft: false,
        moveRight: false
      },
      // 实时坐标
      realTimeCoordinates: {
        lng: 0,
        lat: 0,
        height: 0
      },
      cameraPosition: "other",
      cameraPositionArr: [
        {
          value: "setView",
          label: "setView"
        },
        {
          value: "flyTo Cartesian3",
          label: "flyTo by Cartesian3"
        },
        {
          value: "flyTo Rectangle",
          label: "flyTo by Rectangle"
        },
        {
          value: "lookAt",
          label: "lookAt"
        },
        {
          value: "从运城飞往北京",
          label: "从运城飞往北京"
        },
        {
          value: "绕点飞行",
          label: "绕点飞行"
        },
        {
          value: "other",
          label: "其他"
        }
      ],
      // 相机视角
      heading: 0, // 航向角
      pitch: 0, // 俯仰角
      roll: 0 // 横滚角
    };
  },
  computed: {},
  watch: {
    heading: function(val, oldval) {
      console.log("heading:", val);
      camera.setView({
        destination: camera.position,
        orientation: {
          heading: Cesium.Math.toRadians(val),
          pitch: Cesium.Math.toRadians(this.pitch),
          roll: Cesium.Math.toRadians(this.roll)
        }
      });
    },
    pitch: function(val, oldval) {
      console.log("pitch:", val);
      camera.setView({
        destination: camera.position,
        orientation: {
          heading: Cesium.Math.toRadians(this.heading),
          pitch: Cesium.Math.toRadians(val),
          roll: Cesium.Math.toRadians(this.roll)
        }
      });
    },
    roll: function(val, oldval) {
      console.log("roll:", val);
      camera.setView({
        destination: camera.position,
        orientation: {
          heading: Cesium.Math.toRadians(this.heading),
          pitch: Cesium.Math.toRadians(this.pitch),
          roll: Cesium.Math.toRadians(val)
        }
      });
    }
  },
  created() {
    window.camera = null;
    window.viewer = null;
  },
  mounted() {
    this.initCesium();
    this.createEntity();
    // this.initCesiumCamera();
    this.initCesiumMouseEvent();
    // this.initKeyboardEvent();
    this.setReferenceFrame();
    // this.computePointRotate();
  },
  methods: {
    initCesium() {
      window.viewer = new Cesium.Viewer("cesiumContainer", {
        // 是否创建动画小器件，左下角仪表
        animation: false,
        // 是否显示时间轴
        timeline: false,
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
    // 设置相机参考系
    setReferenceFrame() {
      let center = Cesium.Cartesian3.fromDegrees(111.012, 35.02);
      // 计算从以提供的原点为中心的东西方向的参考框架到提供的椭球的固定参考框架的4x4变换矩阵。
      // 局部坐标的z轴垂直于地表，局部坐标的y轴指向正北的4x4变换矩阵
      let transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);

      // View in east-north-up frame(东北向上)
      // camera.constrainedAxis = Cesium.Cartesian3.UNIT_Z;
      // 使用目标和变化矩阵来设置相机的位置和方向
      // camera.lookAtTransform(
      //   transform,
      //   new Cesium.Cartesian3(-120000.0, -120000.0, 120000.0)
      // );

      // Show reference frame.  Not required（显示坐标系）.
      // 绘制由矩阵定义的参考系的轴，该矩阵转换为世界坐标，即地球的WGS84坐标。
      let referenceFramePrimitive = viewer.scene.primitives.add(
        new Cesium.DebugModelMatrixPrimitive({
          modelMatrix: transform,
          length: 100000.0
        })
      );
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
    // 获取屏幕中心点坐标
    getScreenCenter() {
      let result = viewer.camera.pickEllipsoid(
        new Cesium.Cartesian2(
          viewer.canvas.clientWidth / 2,
          viewer.canvas.clientHeight / 2
        )
      );
      let curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(result);
      let lng = (curPosition.longitude * 180) / Math.PI;
      let lat = (curPosition.latitude * 180) / Math.PI;
      let height = viewer.scene.globe.ellipsoid.cartesianToCartographic(
        viewer.camera.position
      ).height;
      return {
        lng,
        lat,
        height
      };
    },
    // 初始化键盘事件（通过键盘控制相机视角）
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
        if (self.flags.moveBackward) {
          camera.moveBackward(moveRate);
        }
        if (self.flags.moveForward) {
          camera.moveForward(moveRate);
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
      // console.log('keyCode:', keyCode)
      switch (keyCode) {
        // w
        case 87:
          return "moveUp";
        // S
        case 83:
          return "moveDown";
        // D
        case 68:
          return "moveRight";
        // A
        case 65:
          return "moveLeft";
        // 左箭头
        case 37:
          return "rotateLeft";
        // 右箭头
        case 39:
          return "rotateRight";
        // 上箭头
        case 38:
          return "moveForward";
        // 下箭头
        case 40:
          return "moveBackward";
        default:
          return undefined;
      }
    },
    // 改变相机参数
    handleChangeCameraOptions(value) {
      // console.log(value)
      switch (value) {
        case "setView":
          this.cameraSetview();
          break;
        case "flyTo Cartesian3":
          this.flyToACity();
          break;
        case "flyTo Rectangle":
          this.flyToACityByRectangle();
          break;
        case "lookAt":
          this.cameraLookAt();
          break;
        case "从运城飞往北京":
          this.twoSidesFly();
          break;
        case "绕点飞行":
          this.flyAroundPoint();
          break;
        default:
          return undefined;
      }
    },
    // 设置相机视角setView
    cameraSetview() {
      this.pitch = -90;
      camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(111.012, 35.02, 250000),
        orientation: {
          heading: Cesium.Math.toRadians(this.heading),
          pitch: Cesium.Math.toRadians(this.pitch),
          roll: Cesium.Math.toRadians(this.roll)
        }
      });
    },
    // 飞到一个城市
    flyToACity() {
      this.pitch = -90;
      camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(111.012, 35.02, 250000),
        orientation: {
          heading: Cesium.Math.toRadians(this.heading),
          pitch: Cesium.Math.toRadians(this.pitch),
          roll: Cesium.Math.toRadians(this.roll)
        },
        duration: 3,
        complete: function() {
          console.log("飞到指定位置 Cartesian3");
        },
        cancle: function() {
          console.log("取消飞行 Cartesian3");
        },
        pitchAdjustHeight: -90, // 如果摄像机飞越高于该值，则调整俯仰俯仰的俯仰角度，并将地球保持在视口中。
        maximumHeight: 5000, // 相机最大飞行高度
        flyOverLongitude: 100 // 如果到达目的地有2种方式，设置具体值后会强制选择方向飞过这个经度(这个，很好用)
      });
    },
    // 飞到指定城市by rectangle
    flyToACityByRectangle() {
      camera.flyTo({
        destination: Cesium.Rectangle.fromDegrees(110, 35.7, 111.5, 34.8),
        orientation: {
          heading: 0,
          pitch: Cesium.Math.toRadians(-90),
          roll: 0
        },
        complete: function() {
          console.log("飞到指定位置 Rectangle");
        }
      });
    },
    // 指定相机视角范围的中心点
    cameraLookAt() {
      let center = Cesium.Cartesian3.fromDegrees(111.012, 35.02); // 中心点坐标
      let heading = 0;
      let pitch = Cesium.Math.toRadians(-90.0);
      let range = 5000.0; // 距离中心点的距离
      camera.lookAt(
        center,
        new Cesium.HeadingPitchRange(heading, pitch, range)
      );
    },
    // 在两地之间飞行
    twoSidesFly() {
      this.pitch = -90;
      camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(111.012, 35.02, 5000),
        orientation: {
          heading: Cesium.Math.toRadians(this.heading),
          pitch: Cesium.Math.toRadians(this.pitch),
          roll: Cesium.Math.toRadians(this.roll)
        }
      });
      setTimeout(() => {
        camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(116.39, 39.89, 90000),
          orientation: {
            heading: Cesium.Math.toRadians(this.heading),
            pitch: Cesium.Math.toRadians(this.pitch),
            roll: Cesium.Math.toRadians(this.roll)
          },
          duration: 20,
          complete: function() {
            console.log("抵达目的地!");
          }
        });
      }, 1000);
    },
    // 绕点飞行
    flyAroundPoint() {
      let options = {
        lng: 117.1423291616,
        lat: 39.0645831633,
        height: 15.8,
        heading: 0.0,
        pitch: 0.0,
        roll: 0.0
      };
      let position = Cesium.Cartesian3.fromDegrees(
        options.lng,
        options.lat,
        options.height
      );
      // 相机看点的角度，如果大于0那么则是从地底往上看，所以要为负值，这里取-30度
      let pitch = Cesium.Math.toRadians(-30);
      // 给定飞行一周所需时间，比如10s, 那么每秒转动度数
      let angle = 360 / 30;
      // 给定相机距离点多少距离飞行，这里取值为5000m
      let distance = 5000;
      let startTime = Cesium.JulianDate.fromDate(new Date());
      var stopTime = Cesium.JulianDate.addSeconds(startTime, 10, new Cesium.JulianDate());

      viewer.clock.startTime = startTime.clone(); // 开始时间
      viewer.clock.stopTime = stopTime.clone();     // 结速时间
      viewer.clock.currentTime = startTime.clone(); // 当前时间
      viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; // 行为方式
      viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK; // 时钟设置为当前系统时间; 忽略所有其他设置。
      // 相机的当前heading
      let initialHeading = viewer.camera.heading;
      let Exection = function TimeExecution() {
        // 当前已经过去的时间，单位s
        let delTime = Cesium.JulianDate.secondsDifference(
          viewer.clock.currentTime,
          viewer.clock.startTime
        );
        let heading = Cesium.Math.toRadians(delTime * angle) + initialHeading;
        viewer.scene.camera.setView({
          destination: position, // 点的坐标
          orientation: {
            heading: heading,
            pitch: pitch
          }
        });
        viewer.scene.camera.moveBackward(distance);

        if (
          Cesium.JulianDate.compare(
            viewer.clock.currentTime,
            viewer.clock.stopTime
          ) >= 0
        ) {
          viewer.clock.onTick.removeEventListener(Exection);
        }
      };

      viewer.clock.onTick.addEventListener(Exection);
    },
    // 计算一个点旋转坐标后的值
    computePointRotate() {
      // 转成弧度
      let rotate = Cesium.Math.toRadians(90);
      // quat为围绕这个z轴旋转d度的四元数
      let quat = Cesium.Quaternion.fromAxisAngle(
        Cesium.Cartesian3.UNIT_Z,
        rotate
      );
      // rot_mat3为根据四元数求得的旋转矩阵
      let rot_mat3 = Cesium.Matrix3.fromQuaternion(quat);
      // p1的局部坐标
      let v = new Cesium.Cartesian3(200, 300, 50000);
      // m为旋转加平移的4x4变换矩阵，这里平移为(0,0,0)，故填个Cesium.Cartesian3.ZERO
      let m = Cesium.Matrix4.fromRotationTranslation(
        rot_mat3,
        Cesium.Cartesian3.ZERO
      );
      // m = m X v
      m = Cesium.Matrix4.multiplyByTranslation(m, v);
      // 得到局部坐标原点的全局坐标
      let cart3 = ellipsoid.cartographicToCartesian(
        Cesium.Cartographic.fromDegrees(111.012, 35.02, 250000)
      );
      // m1为局部坐标的z轴垂直于地表，局部坐标的y轴指向正北的4x4变换矩阵
      let m1 = Cesium.Transforms.eastNorthUpToFixedFrame(cart3);
      // m = m X m1
      m = Cesium.Matrix4.multiplyTransformation(m, m1);
      // 根据最终变换矩阵m得到p2
      let p2 = Cesium.Matrix4.getTranslation(m);
      console.log("x=" + p2.x + ",y=" + p2.y + ",z=" + p2.z);
    }
  }
};
</script>

<style lang="scss">
.camera-component {
  // 全屏按钮
  .cesium-viewer-fullscreenContainer {
    right: 8px;
    bottom: 8px;
  }
  // 实时坐标
  .real-time-coordinates {
    position: fixed;
    bottom: 10px;
    left: 10px;
    display: flex;
    color: #b1a400;
    span {
      padding-right: 8px;
    }
    span + span {
      padding-left: 8px;
      border-left: 2px solid #dfdfdf;
    }
  }
  // 相机控制
  .camera-operation {
    position: fixed;
    top: 10px;
    left: 10px;
    width: 240px;
    .select-camera-position {
    }
    // 控制相机视角
    .control-camera-pres {
      padding: 10px;
      margin-top: 10px;
      color: white;
      background: rgba(68, 68, 68, 0.4);
      border-radius: 4px;
      .control-camera-pres-item {
        display: flex;
        align-items: center;
        height: 34px;;
        span {
          width: 55px;
          font-size: 10px;
        }
        .value {
          width: 36px;
          height: 24px;
          line-height: 30px;
          margin-left: 10px;
          border: 1px solid #444;
          text-align: center;
          color: #edffff;
          background: #303336;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
