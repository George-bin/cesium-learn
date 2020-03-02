<template>
  <div class="terrian-component">
    <div id="cesiumContainer" style="height: 100vh;"></div>
    <!-- 实时坐标 -->
    <real-time-coordinates :realTimeCoordinates="realTimeCoordinates"></real-time-coordinates>

    <!-- 绘制实体 -->
    <div class="set-section">
      <!-- 地图选择 -->
      <div v-if="false" class="layer-manage">
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
      <div class="select-camera-angle">
        <select
          v-model="activeCameraAngle"
          class="cesium-select"
          @change="handleChangeSelectCameraAngle">
          <option v-for="(item, index) in cameraAngleArr" :key="index" :value="item.value">{{item.label}}</option>
        </select>
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
      edgeStylingEnabled: false,
      clippingPlanesEnabled: true,
      activeCameraAngle: '喜马拉雅山脉',
      cameraAngleArr: [
        {
          label: '喜马拉雅山脉',
          value: '喜马拉雅山脉'
        }
      ]
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
    // this.initCesiumImageryLayers();
    this.initCesiumCamera();
    // this.loadCesiumMan();
  },
  methods: {
    initCesium() {
      window.viewer = new Cesium.Viewer("cesiumContainer", {
        animation: false,
        timeline: false,
        shouldAnimate: true,
        fullscreenButton: false,
        // 是否显示图层选择器
        baseLayerPicker: false,
        // 地球表面贴图
        // imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
        //   url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=c778a692a4837512fa864c42c2fe54dc",
        //   layer: "tdtBasicLayer",
        //   style: "default",
        //   format: "image/jpeg",
        //   tileMatrixSetID: "GoogleMapsCompatible",
        //   show: false
        // }),
        terrainProvider: Cesium.createWorldTerrain({
          // 地形光照
          requestVertexNormals: true,
          // 水面效果
          requestWaterMask: true
        })
      });
      // viewer.scene.globe.enableLighting = true;
      // 删除所有图层
      // viewer.scene.imageryLayers.removeAll();
      // 地形深度检测
      // viewer.scene.globe.depthTestAgainstTerrain = true;

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
          self.activeMaterial = activeEntity.materialType;
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
    // 切换相机视角
    handleChangeSelectCameraAngle(event) {
      console.log('当前相机视角:', event.target.value);
    },
    loadCesiumMan() {
      let position = Cesium.Cartesian3.fromRadians(-2.0862979473351286, 0.6586620013036164, 1400.0);

      let entity = viewer.entities.add({
        position: position,
        box: {
          dimensions: new Cesium.Cartesian3(1400.0, 1400.0, 2800.0),
          material: Cesium.Color.WHITE.withAlpha(0.3),
          outline: true,
          outlineColor: Cesium.Color.WHITE
        }
      });

      viewer.entities.add({
        position: position,
        model: {
            uri: '../../../static/models/SampleData/models/CesiumMan/Cesium_Man.glb',
            minimumPixelSize: 128,
            maximumScale: 800
        }
      });
      // viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
      //   modelMatrix: entity.computeModelMatrix(Cesium.JulianDate.now()),
      //   planes: [
      //     new Cesium.ClippingPlane(new Cesium.Cartesian3( 1.0,  0.0, 0.0), -700.0),
      //     new Cesium.ClippingPlane(new Cesium.Cartesian3(-1.0,  0.0, 0.0), -700.0),
      //     new Cesium.ClippingPlane(new Cesium.Cartesian3( 0.0,  1.0, 0.0), -700.0),
      //     new Cesium.ClippingPlane(new Cesium.Cartesian3( 0.0, -1.0, 0.0), -700.0)
      //   ],
      //   edgeWidth: this.edgeStylingEnabled ? 1.0 : 0.0,
      //   edgeColor: Cesium.Color.WHITE,
      //   enabled : this.clippingPlanesEnabled
      // });
      viewer.trackedEntity = entity;
    }
  }
};
</script>

<style lang="scss">
.terrian-component {
  .set-section {
    position: fixed;
    top: 8px;
    left: 8px;
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
  }
}
</style>
