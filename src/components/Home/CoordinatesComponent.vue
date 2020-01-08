<template>
  <div class="coordinates-component">
    <div class="coordinates-list">
      <div v-if="screenCoordinaes" class="coordinates-list-item">
        <h4 class="label">屏幕坐标</h4>
        <div class="content">
          <p>x: {{screenCoordinaes.x | toFixedfilter}}</p>
          <p>y: {{screenCoordinaes.y | toFixedfilter}}</p>
        </div>
      </div>
      <div v-if="worldCoordinaes" class="coordinates-list-item">
        <h4 class="label">世界坐标</h4>
        <div class="content">
          <p>x: {{worldCoordinaes.x | toFixedfilter}}</p>
          <p>y: {{worldCoordinaes.y | toFixedfilter}}</p>
          <p>Z: {{worldCoordinaes.z | toFixedfilter}}</p>
        </div>
      </div>
      <div v-if="geographyCoordinaes" class="coordinates-list-item">
        <h4 class="label">地理坐标</h4>
        <div class="content">
          <p>经度: {{geographyCoordinaes[0] | toFixedfilter}}</p>
          <p>纬度: {{geographyCoordinaes[1] | toFixedfilter}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let Cesium = null;
export default {
  data() {
    return {
      // 屏幕坐标
      screenCoordinaes: null,
      // 世界坐标
      worldCoordinaes: null,
      // 地理坐标
      geographyCoordinaes: null
    };
  },
  filters: {
    toFixedfilter(value) {
      return value.toFixed(4);
    }
  },
  mounted() {
    Cesium = this.$Cesium;
    this.init();
  },
  methods: {
    init() {
      let self = this;
      let world = null;
      let screen = null;
      let Geography = null;
      let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(function(movement) {
        // 1、屏幕坐标转世界坐标
        world = viewer.scene.globe.pick(
          viewer.camera.getPickRay(movement.endPosition),
          viewer.scene
        );
        if (!world) return;
        self.worldCoordinaes = world;
        // console.log("世界坐标", world);

        // 2、世界坐标转屏幕坐标
        screen = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          viewer.scene,
          world
        );
        self.screenCoordinaes = screen;
        // console.log("屏幕坐标", screen);

        // 3、世界坐标转地理坐标(经纬度)
        Geography = viewer.scene.globe.ellipsoid.cartesianToCartographic(world);
        Geography = [
          Cesium.Math.toDegrees(Geography.longitude),
          Cesium.Math.toDegrees(Geography.latitude)
        ];
        self.geographyCoordinaes = Geography;
        // console.log("地理坐标", Geography);

        // 4、地理坐标(经纬度)转世界坐标
        world = Cesium.Cartesian3.fromDegrees(Geography[0], Geography[1]);
        // console.log("世界坐标", world);
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
  }
};
</script>

<style lang="scss">
.coordinates-component {
  position: fixed;
  bottom: 10px;
  left: 10px;
  .coordinates-list {
    padding: 10px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 4px;
    .coordinates-list-item {
      .label {
        font-size: 14px;
        font-weight: normal;
      }
      .content {
        color: green;
      }
    }
  }
}
</style>
