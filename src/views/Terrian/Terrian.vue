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
    this.createEntity();
    this.initCesiumCamera();
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
      // 加载地形图
      viewer.terrainProvider = Cesium.createWorldTerrain({
        requestVertexNormals: true, // 地形光照效果
        requestWaterMask: true // 水面效果
      });
      viewer.scene.globe.enableLighting = true;
    },
    // 初始化cesium鼠标事件
    initCesiumMouseEvent() {
      let self = this;
      let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(function(click){
        console.log('左键单击事件：',click);
      },Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    // 初始化相机
    initCesiumCamera() {
      viewer.camera.setView({
        destination : Cesium.Cartesian3.fromDegrees(90, 30, 500000),
        orientation: {
            heading: 0.0,
            pitch: -Cesium.Math.PI_OVER_TWO,
            roll: 0.0
        }
      })
    },
    // 创建实体
    createEntity() {
    }
  }
}
</script>

<style lang="scss">
</style>
