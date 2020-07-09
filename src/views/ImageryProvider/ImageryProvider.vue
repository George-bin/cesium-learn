<template>
  <div class="imageryProvider-component">
    <div id="cesiumContainer" style="height: 100vh;"></div>
    <!-- 实时坐标 -->
    <real-time-coordinates :realTimeCoordinates="realTimeCoordinates"></real-time-coordinates>
    <!-- 参数调整 -->
    <section class="options-operation">
      <div class="imagery-control">
        <el-checkbox-group v-model="activeLayerArr">
          <div
            v-for="(item, index) in layersArr"
            :key="index"
            :style="{
              'background': activeIndex === index ? 'rgba(255, 255, 255, 0.2)' : '',
              'border-radius': '4px'
            }"
            class="imagery-control-item"
            @click="handleClickSelectLayer(index)">
            <el-checkbox :label="item.value">{{item.label}}</el-checkbox>
            <input
              v-model="item.alpha"
              type="range"
              :step="0.01"
              :min="0"
              :max="1"
              @input="handleChangeInputAlpha(item)" />
            <div class="move-layer">
              <div class="up-btn btn-item">
                <button v-show="index" @click="handleClickMoveLayerUp(item, index)">
                  <i class="el-icon-caret-top"></i>
                </button>
              </div>
              <div class="down-btn btn-item">
                <button v-show="index !== layersArr.length-1" @click="handleClickMoveLayerDown(item, index)">
                  <i class="el-icon-caret-bottom"></i>
                </button>
              </div>
            </div>
          </div>
        </el-checkbox-group>
      </div>
      <div class="imagery-prop-control">
        <div
          v-for="(item, index) in layersPropsArr"
          :key="index"
          class="imagery-prop-control-item">
          <span class="label">{{item.label}}</span>
          <input
            v-model="item.value"
            type="range"
            :step="0.01"
            :min="item.minValue"
            :max="item.maxValue"
            @input="handleChangeLayerProps(item)" />
          <span class="value">{{item.value}}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
let activeLayerEntity = null;
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
      // 当前索引
      activeIndex: 9999,
      // 当前显示图层
      activeLayerArr: [],
      layersArr: [
        {
          value: "rectangle map",
          label: "区域贴图",
          alpha: 1
        },
        {
          value: "black map",
          label: "Google 黑",
          alpha: 1
        },
        {
          value: "white map",
          label: "Google 白",
          alpha: 1
        },
        {
          value: "ArcGIS",
          label: "ArcGIS",
          alpha: 1
        },
        {
          value: "高德(山川)",
          label: "高德(山川)",
          alpha: 1
        },
        {
          value: "高德(街道)",
          label: "高德(街道)",
          alpha: 1
        },
        {
          value: "高德(白)",
          label: "高德(白)",
          alpha: 1
        },
        {
          value: "天地图(标记)",
          label: "天地图(标记)",
          alpha: 1
        },
        {
          value: "天地图(山川)",
          label: "天地图(山川)",
          alpha: 1
        },
        {
          value: "天(矢量标记)",
          label: "天(矢量标记)",
          alpha: 1
        },
        {
          value: "天地图(矢量)",
          label: "天地图(矢量)",
          alpha: 1
        }
      ],
      layersPropsArr: [
        {
          label: 'Brightness',
          value: 1,
          minValue: 0,
          maxValue: 3
        },
        {
          label: 'Contrast',
          value: 1,
          minValue: 0,
          maxValue: 3
        },
        {
          label: 'Hue',
          value: 0,
          minValue: 0,
          maxValue: 3
        },
        {
          label: 'Saturation',
          value: 1,
          minValue: 0,
          maxValue: 3
        },
        {
          label: 'Gamma',
          value: 1,
          minValue: 0,
          maxValue: 3
        },
      ]
    };
  },
  computed: {},
  watch: {
    activeLayerArr: function(val, oldval) {
      // 获取两个数组中的不同项
      let differentArr = val.concat(oldval).filter(function(v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v);
      });
      let layerEntity = null;
      let reverseArr = JSON.parse(JSON.stringify(this.layersArr))
      reverseArr.reverse();
      if (val.length > oldval.length) {
        // 显示图层
        differentArr.forEach(item => {
          reverseArr.forEach((layer, i) => {
            if (layer.value === item) {
              layerEntity = viewer.scene.imageryLayers.get(i);
              if (layerEntity) {
                // debugger
                layerEntity.show = true;
              }
            }
          });
        });
      } else {
        // 隐藏图层
        differentArr.forEach(item => {
          reverseArr.forEach((layer, i) => {
            if (layer.value === item) {
              layerEntity = viewer.scene.imageryLayers.get(i);
              if (layerEntity) {
                layerEntity.show = false;
              }
            }
          });
        });
      }
    }
  },
  created() {
    window.viewer = null;
  },
  mounted() {
    this.initCesium();
    this.initCesiumMouseEvent();
    this.createEntity();
    this.handleAddLayer();
  },
  methods: {
    initCesium() {
      window.viewer = new Cesium.Viewer("cesiumContainer", {
        // 是否创建动画小器件，左下角仪表
        animation: false,
        shouldAnimate: true,
        // 是否显示时间轴
        timeline: false,
        // 是否显示右上角的帮助按钮
        navigationHelpButton: false,
        fullscreenButton: false,
        // 是否显示图层选择器
        baseLayerPicker: false,
        // 地球表面贴图
        // imageryProvider: new Cesium.UrlTemplateImageryProvider({
        //   url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
        //   maximumLevel: 30,
        //   minimumLevel: 3
        // })
      });
      window.camera = viewer.camera;
      // 去除版权信息
      window.viewer._cesiumWidget._creditContainer.style.display = "none";
      // 显示桢速
      window.viewer.scene.debugShowFramesPerSecond = true;
      // 删除所有图层
      viewer.scene.imageryLayers.removeAll();
      // 删除单个图层
      // viewer.scene.imageryLayers.remove(layer);

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
    // 创建实体
    createEntity() {},
    handleClickSelectLayer(index) {
      this.activeIndex = index;
      this.layersPropsArr = [
        {
          label: 'Brightness',
          value: 1,
          minValue: 0,
          maxValue: 3
        },
        {
          label: 'Contrast',
          value: 1,
          minValue: 0,
          maxValue: 3
        },
        {
          label: 'Hue',
          value: 0,
          minValue: 0,
          maxValue: 3
        },
        {
          label: 'Saturation',
          value: 1,
          minValue: 0,
          maxValue: 3
        },
        {
          label: 'Gamma',
          value: 1,
          minValue: 0,
          maxValue: 3
        },
      ];
      if (activeLayerEntity) {
        activeLayerEntity.brightness = 1; // 亮度
        activeLayerEntity.contrast = 1; // 对比度
        activeLayerEntity.hue = 0;  // 色调
        activeLayerEntity.saturation = 1; // 饱和度
        activeLayerEntity.gamma = 1; // 伽马校正
      }
      // 指定当前图层
      activeLayerEntity = this.handleGetLayer(this.layersArr[index].value);
    },
    // 新增图层
    handleAddLayer(value) {
      let layers = viewer.scene.imageryLayers;
      let layerEntity = null;

      // 天地图（矢量）
      layerEntity = viewer.imageryLayers.addImageryProvider(
        new Cesium.WebMapTileServiceImageryProvider({
          url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=c778a692a4837512fa864c42c2fe54dc",
          layer: "tdtVecBasicLayer",
          style: "default",
          format: "image/jpeg",
          tileMatrixSetID: "GoogleMapsCompatible",
          show: false
        })
      );
      layerEntity.show = false;
      
      // 天地图（矢量标记）
      layerEntity = viewer.imageryLayers.addImageryProvider(
        new Cesium.WebMapTileServiceImageryProvider({
          url: "http://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=c778a692a4837512fa864c42c2fe54dc",
          layer: "tdtAnnoLayer",
          style: "default",
          format: "image/jpeg",
          tileMatrixSetID: "GoogleMapsCompatible"
        })
      );
      layerEntity.show = false;

      // 天地图（山川）
      layerEntity = viewer.imageryLayers.addImageryProvider(
        new Cesium.WebMapTileServiceImageryProvider({
          url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=c778a692a4837512fa864c42c2fe54dc",
          layer: "tdtBasicLayer",
          style: "default",
          format: "image/jpeg",
          tileMatrixSetID: "GoogleMapsCompatible",
          show: false
        })
      );
      layerEntity.show = false;

      // 天地图中文标记服务
      layerEntity = layers.addImageryProvider(
        new Cesium.WebMapTileServiceImageryProvider({
          url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=c778a692a4837512fa864c42c2fe54dc",
          layer: "tdtAnnoLayer",
          style: "default",
          format: "image/jpeg",
          tileMatrixSetID: "GoogleMapsCompatible",
          show: false
        })
      );
      layerEntity.show = false;
      
      // 高德(白)
      layerEntity = layers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
          layer: "tdtVecBasicLayer",
          style: "default",
          format: "image/png",
          tileMatrixSetID: "GoogleMapsCompatible",
          show: false
        })
      );
      layerEntity.show = false;
      
      // 高德(街道)
      layerEntity = layers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
          layer: "tdtVecBasicLayer",
          style: "default",
          format: "image/png",
          tileMatrixSetID: "GoogleMapsCompatible",
          show: false
        })
      );
      layerEntity.show = false;
      
      // 高德(山川)
      layerEntity = layers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
          layer: "tdtVecBasicLayer",
          style: "default",
          format: "image/png",
          tileMatrixSetID: "GoogleMapsCompatible",
          show: false
        })
      );
      layerEntity.show = false;

      // ArcGIS影像服务
      layerEntity = layers.addImageryProvider(
        new Cesium.ArcGisMapServerImageryProvider({
          url : '//services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
        })
      );
      layerEntity.show = false;

      // Google白地图
      layerEntity = layers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          url:
            "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
          maximumLevel: 30,
          minimumLevel: 3
        })
      );
      layerEntity.show = false;

      // Google黑地图
      layerEntity = layers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          url:
            "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
          maximumLevel: 30,
          minimumLevel: 3
        })
      );
      layerEntity.show = false;

      // 区域地图
      layerEntity = layers.addImageryProvider(
        new Cesium.SingleTileImageryProvider({
          url: "../../../static/img/china.png",
          rectangle: Cesium.Rectangle.fromDegrees(73, 12.2, 135, 54.2)
        })
      );
      layerEntity.show = false;
    },
    // 更新图层透明度
    handleChangeInputAlpha(layer) {
      let layerEntity = this.handleGetLayer(layer.value);
      // console.log("当前图层", layerEntity);
      if (layerEntity) {
        layerEntity.alpha = layer.alpha;
      } else {
        console.warn('当前图层不存在!')
      }
    },
    // 获取图层
    handleGetLayer(type) {
      let index = 0;
      let reverseArr = JSON.parse(JSON.stringify(this.layersArr));
      reverseArr.reverse();
      reverseArr.forEach((item, i) => {
        if (item.value === type) {
          index = i;
        }
      });
      if (index > -1) {
        return viewer.scene.imageryLayers.get(index);
      } else {
        return undefined;
      }
    },
    // 向上移动图层
    handleClickMoveLayerUp(layer, index) {
      let layerEntity = this.handleGetLayer(layer.value);
      viewer.scene.imageryLayers.raise(layerEntity); // 上移一层

      if (index !== 0) {
        let activeLayerArr = JSON.parse(JSON.stringify(this.layersArr.splice(index, 1)[0]));
        this.layersArr.splice(index-1, 0, activeLayerArr);
        console.log('更新之后的图层列表:', this.layersArr)
      }
    },
    // 向下移动图层
    handleClickMoveLayerDown(layer, index) {
      let layerEntity = this.handleGetLayer(layer.value);
      viewer.scene.imageryLayers.lower(layerEntity); // 上移一层

      if (index !== this.layersArr.length-1) {
        let activeLayerArr = JSON.parse(JSON.stringify(this.layersArr.splice(index, 1)[0]));
        this.layersArr.splice(index+1, 0, activeLayerArr);
        console.log('更新之后的图层列表:', this.layersArr)
      }
    },
    // 更改图层属性
    handleChangeLayerProps(prop) {
      if (!activeLayerEntity) return;
      switch(prop.label) {
        case "Brightness":
          activeLayerEntity.brightness = prop.value;
          break;
        case "Contrast":
          activeLayerEntity.contrast = prop.value;
          break;
        case "Hue":
          activeLayerEntity.hue = prop.value;
          break;
        case "Saturation":
          activeLayerEntity.saturation = prop.value;
          break;
        case "Gamma":
          activeLayerEntity.gamma = prop.value;
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
    }
  }
};
</script>

<style lang="scss">
.imageryProvider-component {
  .options-operation {
    position: fixed;
    top: 10px;
    left: 10px;
    .imagery-control {
      padding: 10px;
      color: white;
      background: rgba(68, 68, 68, 0.4);
      border-radius: 4px;
      .imagery-control-item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 5px;
        .el-checkbox {
          width: 100px;
          color: white;
          .el-checkbox__label {
            font-size: 12px;
          }
        }
        .move-layer {
          display: flex;
          align-items: center;
          margin-left: 10px;
          height: 40px;
          .btn-item {
            display: inline-block;
            width: 36px;
            height: 30px;
            margin: 2px 3px;
            button {
              width: 100%;
              height: 100%;
              background: #303336;
              border: 1px solid #444;
              color: #edffff;
              fill: #edffff;
              border-radius: 4px;
              cursor: pointer;
              overflow: hidden;
              -moz-user-select: none;
              -webkit-user-select: none;
              -ms-user-select: none;
              user-select: none;
              outline: none;
              &:hover {
                border: 1px solid #38f;
                background: rgba(51, 136, 255, 0.4);
                box-shadow: 0 0 10px #ffffff;
              }
              i {
                font-size: 18px;
              }
            }
          }
        }
      }
    }
    .imagery-prop-control {
      padding: 10px;
      margin-top: 10px;
      color: white;
      background: rgba(68, 68, 68, 0.4);
      border-radius: 4px;
      .imagery-prop-control-item {
        display: flex;
        align-items: center;
        height: 40px;
        .label {
          width: 100px;
          font-size: 10px;
        }
        .value {
          width: 50px;
          height: 30px;
          line-height: 30px;
          margin-left: 18px;
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
