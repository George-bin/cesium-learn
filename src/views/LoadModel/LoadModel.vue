<template>
  <div class="load-model-component">
    <div id="cesiumContainer" style="height: 100vh;"></div>
    <!-- 实时坐标 -->
    <div class="real-time-coordinates">
      <span>经度: {{realTimeCoordinates.lng}}</span>
      <span>纬度: {{realTimeCoordinates.lat}}</span>
      <span>视高: {{realTimeCoordinates.height}}米</span>
    </div>

    <!-- 相机操作 -->
    <section class="options-operation">
      <!-- 飞行到指定区域 -->
      <div class="select-options">
        <el-select
          v-model="activeOptions"
          placeholder="select options"
          size="small"
          style="width: 100%"
          @change="handleChangeOptions"
        >
          <el-option
            v-for="(item, index) in optionsArr"
            :key="index"
            :label="item.label"
            :value="item.value"
          >{{item.label}}</el-option>
        </el-select>
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
      // 实时坐标
      realTimeCoordinates: {
        lng: 0,
        lat: 0,
        height: 0
      },
      activeOptions: "other",
      optionsArr: [
        {
          value: "Czml",
          label: "Czml"
        },
        {
          value: "Model",
          label: "Model"
        },
        {
          value: "GeoJson Default",
          label: "GeoJson Default"
        },
        {
          value: "GeoJson Basic",
          label: "GeoJson Basic"
        },
        {
          value: "GeoJson Custom",
          label: "GeoJson Custom"
        },
        {
          value: "other",
          label: "其他"
        }
      ]
    };
  },
  computed: {},
  watch: {},
  created() {
    window.camera = null;
    window.viewer = null;
  },
  mounted() {
    this.initCesium();
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
    // 创建实体
    createEntity() {},
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
    handleChangeOptions(value) {
      viewer.trackedEntity = undefined;
      viewer.dataSources.removeAll();
      switch (value) {
        case "Czml":
          this.loadCzmlModel();
          break;
        case "Model":
          this.loadModel();
          break;
        case "GeoJson Default":
          this.loadGeoJsonDefaultModel();
          break;
        case "GeoJson Basic":
          this.loadGeoJsonBasicModel();
          break;
        case "GeoJson Custom":
          this.loadGeoJsonCustomModel();
          break;
        default:
          return undefined;
      }
    },
    // 加载Czml 3D模型
    loadCzmlModel() {
      let dataSourcePromise = Cesium.CzmlDataSource.load(
        "../../../static/models/SampleData/simple.czml"
      );
      viewer.dataSources.add(dataSourcePromise);
    },
    // 加载3D模型
    loadModel() {
      let modelCzml = [
        {
          id: "document",
          name: "CZML Model",
          version: "1.0"
        },
        {
          id: "aircraft model",
          name: "Cesium Air",
          position: {
            cartographicDegrees: [-77, 37, 0]
          },
          model: {
            gltf:
              "../../../static/models/SampleData/models/CesiumMilkTruck/CesiumMilkTruck.glb"
          }
        }
      ];
      let dataSourcePromise = Cesium.CzmlDataSource.load(modelCzml);
      viewer.dataSources.add(dataSourcePromise).then(function(dataSource) {
        viewer.trackedEntity = dataSource.entities.getById("aircraft model");
      });
    },
    // 加载GeoJson 3D模型
    loadGeoJsonDefaultModel() {
      let geoJson = Cesium.GeoJsonDataSource.load(
        "../../../static/models/SampleData/ne_10m_us_states.topojson"
      );
      viewer.dataSources.add(geoJson);
    },
    loadGeoJsonBasicModel() {
      let geoJson = Cesium.GeoJsonDataSource.load(
        "../../../static/models/SampleData/ne_10m_us_states.topojson",
        {
          stroke: Cesium.Color.HOTPINK,
          fill: Cesium.Color.PINK.withAlpha(0.5),
          strokeWidth: 3
        }
      );
      viewer.dataSources.add(geoJson);
    },
    loadGeoJsonCustomModel() {
      let geoJsonPromise = Cesium.GeoJsonDataSource.load(
        "../../../static/models/SampleData/ne_10m_us_states.topojson"
      );
      geoJsonPromise.then(function(dataSource) {
        viewer.dataSources.add(dataSource);
        let entities = dataSource.entities.values;
        console.log("entities", entities);
        let colorHash = {};
        // 自定义实体外观
        for (let i = 0, len = entities.length; i < len; i++) {
          let entity = entities[i];
          if (Cesium.defined(entity.polygon)) {
            let name = entity.name;
            let color = colorHash[name];
            if (!color) {
              color = Cesium.Color.fromRandom({
                alpha: 1.0
              });
              colorHash[name] = color;
            }
            // console.log("color", color)

            //Set the polygon material to our random color.
            entity.polygon.material = color;
            //Remove the outlines.
            entity.polygon.outline = false;

            //Extrude the polygon based on the state's population.  Each entity
            //stores the properties for the GeoJSON feature it was created from
            //Since the population is a huge number, we divide by 50.
            entity.polygon.extrudedHeight = entity.properties.Population / 50.0;

            let description = `
              <p>
                <span>人口数量:</span>
                <span>${entity.properties.Population}人</span>
              </p>
            `;
            entity.description = description;
          }
        }
      });
    }
  }
};
</script>

<style lang="scss">
.load-model-component {
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
  .options-operation {
    position: fixed;
    top: 10px;
    left: 10px;
    width: 240px;
    .select-options {
    }
  }
}
</style>
