<template>
  <div class="introduction-component">
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
    this.initCesiumMouseEvent()
    this.createEntity();
  },
  methods: {
    initCesium() {
      window.viewer = new Cesium.Viewer('cesiumContainer', {
        // 是否显示图层选择器
        baseLayerPicker: false,
        // 地球表面贴图
        imageryProvider: new Cesium.UrlTemplateImageryProvider({
          url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
          maximumLevel: 30,
          minimumLevel: 3
        })
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
    // 创建实体
    createEntity() {
      // this.drawEllipse();
      // this.drawPolyline();
      // this.drawPolygon();
      // this.drawPointsLabelsBillboards();
      this.load3DModel();
    },
    // 椭圆实体
    drawEllipse() {
      // console.log('viewer', viewer);
      let entity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-103, 40),
        ellipse: {
          semiMinorAxis : 250000.0,
          semiMajorAxis : 400000.0,
          material : Cesium.Color.BLUE.withAlpha(0.5)
        }
      });
      viewer.zoomTo(entity);
      // 修改材质 => 属性系统
      entity.ellipse.material = '../../../static/img/material/material1.jpg';
      // 条纹材质
      entity.ellipse.material = new Cesium.StripeMaterialProperty({
        evenColor : Cesium.Color.WHITE,
        oddColor : Cesium.Color.BLACK,
        repeat : 32
      });
      // 网格材质
      entity.ellipse.material = new Cesium.GridMaterialProperty({
        color : Cesium.Color.YELLOW,
        cellAlpha : 0.2,
        lineCount : new Cesium.Cartesian2(8, 8),
        lineThickness : new Cesium.Cartesian2(2.0, 2.0)
      });
      entity.ellipse.fill = false;
      entity.ellipse.outline = true;
      entity.ellipse.outlineColor = Cesium.Color.YELLOW;
      entity.ellipse.outlineWidth = 5.0;
    },
    // 绘制折线
    drawPolyline() {
      let entity = viewer.entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([
            -77, 35,
            -79, 35
          ]),
          width: 5,
          material: Cesium.Color.RED
        }
      });
      viewer.zoomTo(entity);

      let polyline = entity.polyline;
      // 折线边线
      polyline.material = new Cesium.PolylineOutlineMaterialProperty({
        color : Cesium.Color.ORANGE,
        outlineWidth : 3,
        outlineColor : Cesium.Color.RED
      });

      // 折线辉光
      polyline.material = new Cesium.PolylineGlowMaterialProperty({
        glowPower : 0.2,
        color : Cesium.Color.BLUE
      });

    },
    // 绘制多边形
    drawPolygon() {
      viewer.entities.suspendEvents();
      let entity = viewer.entities.add({
        id: 'Wyoming', // 指定实体id
        name: 'Wyoming',
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray([
            -109.080842,45.002073,
            -105.91517,45.002073,
            -104.058488,44.996596,
            -104.053011,43.002989,
            -104.053011,41.003906,
            -105.728954,40.998429,
            -107.919731,41.003906,
            -109.04798,40.998429,
            -111.047063,40.998429,
            -111.047063,42.000709,
            -111.047063,44.476286,
            -111.05254,45.002073
          ]),
          height: 0,
          material: Cesium.Color.RED.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.BLACK
        }
      });
      let entity2 = viewer.entities.add({
        id: 'Wyoming2', // 指定实体id
        name: 'Wyoming2',
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray([
            -109.080842,45.002073,
            -105.91517,45.002073,
            -104.058488,44.996596,
            -104.053011,43.002989,
            -104.053011,41.003906,
            -105.728954,40.998429,
            -107.919731,41.003906,
            -109.04798,40.998429,
            -111.047063,40.998429,
            -111.047063,42.000709,
            -111.047063,44.476286,
            -111.05254,45.002073
          ]),
          height: 0,
          material: Cesium.Color.RED.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.BLACK
        }
      });

      viewer.zoomTo(entity);

      let polygon = entity.polygon;
      // 设置高程
      polygon.height = 200000;
      // 实体拉伸到25000，实体的实际高度为extrudedHeight-height
      polygon.extrudedHeight = 0;

      // 为实体添加描述信息
      entity.description = `
        <p
          style="color: red">
          My Name is George!
        </p>
      `;

      // 通过id获取实体对象
      let entityObject = viewer.entities.getById('Wyoming');
      // setTimeout(() => {
      //   // console.log('删除实体对象', entityObject);
      //   viewer.entities.remove(entityObject);
      // }, 5000)
      viewer.entities.resumeEvents();
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
    },
    // 绘制点、公告牌、标注
    drawPointsLabelsBillboards() {
      let citizensBankPark = viewer.entities.add( {
        name: 'Citizens Bank Park',
        position: Cesium.Cartesian3.fromDegrees( -75.166493, 39.9060534 ),
        point: { //点
          pixelSize: 5,
          color: Cesium.Color.RED,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2
        },
        label: { //文字标签
          text: 'Citizens Bank Park',
          font: '14pt monospace',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM, //垂直方向以底部来计算标签的位置
          pixelOffset: new Cesium.Cartesian2( 0, -9 )   //偏移量
        },
        billboard: { //图标
          image: '../../../static/img/material/material1.jpg',
          width: 64,
          height: 64
        },
      });
      viewer.zoomTo(viewer.entities);
    },
    // 加载3d模型
    load3DModel() {
      let entity = viewer.entities.add({
        position : Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706),
        model: {
          uri: '../../../static/3dmodel/scene.gltf',
          scale: 100
        }
      });
      viewer.trackedEntity = entity;
    }
  }
}
</script>

<style lang="scss">
</style>
