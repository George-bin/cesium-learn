<template>
  <div class="imageryProvider-component">
    <div id="cesiumContainer" style="height: 100vh;"></div>
  </div>
</template>

<script>
export default {
  name: '',
  props: {},
  components: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
    window.viewer = null;
  },
  mounted() {
    this.initCesium();
    this.initCesiumMouseEvent();
    this.createEntity();
    this.addImageryProvider();
  },
  methods: {
    initCesium() {
      window.viewer = new Cesium.Viewer('cesiumContainer', {
        // 是否显示图层选择器
        baseLayerPicker: false,
        // 地球表面贴图
        // imageryProvider: new Cesium.UrlTemplateImageryProvider({
        //   url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
        //   maximumLevel: 30,
        //   minimumLevel: 3
        // })
      });

      // 监听实体集合的变动
      viewer.entities.collectionChanged.addEventListener(function(collection, added, removed, changed) {
        console.log('collection', collection)
        console.log('added', added)
        console.log('removed', removed)
        console.log('changed', changed)
      });
    },
    // 初始化cesium鼠标事件
    initCesiumMouseEvent() {
      let self = this;
      let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(function(click){
        console.log('左键单击事件：',click);
        console.log(self.pickEntity(click.position));
        console.log(self.drillPickEntities(click.position));
      },Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    // 添加图层
    addImageryProvider() {
      let layers = viewer.scene.imageryLayers;
      // 黑地球
      let newLayers = layers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
          maximumLevel: 30,
          minimumLevel: 3
        })
      );
      // 调整影像图层透明度0~1
      newLayers.alpha = 0.2;
      // 调整亮度 > 1.0 增加亮度  < 1.0减少亮度
      newLayers.brightness = -1;

      // 白地球
      let newLayers2 = layers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          url: 'http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}',
          maximumLevel: 30,
          minimumLevel: 3
        })
      );
      // 调整影像图层透明度0~1
      newLayers2.alpha = 0.7;
    },
    // 创建实体
    createEntity() {
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
        if (entity instanceof Cesium.Entity && !Cesium.defined(hash[entity.id])) {
          result.push(entity);
          hash[entity.id] = true;
        }
      }
      return result;
    }
  }
}
</script>

<style lang="scss">
</style>
