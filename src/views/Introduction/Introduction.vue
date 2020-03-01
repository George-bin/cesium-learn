<template>
  <div class="introduction-component">
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

      <!-- 绘制实体 -->
      <div class="entity-list">
        <div class="draw-entity">
          <p class="label">材质</p>
          <p class="material-list">
            <span
              v-for="(material, i) in materialManage"
              :key="i"
              :style="{
                border: activeMaterial === material.value ? '1px solid #38f' : '' ,
                backgroundColor: activeMaterial === material.value ? 'rgba(51, 136, 255, 0.4)' : ''
              }"
              class="material-item"
              @click="handleClickSwitchMaterial(material)"
            >{{material.label}}</span>
          </p>
        </div>
        <!-- 线条材质 -->
        <div class="draw-entity">
          <p class="label">线条材质</p>
          <p class="material-list">
            <span
              v-for="(material, i) in lineMaterialManage"
              :key="i"
              :style="{
                border: activeMaterial === material.value ? '1px solid #38f' : '' ,
                backgroundColor: activeMaterial === material.value ? 'rgba(51, 136, 255, 0.4)' : ''
              }"
              class="material-item"
              @click="handleClickSwitchMaterial(material)"
            >{{material.label}}</span>
          </p>
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
      materialManage: [
        {
          label: "颜色",
          value: "color"
        },
        {
          label: "图片",
          value: "image"
        },
        {
          label: "棋盘",
          value: "board"
        },
        {
          label: "条纹",
          value: "stripe"
        },
        {
          label: "网格",
          value: "grid"
        },
        {
          label: "轮廓",
          value: "outline"
        }
      ],
      lineMaterialManage: [
        {
          label: '边线',
          value: 'border'
        },
        {
          label: '辉光',
          value: '辉光'
        }
      ],
      activeMaterial: ""
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
    this.createEntity();
  },
  methods: {
    initCesium() {
      window.viewer = new Cesium.Viewer("cesiumContainer", {
        animation: false,
        timeline: false,
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
    // 创建实体
    createEntity() {
      // 绘制椭圆
      let entity = viewer.entities.add({
        name: "ellipse",
        position: Cesium.Cartesian3.fromDegrees(107.02, 36.54),
        ellipse: {
          semiMinorAxis: 250000.0,
          semiMajorAxis: 400000.0,
          material: Cesium.Color.BLUE.withAlpha(0.5)
        }
      });
      entity.materialType = "color";
      entity.ellipse.material = new Cesium.Color(1.0, 0.0, 0.0, 1.0);

      // 绘制立方体
      entity = viewer.entities.add({
        name: 'box',
        position: Cesium.Cartesian3.fromDegrees(116.53, 30, 150000),
        box: {
          dimensions: new Cesium.Cartesian3(300000, 300000, 300000),
          material: Cesium.Color.BLUE,
          height: 200000
        }
      });
      entity.materialType = 'color';

      // 绘制折线
      entity = viewer.entities.add({
        name: 'polyline',
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([
            101, 24,
            108, 24
          ]),
          width: 5,
          material: Cesium.Color.RED
        }
      });

      // 绘制椭圆体
      entity = viewer.entities.add({
        name: 'ellipsoid',
        position: Cesium.Cartesian3.fromDegrees(121.24, 45.24, 300000.0),
        ellipsoid: {
          radii: new Cesium.Cartesian3(300000.0, 300000.0, 300000.0),
          material: Cesium.Color.RED.withAlpha(1),
          outline: true,
          outlineColor: Cesium.Color.BLACK,
          slicePartitions : 24,
          stackPartitions : 36
        }
      });

      // 绘制平面
      entity = viewer.entities.add({
        name: 'plane',
        position: Cesium.Cartesian3.fromDegrees(120.13, 37.65),
        plane: {
          plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_Z, 0.0),
          dimensions: new Cesium.Cartesian2(400000, 300000)
        }
      });

      // 绘制走廊
      entity = viewer.entities.add({
        name: 'corridor',
        corridor: {
          positions: Cesium.Cartesian3.fromDegreesArray([
            89, 34,
            89, 30,
            85, 30
          ]),
          width: 200000,
          material: Cesium.Color.BLUE,
          height : 200000.0,
          extrudedHeight : 100000.0,
          cornerType: Cesium.CornerType.BEVELED,
        }
      });

      // 绘制圆柱
      entity = viewer.entities.add({
        name: 'cylinder',
        position: Cesium.Cartesian3.fromDegrees(98, 28, 150000),
        cylinder: {
          topRadius: 300000,
          bottomRadius: 300000,
          length: 300000,
          material: Cesium.Color.BLUE.withAlpha(0.4),
          outline: true
        }
      });

      // 绘制多边形
      entity = viewer.entities.add({
        name: 'polygon',
        position: Cesium.Cartesian3.fromDegrees(98, 28, 150000),
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray([
            84.65, 46.75,
            82, 44,
            90, 45
          ]),
          height: 0,
          material: Cesium.Color.RED.withAlpha(1),
          extrudedHeight: 200000,
          outline: true
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
    // 绘制多边形
    drawPolygon() {
      viewer.entities.suspendEvents();
      let entity = viewer.entities.add({
        id: "Wyoming", // 指定实体id
        name: "Wyoming",
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray([
            -109.080842,
            45.002073,
            -105.91517,
            45.002073,
            -104.058488,
            44.996596,
            -104.053011,
            43.002989,
            -104.053011,
            41.003906,
            -105.728954,
            40.998429,
            -107.919731,
            41.003906,
            -109.04798,
            40.998429,
            -111.047063,
            40.998429,
            -111.047063,
            42.000709,
            -111.047063,
            44.476286,
            -111.05254,
            45.002073
          ]),
          height: 0,
          material: Cesium.Color.RED.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.BLACK
        }
      });
      let entity2 = viewer.entities.add({
        id: "Wyoming2", // 指定实体id
        name: "Wyoming2",
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray([
            -109.080842,
            45.002073,
            -105.91517,
            45.002073,
            -104.058488,
            44.996596,
            -104.053011,
            43.002989,
            -104.053011,
            41.003906,
            -105.728954,
            40.998429,
            -107.919731,
            41.003906,
            -109.04798,
            40.998429,
            -111.047063,
            40.998429,
            -111.047063,
            42.000709,
            -111.047063,
            44.476286,
            -111.05254,
            45.002073
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
      let entityObject = viewer.entities.getById("Wyoming");
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
    // 绘制点、公告牌、标注
    drawPointsLabelsBillboards() {
      let citizensBankPark = viewer.entities.add({
        name: "Citizens Bank Park",
        position: Cesium.Cartesian3.fromDegrees(-75.166493, 39.9060534),
        point: {
          //点
          pixelSize: 5,
          color: Cesium.Color.RED,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2
        },
        label: {
          //文字标签
          text: "Citizens Bank Park",
          font: "14pt monospace",
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM, //垂直方向以底部来计算标签的位置
          pixelOffset: new Cesium.Cartesian2(0, -9) //偏移量
        },
        billboard: {
          //图标
          image: "../../../static/img/material/material1.jpg",
          width: 64,
          height: 64
        }
      });
      viewer.zoomTo(viewer.entities);
    },
    // 加载3d模型
    load3DModel() {
      let entity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706),
        model: {
          uri: "../../../static/3dmodel/scene.gltf",
          scale: 100
        }
      });
      viewer.trackedEntity = entity;
    },
    // 切换实体材质
    handleClickSwitchMaterial(material) {
      this.activeMaterial = material.value;
      if (!activeEntity) return;
      // 图片材质
      let imageMaterial = new Cesium.ImageMaterialProperty({
        image: `../../../static/img/logo.png`,
        // color: Cesium.Color.BLUE,
        repeat: new Cesium.Cartesian2(1, 1)
      });
      // 条纹材质
      let stripeMaterial = new Cesium.StripeMaterialProperty({
        evenColor: Cesium.Color.WHITE,
        oddColor: Cesium.Color.BLACK,
        repeat: 32,
        // 水平或者垂直,默认水平
        orientation:Cesium.StripeOrientation.VERTICAL
        // offset 偏移量
      });
      // 网格材质
      let gridMaterial = new Cesium.GridMaterialProperty({
        color: Cesium.Color.YELLOW,
        cellAlpha: 0.2,
        // 行列个数
        lineCount: new Cesium.Cartesian2(8, 8),
        // 线粗细
        lineThickness: new Cesium.Cartesian2(1.0, 1.0)
        // lineOffset 线偏移
      });
      // 棋盘纹理
      let boardMaterial = new Cesium.CheckerboardMaterialProperty({
        evenColor: Cesium.Color.WHITE, // 默认白色，棋盘的第一个颜色
        oddColor: Cesium.Color.BLACK, // 默认黑色，第二个颜色
        repeat: new Cesium.Cartesian2(4, 4) // 重复次数
      });
      // 线条边线
      let polylineBorderMaterial = new Cesium.PolylineOutlineMaterialProperty({
        color: Cesium.Color.ORANGE, // 线的颜色
        outlineWidth: 3, // 线纹理宽度
        outlineColor: Cesium.Color.RED // 线纹理颜色
      });
      // 线条辉光
      let polylineGlowMaterial = new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.2, // 发光的颜色(中心颜色为白色)
        color: Cesium.Color.BLUE // 发光的长度，值为线宽的百分比(0~1.0)
      });
      activeEntity.materialType = material.value;
      activeEntity[activeEntity.name].fill = true;
      switch (material.value) {
        case "color":
          activeEntity[activeEntity.name].material = new Cesium.Color(
            1.0,
            0,
            0,
            1.0
          );
          break;
        case "image":
          activeEntity[activeEntity.name].material = imageMaterial;
          break;
        case "stripe":
          activeEntity[activeEntity.name].material = stripeMaterial;
          break;
        case "grid":
          activeEntity[activeEntity.name].material = gridMaterial;
          break;
        case "board":
          activeEntity[activeEntity.name].material = boardMaterial;
          break;
        case "outline":
          activeEntity[activeEntity.name].fill = false;
          activeEntity[activeEntity.name].outline = true;
          activeEntity[activeEntity.name].outlineColor = Cesium.Color.YELLOW;
          activeEntity[activeEntity.name].outlineWidth = 5.0;
          break;
        case "border":
          activeEntity[activeEntity.name].material = polylineBorderMaterial;
          break;
        case "辉光":
          activeEntity[activeEntity.name].material = polylineGlowMaterial;
          break;
        default:
          return undefined;
      }
    }
  }
};
</script>

<style lang="scss">
.introduction-component {
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
    // 绘制实体
    .entity-list {
      padding: 10px;
      margin-top: 10px;
      background: rgba(68, 68, 68, 0.4);
      border-radius: 4px;
      .draw-entity {
        font-size: 12px;
        color: white;
        .material-list {
          display: flex;
          margin-top: 5px;
          .material-item {
            width: 45px;
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
          .material-item + .material-item {
            margin-left: 5px;
          }
        }
      }
      .draw-entity + .draw-entity {
        margin-top: 10px;
      }
    }
  }
}
</style>
