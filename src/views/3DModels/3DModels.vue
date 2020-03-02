<template>
  <div class="d3-models-component">
    <div id="cesiumContainer" style="height: 100vh;"></div>
    <!-- 实时坐标 -->
    <real-time-coordinates :realTimeCoordinates="realTimeCoordinates"></real-time-coordinates>

    <!-- 绘制实体 -->
    <div class="set-section">
      <!-- 地图选择 -->
      <div class="layer-manage">
        <p class="label">影像图层</p>
        <p class="layer-list">
          <span
            v-for="(layer, i) in layersManage.layers"
            :key="i"
            :style="{
              border: layersManage.activeLayer === layer.value ? '1px solid #38f' : '' ,
              backgroundColor: layersManage.activeLayer === layer.value ? 'rgba(51, 136, 255, 0.4)' : ''
            }"
            class="layer-item"
            @click="handleClickSwitchLayers(layer)"
          >{{layer.label}}</span>
        </p>
      </div>
      <div class="model-control">
        <!-- 控制模型显示 -->
        <div class="model-control-item select-model">
          <p class="label">Model</p>
          <select
            v-model="activeModel"
            class="cesium-select"
            @change="handleChangeSelectModel">
            <option v-for="(item, index) in modelList" :key="index" :value="item.value">{{item.label}}</option>
          </select>
        </div>
        <h3 style="padding: 6px 0;">Model Color</h3>
        <!-- 控制模型颜色 -->
        <div class="model-control-item select-model-color">
          <p class="label">Color</p>
          <select
            v-model="activeColor"
            class="cesium-select"
            @change="handleChangeSelectModelColor">
            <option v-for="(item, index) in modelColorArr" :key="index" :value="item">{{item}}</option>
          </select>
        </div>
        <!-- 控制模型颜色透明度 -->
        <div class="model-control-item select-model-color">
          <p class="label">Alpha</p>
          <input
            v-model="activeAlpha"
            type="range"
            :step="0.01"
            :min="0"
            :max="1"
            @input="handleChangeModelAlpha" />
        </div>
        <!-- 控制模型与颜色的混合模式 -->
        <div class="model-control-item select-model-mode">
          <p class="label">Mode</p>
          <select
            v-model="activeColorBlendMode"
            class="cesium-select"
            @change="handleChangeSelectModelMode">
            <option v-for="(item, index) in colorBlendModeArr" :key="index" :value="item">{{item}}</option>
          </select>
        </div>
        <!-- 控制模型颜色混合的强度 -->
        <div class="model-control-item select-model-color">
          <p class="label">Mix</p>
          <input
            v-model="activeColorBlendAmount"
            :disabled="activeColorBlendMode !== 'Mix'"
            type="range"
            :step="0.01"
            :min="0"
            :max="1"
            @input="handleChangeModelColorBlendAmount" />
        </div>
        <h3 style="padding: 6px 0;">Model Silhouette</h3>
        <!-- 控制模型轮廓颜色 -->
        <div class="model-control-item select-model-silhouette-color">
          <p class="label">Color</p>
          <select
            v-model="activeSilhouetteColor"
            class="cesium-select"
            @change="handleChangeSelectModelSilhouetteColor">
            <option v-for="(item, index) in silhouetteColorArr" :key="index" :value="item">{{item}}</option>
          </select>
        </div>
        <!-- 控制模型轮廓的大小 -->
        <div class="model-control-item select-model-color">
          <p class="label">Size</p>
          <input
            v-model="activeSilhouetteSize"
            type="range"
            :step="0.05"
            :min="0"
            :max="3"
            @input="handleChangeModelSilhouetteSize" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let activeEntity = null;
export default {
  name: "",
  props: {},
  components: {
    RealTimeCoordinates: () => import("@/components/RealTimeCoordinates")
  },
  data() {
    return {
      realTimeCoordinates: {
        lng: 0,
        lat: 0,
        height: 0
      },
      layersManage: {
        activeLayer: "terrian",
        type: "Imagery",
        layers: [
          {
            label: "高德(地形)",
            value: "terrian"
          },
          {
            label: "高德(线图)",
            value: "lineMap"
          }
        ]
      },
      activeModel: "Aircraft",
      modelList: [
        {
          label: '飞机',
          value: "Aircraft"
        },
        {
          label: '卡车',
          value: "Ground Vehicle"
        },
        {
          label: '热气球',
          value: "Hot Air Balloon"
        },
        {
          label: '汽车1',
          value: "Milk Truck"
        },
        {
          label: '机器人',
          value: "Skinned Character"
        },
        {
          label: '汽车2',
          value: "Draco Compressed Model"
        }
      ],
      modelColorArr: ['White', 'Red', 'Green', 'Blue', 'Yellow', 'Gray'],
      activeColor: 'White',
      colorBlendModeArr: ['Highlight', 'Replace', 'Mix'],
      activeColorBlendMode: 'Highlight',
      activeColorBlendAmount: 0.5,
      activeAlpha: 1,
      activeSilhouetteColor : 'White',
      silhouetteColorArr : ['White', 'Red', 'Green', 'Blue', 'Yellow', 'Gray'],
      activeSilhouetteSize : 1.0
    };
  },
  computed: {},
  watch: {},
  created() {
    window.viewer = null;
  },
  mounted() {
    this.initCesium();
    this.initCesiumMouseEvent();
    this.initCesiumImageryLayers();
    this.initCesiumCamera();
    this.handleCreated3DModel('../../../static/models/SampleData/models/CesiumAir/Cesium_Air.glb', 5000.0);
  },
  methods: {
    initCesium() {
      window.viewer = new Cesium.Viewer("cesiumContainer", {
        animation: false,
        timeline: false,
        shouldAnimate: true,
        fullscreenButton: false,
        // 是否显示图层选择器
        baseLayerPicker: false
        // 地球表面贴图
        // imageryProvider: new Cesium.UrlTemplateImageryProvider({
        //   url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
        //   maximumLevel: 30,
        //   minimumLevel: 3
        // })
      });
      // 删除所有图层
      viewer.scene.imageryLayers.removeAll();

      // 去除版权信息
      window.viewer._cesiumWidget._creditContainer.style.display = "none";
      window.camera = viewer.camera;

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
      // 启用超级控件
      viewer.extend(Cesium.viewerCesiumInspectorMixin);
    },
    // 初始化cesium影像图层
    initCesiumImageryLayers() {
      // 高德（山川）
      let layer = viewer.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          url:
            "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
          layer: "tdtVecBasicLayer",
          style: "default",
          format: "image/png",
          tileMatrixSetID: "GoogleMapsCompatible",
          show: false
        }),
        0
      );

      // 高德(街道)
      layer = viewer.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          url:
            "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
          layer: "tdtVecBasicLayer",
          style: "default",
          format: "image/png",
          tileMatrixSetID: "GoogleMapsCompatible",
          show: false
        }),
        1
      );

      // 高德(白地图)
      layer = viewer.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          url:
            "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
          layer: "tdtVecBasicLayer",
          style: "default",
          format: "image/png",
          tileMatrixSetID: "GoogleMapsCompatible",
          show: false
        }),
        2
      );
      layer.show = false;
    },
    // 初始化鼠标事件
    initCesiumMouseEvent() {
      let self = this;
      // 处理用户输入事件
      let mouseDrawEventHandler = new Cesium.ScreenSpaceEventHandler(
        viewer.scene.canvas
      );
      mouseDrawEventHandler.setInputAction(function(click) {
        // console.log("左键单击事件：", click);
        let entity = self.pickEntity(click.position);
        console.log("选中元素", entity);
        if (entity) {
          activeEntity = entity;
          self.activeColor = activeEntity.colorValue;
          self.activeAlpha = activeEntity.alphaValue;
          self.activeColorBlendMode = activeEntity.modeValue;
          self.activeColorBlendAmount = activeEntity.mixValue;
          self.activeSilhouetteColor = activeEntity.silhouetteColorValue;
          self.activeSilhouetteSize = activeEntity.silhouetteSizeValue;
        } else {
          activeEntity = null;
        }
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
    // 初始化相机
    initCesiumCamera() {
      camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(107.02, 36.54, 10000000),
        orientation: {
          heading: 0,
          pitch: Cesium.Math.toRadians(-90),
          roll: 0
        }
      });
    },
    // 切换影像图层
    handleClickSwitchLayers(layer) {
      this.layersManage.activeLayer = layer.value;
      let layerEntity;
      switch (layer.value) {
        case "terrian":
          layerEntity = viewer.scene.imageryLayers.get(0);
          layerEntity.show = true;
          layerEntity = viewer.scene.imageryLayers.get(1);
          layerEntity.show = true;
          layerEntity = viewer.scene.imageryLayers.get(2);
          layerEntity.show = false;
          break;
        case "lineMap":
          layerEntity = viewer.scene.imageryLayers.get(0);
          layerEntity.show = false;
          layerEntity = viewer.scene.imageryLayers.get(1);
          layerEntity.show = false;
          layerEntity = viewer.scene.imageryLayers.get(2);
          layerEntity.show = true;
          break;
        default:
          return undefined;
      }
    },
    /**
     * 返回对应窗口位置最上面一个Entity 如果该位置没有对象那么返回undefined
     * @param {Cartesian2} windowPosition 窗口坐标
     * @returns {Entity} 返回值
     */
    pickEntity(windowPosition) {
      let picked = viewer.scene.pick(windowPosition);
      if (picked) {
        let entity = Cesium.defaultValue(picked.id, picked.primitive.id);
        if (entity instanceof Cesium.Entity) {
          return entity;
        }
      }
      return undefined;
    },
    /**
     *返回对应窗口位置所有Entity的列表 如果该位置没有对象那么返回undefined
     * 返回值按可视化顺序从前到后存储在数组里
     *
     * @param {Cartesian2} windowPosition 窗口位置
     * @returns {Entity[]}
     */
    drillPickEntities(windowPosition) {
      var i;
      var entity;
      var picked;
      var pickedPrimitives = viewer.scene.drillPick(windowPosition);
      var length = pickedPrimitives.length;
      var result = [];
      var hash = {};

      for (i = 0; i < length; i++) {
        picked = pickedPrimitives[i];
        entity = Cesium.defaultValue(picked.id, picked.primitive.id);
        if (
          entity instanceof Cesium.Entity &&
          !Cesium.defined(hash[entity.id])
        ) {
          result.push(entity);
          hash[entity.id] = true;
        }
      }
      return result;
    },
    // 渲染不同模型
    handleChangeSelectModel(val) {
      console.log('渲染模型', val.target.value)
      switch(val.target.value) {
        // 飞机
        case "Aircraft":
          this.handleCreated3DModel('../../../static/models/SampleData/models/CesiumAir/Cesium_Air.glb', 5000.0);
          break;
        // 卡车
        case "Ground Vehicle":
          this.handleCreated3DModel('../../../static/models/SampleData/models/GroundVehicle/GroundVehicle.glb', 0.0);
          break;
        // 热气球
        case "Hot Air Balloon":
          this.handleCreated3DModel('../../../static/models/SampleData/models/CesiumBalloon/CesiumBalloon.glb', 1000.0);
          break;
        // 汽车1
        case "Milk Truck":
          this.handleCreated3DModel('../../../static/models/SampleData/models/CesiumMilkTruck/CesiumMilkTruck-kmc.glb', 0);
          break;
        // 机器人
        case "Skinned Character":
          this.handleCreated3DModel('../../../static/models/SampleData/models/CesiumMan/Cesium_Man.glb', 0);
          break;
        // 汽车2
        case "Draco Compressed Model":
          this.handleCreated3DModel('../../../static/models/SampleData/models/DracoCompressed/CesiumMilkTruck.gltf', 0);
          break;
        default:
          return undefined;
      }
    },
    // 创建模型
    handleCreated3DModel(url, height) {
      viewer.entities.removeAll();
      let position = Cesium.Cartesian3.fromDegrees(
        108.9,
        34.2,
        height
      );
      let heading = Cesium.Math.toRadians(135);
      let pitch = 0;
      let roll = 0;
      let hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      let orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        hpr
      );

      let entity = viewer.entities.add({
        name: url,
        position: position,
        // orientation: orientation,
        model: {
          uri: url,
          minimumPixelSize: 128,
          maximumScale: 20000,
          color: Cesium.Color.WHITE.withAlpha(1),
          colorBlendMode: Cesium.ColorBlendMode.HIGHLIGHT,
          silhouetteColor: Cesium.Color.WHITE,
          silhouetteSize: 1.0
        }
      });
      entity.colorValue = 'White';
      entity.alphaValue = 1;
      entity.modeValue = 'Highlight';
      entity.mixValue = 0.5;
      entity.silhouetteColorValue = 'White';
      viewer.trackedEntity = entity;
    },
    // 选择模型颜色
    handleChangeSelectModelColor(val) {
      console.log('模型颜色设置为:', val.target.value)
      if (!activeEntity) return;
      let color = val.target.value;
      activeEntity.colorValue = color;
      activeEntity.model.color = Cesium.Color[color.toUpperCase()];
    },
    // 选择模型与颜色的混合模式
    handleChangeSelectModelMode(event) {
      console.log('当前模型的颜色混合模式:', event.target.value);
      if (!activeEntity) return;
      let mode = event.target.value;
      activeEntity.modeValue = mode;
      activeEntity.model.colorBlendMode = Cesium.ColorBlendMode[mode.toUpperCase()];
    },
    // 设置模型颜色透明度
    handleChangeModelAlpha(event) {
      console.log('当前模型透明度', event.target.value)
      if (!activeEntity) return;
      let alpha = event.target.value;
      let color = Cesium.Color[this.activeColor.toUpperCase()];
      activeEntity.alphaValue = parseFloat(alpha);
      activeEntity.model.color = Cesium.Color.fromAlpha(color, parseFloat(alpha));
    },
    // 模型颜色混合的强度
    handleChangeModelColorBlendAmount(event) {
      console.log('颜色混合的强度:', event.target.value);
      if (!activeEntity) return;
      let mix = parseFloat(event.target.value);
      activeEntity.mixValue = mix;
      activeEntity.model.colorBlendAmount = mix;
    },
    // 控制模型轮廓颜色
    handleChangeSelectModelSilhouetteColor(event) {
      console.log('模型轮廓颜色:', event.target.value);
      if (!activeEntity) return;
      let color = event.target.value;
      activeEntity.silhouetteColorValue = color;
      activeEntity.model.silhouetteColor = Cesium.Color[color.toUpperCase()]
    },
    // 控制模型轮廓大小
    handleChangeModelSilhouetteSize(event) {
      console.log('轮廓大小:', event.target.value);
      if (!activeEntity) return;
      let size = parseFloat(event.target.value);
      activeEntity.silhouetteSizeValue = size;
      activeEntity.model.silhouetteSize = size;
    }
  }
};
</script>

<style lang="scss">
.d3-models-component {
  .set-section {
    position: fixed;
    top: 8px;
    left: 8px;
    width: 240px;
    // 影像图层管理
    .layer-manage {
      padding: 10px;
      font-size: 12px;
      color: white;
      background: rgba(68, 68, 68, 0.4);
      border-radius: 4px;
      .layer-list {
        display: flex;
        margin-top: 5px;
        .layer-item {
          width: 75px;
          height: 28px;
          line-height: 28px;
          border: 1px solid #444;
          text-align: center;
          color: #edffff;
          background: #303336;
          border-radius: 4px;
          cursor: pointer;
          &:hover {
            border: 1px solid #38f;
            background: rgba(51, 136, 255, 0.4);
            box-shadow: 0 0 10px #ffffff;
          }
        }
        .layer-item + .layer-item {
          margin-left: 5px;
        }
      }
    }
    // 模型控制
    .model-control {
      margin-top: 10px;
      padding: 10px;
      font-size: 12px;
      color: white;
      background: rgba(68, 68, 68, 0.4);
      border-radius: 4px;
      select {
        width: 100%;
        margin: 0;
      }
      .model-control-item {
        display: flex;
        align-items: center;
        .label {
          width: 50px;
        }
        select,
        input {
          flex: 1;
        }
      }
      .model-control-item + .model-control-item {
        margin-top: 10px;
      }
    }
  }
}
</style>
