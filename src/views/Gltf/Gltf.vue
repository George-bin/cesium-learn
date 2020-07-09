<template>
  <div class="Gltf-demo-component">
    <div id="china" style="width: 100%; height: 100%"></div>
    <!-- 控制裁切 -->
    <!-- <div class="clip-section">
      <h3>模型切面</h3>
    </div>-->
    <!-- 位置信息 -->
    <coordinates-component></coordinates-component>
    <!-- 切面 -->
    <clip-plane
      v-bind:clipZ.sync="clipZ"
      v-bind:clipX.sync="clipX"
      v-bind:clipY.sync="clipY"
      @updateSelectedPlane="handleUpdateSelectedPlane"
      @initEnableInputs="handleInitEnableInputs"
    ></clip-plane>
  </div>
</template>

<script>
let Cesium = null;
// import CesiumNavigation from "cesium-navigation-es6";
export default {
  name: "HelloWorld",
  components: {
    CoordinatesComponent: () =>
      import("@/components/Home/CoordinatesComponent"),
    ClipPlane: () => import("@/components/Home/ClipPlane")
  },
  data() {
    return {
      planeEntities: [],
      clippingPlanes: null,
      targetX: 15000.0,
      targetY: 15000.0,
      targetZ: 15000.0,
      selectedPlane: null,
      scene: null,
      // 指定轴的裁切值
      clipZ: 0,
      clipX: 0,
      clipY: 0,
      pickedObject: null,
      color10: null,
      color15: null,
      color20: null,
      color25: null,
      color30: null,
      color35: null,
      color40: null,
      color45: null,
      color50: null,
      color55: null,
      color60: null,
    };
  },
  watch: {
    clipZ: function(val, oldval) {
      // console.log('clipZ', val)
      this.scene.screenSpaceCameraController.enableInputs = false;
      // 移动切面
      let deltaZ = oldval - val;
      this.targetZ += deltaZ * 200;
    },
    clipX: function(val, oldval) {
      this.scene.screenSpaceCameraController.enableInputs = false;
      // 移动切面
      let deltaX = oldval - val;
      this.targetX += deltaX * 200;
    },
    clipY: function(val, oldval) {
      this.scene.screenSpaceCameraController.enableInputs = false;
      // 移动切面
      let deltaY = oldval - val;
      this.targetY += deltaY * 200;
    }
  },
  mounted() {
    Cesium = this.$Cesium;
    this.init();
  },
  destroyed() {
    window.viewer = null
  },
  methods: {
    init() {
      this.color60 = new Cesium.Color(247, 7, 231, 1);
      this.color10 = new Cesium.Color(5 / 255, 161 / 255, 243 / 255, 1);
      this.color15 = new Cesium.Color(10 / 255, 229 / 255, 243 / 255, 1);
      this.color20 = new Cesium.Color(0 / 255, 214 / 255, 4 / 255, 1);
      this.color25 = new Cesium.Color(5 / 255, 142 / 255, 1 / 255, 1);
      this.color30 = new Cesium.Color(249 / 255, 252 / 255, 5 / 255, 1);
      this.color35 = new Cesium.Color(229 / 255, 188 / 255, 8 / 255, 1);
      this.color40 = new Cesium.Color(249 / 255, 144 / 255, 3 / 255, 1);
      this.color45 = new Cesium.Color(242 / 255, 5 / 255, 0, 1);
      this.color50 = new Cesium.Color(216 / 255, 2 / 255, 6 / 255, 1);
      this.color55 = new Cesium.Color(189 / 255, 1 / 255, 0, 1);
      let that = this;
      // ion账户提供一个token去访问Bing影像底图
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmOWZmZWY1OS0zYTU1LTRmMGUtYjNiMy1mMWFlYzk3YTRkYzEiLCJpZCI6MTQ3MDgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjYyMDQyNDV9.tV8bTbhuvpVvblMieYm7KvRqUBFxEx-IHTCHMqynVi0";
      window.viewer = new Cesium.Viewer("china", {
        // 是否创建动画小器件，左下角仪表
        animation: false,
        // 是否显示图层选择器
        baseLayerPicker: false,
        // 是否全屏按钮
        fullscreenButton: false,
        // 是否显示geocoder小器件，右上角查询按钮
        geocoder: false,
        // 是否显示home按钮
        homeButton: true,
        // 是否显示信息框（实体信息）
        infoBox: false,
        // 是否显示2D/3D切换
        sceneModePicker: false,
        // 是否显示选取指示器组件显示（实体聚焦框）
        selectionIndicator: false,
        // 是否显示时间轴
        timeline: false,
        // 是否显示右上角的帮助按钮
        navigationHelpButton: false,
        // 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
        scene3DOnly: true,
        // 用于控制当前时间的时钟对象
        clock: new Cesium.Clock(),
        // 当前图像图层的显示模型，仅baseLayerPicker设为true有意义
        selectedImageryProviderViewModel: undefined,
        // 可供BaseLayerPicker选择的图像图层ProviderViewModel数组
        //imageryProviderViewModels: Cesium.createDefaultImageryProviderViewModels(),
        // 当前地形图层的显示模型，仅baseLayerPicker设为true有意义
        selectedTerrainProviderViewModel: undefined,
        // 可供BaseLayerPicker选择的地形图层ProviderViewModel数组
        terrainProviderViewModels: Cesium.createDefaultTerrainProviderViewModels(),
        // 图像图层提供者，仅baseLayerPicker设为false有意义（地球表面贴图）
        // imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
        //    url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=申请值",
        //    layer: "tdtAnnoLayer",
        //    style: "default",
        //    format: "image/jpeg",
        //    tileMatrixSetID: "GoogleMapsCompatible",
        //    show: false
        // }),
        // 地形图层提供者，仅baseLayerPicker设为false有意义
        // terrainProvider: new Cesium.EllipsoidTerrainProvider(),
        // terrainProvider: Cesium.createWorldTerrain(),
        // 用于渲染星空的SkyBox对象
        // skyBox: new Cesium.SkyBox({
        //   sources: {
        //     positiveX: '../script/Cesium-1.56.1/Build/Cesium/Assets/Textures/SkyBox/tycho2t3_80_px.jpg',
        //     negativeX: '../script/Cesium-1.56.1/Build/Cesium/Assets/Textures/SkyBox/tycho2t3_80_mx.jpg',
        //     positiveY: '../script/Cesium-1.56.1/Build/Cesium/Assets/Textures/SkyBox/tycho2t3_80_py.jpg',
        //     negativeY: '../script/Cesium-1.56.1/Build/Cesium/Assets/Textures/SkyBox/tycho2t3_80_my.jpg',
        //     positiveZ: '../script/Cesium-1.56.1/Build/Cesium/Assets/Textures/SkyBox/tycho2t3_80_pz.jpg',
        //     negativeZ: '../script/Cesium-1.56.1/Build/Cesium/Assets/Textures/SkyBox/tycho2t3_80_mz.jpg'
        //   }
        // }),
        // 全屏时渲染的HTML元素
        // fullscreenElement: document.body,
        // 如果需要控制渲染循环，则设为true
        useDefaultRenderLoop: true,
        // 使用默认render loop时的帧率
        targetFrameRate: undefined,
        // 如果设为true，将在一个HTML面板中显示错误信息
        showRenderLoopErrors: false,
        // 自动追踪最近添加的数据源的时钟设置
        automaticallyTrackDataSourceClocks: true,
        // 传递给Scene对象的上下文参数（scene.options）
        contextOptions: undefined,
        // 初始场景模式
        sceneMode: Cesium.SceneMode.SCENE3D,
        // 地图投影体系
        mapProjection: new Cesium.WebMercatorProjection(),
        // 需要进行可视化的数据源的集合
        dataSources: new Cesium.DataSourceCollection(),
        // vrButton: false,
        // 地球表面贴图
        imageryProvider: new Cesium.UrlTemplateImageryProvider({
          url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
          maximumLevel: 13,
          minimumLevel: 3
        })
      });
      this.scene = window.viewer.scene;
      // 去除版权信息
      window.viewer._cesiumWidget._creditContainer.style.display = "none";
      // 显示桢速
      window.viewer.scene.debugShowFramesPerSecond = true;
      // 设置相机的默认视角
      window.viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(117, 24, 2000000), // 设置位置
        orientation: {
          heading: Cesium.Math.toRadians(-18.0), // 方向
          pitch: Cesium.Math.toRadians(-70.0), // 倾斜角度
          roll: 0
        }
      });

      let point = Cesium.Cartesian3.fromDegrees(0, 0, 0);
      console.log(point);

      // 点击home键进行跳转
      window.viewer.homeButton.viewModel.command.beforeExecute.addEventListener(
        function(e) {
          e.cancel = true;
          // 你要飞的位置
          var rectangle = Cesium.Rectangle.fromDegrees(73, 12.2, 135, 54.2);
          window.viewer.camera.flyTo({
            destination: rectangle,
            orientation: {
              heading: 25, // 方向
              pitch: Cesium.Math.toRadians(-89.91), // 倾斜角度
              roll: 0
            }
          });
        }
      );

      // 禁用放大缩小和自由旋转视图
      // window.viewer.scene.screenSpaceCameraController.enableZoom = false;
      // window.viewer.scene.screenSpaceCameraController.enableTilt = false;

      window.viewer.scene.globe.enableLighting = false;
      window.viewer.shadows = false;
      // window.viewer.scene.postProcessStages.fxaa.enabled = false;
      window.viewer.scene.skyBox.show = false;
      // window.viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0);
      // 加载中国地区数据
      // this.handleLoadChinaJson();
      // 禁止相机地形穿透
      this.handleCameraStop();
      // 创建鼠标悬浮事件
      // this.handleCreateMouseHoverEvent();

      // Load Cesium World Terrain(生成全球地形实例)
      // window.viewer.terrainProvider = Cesium.createWorldTerrain({
      //   requestWaterMask: true, // required for water effects
      //   requestVertexNormals: true // required for terrain lighting
      // });
      // 打开深度检测，那么在地形以下的对象不可见
      // window.viewer.scene.globe.depthTestAgainstTerrain = true;

      // 添加图层
      // window.viewer.imageryLayers.addImageryProvider(new Cesium.IonImageryProvider({ assetId: 3 }));
      // this.handleSetLengthwaysClipPlane();

      // 加载模型 start
      this.handleLoadLengthwaysModel()
      // this.handleInitCropEvent();
      // this.initCesiumNavigation();
    },
    // 指北针
    initCesiumNavigation() {
      var options = {};
      // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
      options.defaultResetView = Cesium.Rectangle.fromDegrees(80, 22, 130, 50);
      // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
      options.enableCompass= true;
      // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
      options.enableZoomControls= false;
      // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
      options.enableDistanceLegend= false;
      // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
      options.enableCompassOuterRing= true;
      CesiumNavigation(viewer, options);
    },
    // 加载纵向裁切模型
    handleLoadLengthwaysModel() {
      this.loadLengthwaysModel(10, this.color10, true);
      this.loadLengthwaysModel(15, this.color15, false);
      this.loadLengthwaysModel(20, this.color20, false);
      this.loadLengthwaysModel(25, this.color25, false);
      this.loadLengthwaysModel(30, this.color30, true);
      this.loadLengthwaysModel(35, this.color35, false);
      this.loadLengthwaysModel(40, this.color40, true);
      this.loadLengthwaysModel(45, this.color45, true);
      this.loadLengthwaysModel(50, this.color50, true);
      this.loadLengthwaysModel(55, this.color55, true);
    },
    handleLoadLevelModel() {
      this.loadLevelModel(10, this.color10, true);
      this.loadLevelModel(15, this.color15, false);
      this.loadLevelModel(20, this.color20, false);
      this.loadLevelModel(25, this.color25, false);
      this.loadLevelModel(30, this.color30, true);
      this.loadLevelModel(35, this.color35, false);
      this.loadLevelModel(40, this.color40, true);
      this.loadLevelModel(45, this.color45, true);
      this.loadLevelModel(50, this.color50, true);
      this.loadLevelModel(55, this.color55, true);
    },
    // 裁切事件
    handleInitCropEvent() {
      let that = this;
      // Select plane when mouse down
      let downHandler = new Cesium.ScreenSpaceEventHandler(
        window.viewer.scene.canvas
      );
      downHandler.setInputAction(function(movement) {
        console.log(movement.position);
        let pickedObject = that.scene.pick(movement.position);
        if (
          Cesium.defined(pickedObject) &&
          Cesium.defined(pickedObject.id) &&
          Cesium.defined(pickedObject.id.plane)
        ) {
          that.selectedPlane = pickedObject.id.plane;
          that.selectedPlane.material = Cesium.Color.WHITE.withAlpha(0);
          that.selectedPlane.outlineColor = Cesium.Color.WHITE;
          that.scene.screenSpaceCameraController.enableInputs = false;
        }
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

      // Release plane on mouse up
      let upHandler = new Cesium.ScreenSpaceEventHandler(
        window.viewer.scene.canvas
      );
      upHandler.setInputAction(function() {
        if (Cesium.defined(that.selectedPlane)) {
          that.selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.01);
          that.selectedPlane.outlineColor = Cesium.Color.WHITE;
          that.selectedPlane = undefined;
        }

        that.scene.screenSpaceCameraController.enableInputs = true;
      }, Cesium.ScreenSpaceEventType.LEFT_UP);

      // Update plane on mouse move
      let moveHandler = new Cesium.ScreenSpaceEventHandler(
        window.viewer.scene.canvas
      );
      moveHandler.setInputAction(function(movement) {
        if (Cesium.defined(that.selectedPlane)) {
          let deltaY = movement.startPosition.y - movement.endPosition.y;
          that.targetY += deltaY * 20;
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },
    // 纵向裁切
    handleInitLengthwaysClipEvent() {},
    // 添加图层
    handleAddImageryProvider() {
      // 卫星图层
      var imageLayer = new Cesium.WebMapTileServiceImageryProvider({
        url:
          "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=申请值",
        layer: "tdtImgBasicLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",
        show: false
      });
      // 注记图层
      var markLayer = new Cesium.WebMapTileServiceImageryProvider({
        url:
          "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=申请值",
        layer: "tdtImgAnnoLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",
        show: false
      });
      window.viewer.imageryLayers.addImageryProvider(imageLayer);
      window.viewer.imageryLayers.addImageryProvider(markLayer);
    },
    // 加载中国地区数据
    handleLoadChinaJson() {
      let nameMap = new Map();
      Cesium.Math.setRandomNumberSeed(0);
      var promise = Cesium.GeoJsonDataSource.load(
        "../../static/js/china.json",
        {
          stroke: new Cesium.Color(7 / 255, 179 / 255, 207 / 255, 1),
          fill: new Cesium.Color(0, 87 / 255, 141 / 255, 1),
          // strokeWidth: 3,
          markerSymbol: "?"
        }
      );
      promise.then(dataSource => {
        window.viewer.dataSources.add(dataSource);
        var entities = dataSource.entities.values;
        var colorHash = {};
        for (var i = 0; i < entities.length; i++) {
          var entity = entities[i];
          var name = entity.name;
          entity.polygon.outline = true;
          entity.polygon.outlineWidth = 3;
          entity.polygon.extrudedHeight = 100000.0;
          let nameTemp = nameMap.get(name);
          if (!nameTemp) {
            nameMap.set(name, name);
            let randomNum = Math.random();
            let randomInt = (randomNum * 1000 + "").split(".")[0];
            // 绘制地名标签
            window.viewer.entities.add({
              position: Cesium.Cartesian3.fromDegrees(
                entity.properties.longitude["_value"],
                entity.properties.latitude["_value"],
                randomNum * 500000.0 + 300000.0
              ),
              label: {
                text: name + "\n" + randomInt + "个",
                font: "normal 1.6vh MicroSoft YaHei", // 字体样式
                verticalOrigin: Cesium.VerticalOrigin.CENTER, // 垂直位置
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER // 水平位置
              }
            });
            // 绘制柱状的数据
            window.viewer.entities.add({
              name: "box-" + entity.id,
              position: Cesium.Cartesian3.fromDegrees(
                entity.properties.longitude["_value"],
                entity.properties.latitude["_value"],
                300000.0
              ),
              box: {
                dimensions: new Cesium.Cartesian3(
                  50000.0,
                  50000.0,
                  randomNum * 500000.0
                ),
                material: new Cesium.Color(0, 222 / 255, 1, 1)
              }
            });
          }
        }
      });
    },
    // 禁止相机地形穿透
    handleCameraStop() {
      const that = this;
      window.viewer.clock.onTick.addEventListener(function() {
        if (window.viewer.camera.pitch > 0) {
          window.viewer.scene.screenSpaceCameraController.enableTilt = false;
        }
      });

      var mousePosition, startMousePosition;
      var handler = new Cesium.ScreenSpaceEventHandler(window.viewer.canvas);
      handler.setInputAction(function(movement) {
        mousePosition = startMousePosition = Cesium.Cartesian3.clone(
          movement.position
        );
        handler.setInputAction(function(movement) {
          mousePosition = movement.endPosition;
          var y = mousePosition.y - startMousePosition.y;
          if (y > 0) {
            window.viewer.scene.screenSpaceCameraController.enableTilt = true;
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      }, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);
    },
    // 创建鼠标悬浮事件
    handleCreateMouseHoverEvent() {
      var currentEntity = null;
      var lastEntity = null;
      var that = this;
      window.viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(
        movement
      ) {
        if (window.viewer.scene.mode !== Cesium.SceneMode.MORPHING) {
          var pickedFeature = window.viewer.scene.pick(movement.endPosition);
          if (Cesium.defined(pickedFeature)) {
            if (pickedFeature.id != undefined && pickedFeature.id.polygon) {
              let entity = pickedFeature.id;
              if (
                lastEntity === null ||
                lastEntity._id !== pickedFeature.id._id
              ) {
                if (lastEntity !== null) {
                  lastEntity.polygon.material = new Cesium.Color(
                    9 / 255,
                    52 / 255,
                    91 / 255,
                    1
                  );
                  lastEntity.polygon.extrudedHeight = 100000.0;
                  lastEntity.polygon.outline = true;
                }
                lastEntity = pickedFeature.id;
                entity.polygon.material = new Cesium.Color(
                  30 / 255,
                  165 / 255,
                  253 / 255,
                  1
                );
                entity.polygon.extrudedHeight = 270000.0;
                entity.polygon.outline = false;
              }
            }
          } else {
            if (lastEntity !== null) {
              lastEntity.polygon.material = new Cesium.Color(
                9 / 255,
                52 / 255,
                91 / 255,
                1
              );
              lastEntity.polygon.extrudedHeight = 100000.0;
              lastEntity.polygon.outline = true;
            }
          }
        }
      },
      Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },
    createPlaneUpdateFunctionY(plane) {
      let that = this;
      return function() {
        // console.log('plane', plane)
        plane.distance = that.targetY;
        return plane;
      };
    },
    createPlaneUpdateFunctionX(plane) {
      let that = this;
      return function() {
        // console.log('plane', plane)
        plane.distance = that.targetX;
        return plane;
      };
    },
    createPlaneUpdateFunctionZ(plane) {
      let that = this;
      return function() {
        // console.log('plane', plane)
        plane.distance = that.targetZ;
        return plane;
      };
    },
    // 加载纵向裁切模型
    loadLengthwaysModel(name, color, isHidden) {
      let imagePath = "";
      let that = this;
      if (process.env.NODE_ENV === "production") {
        imagePath = "gis/";
      }
      // let url = '../../../' + process.env.GIS_HOST + 'static/3dmodel/' + name + '-d.gltf';
      let url =
        "../../../" +
        process.env.GIS_HOST.host +
        imagePath +
        "static/3dmodel/" +
        name +
        "-d.gltf";
      // console.log("url", url);

      let distance = 0;
      // 创建一组剪切平面
      this.clippingPlanes = new Cesium.ClippingPlaneCollection({
        planes: [
          new Cesium.ClippingPlane(
            new Cesium.Cartesian3(0.0, 0.0, -10.0),
            distance
          )
        ],
        edgeWidth: 0.0,
        edgeColor: Cesium.Color.TRANSPARENT,
        unionClippingRegions: false
      });

      var position = Cesium.Cartesian3.fromDegrees(116.5, 34.5, 200000);
      // 设置模型方向
      var heading = Cesium.Math.toRadians(89); // 旋转
      var pitch = 0; // 上下翻转
      var roll = 0; // 左右翻转
      var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      var orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        hpr
      );
      var entity = window.viewer.entities.add({
        id: name,
        name: "gltfModel",
        position: position,
        orientation: orientation,
        model: {
          uri: url,
          scale: 2000,
          minimumPixelSize: 100.0,
          clippingPlanes: that.clippingPlanes,
          color: color,
          show: true,
          colorBlendMode: 1
        }
      });
      // window.viewer.trackedEntity = entity;

      for (var i = 0; i < this.clippingPlanes.length; ++i) {
        var plane = this.clippingPlanes.get(i);
        var planeEntity = window.viewer.entities.add({
          id: "lengthwaysPlane" + i + name,
          position: position,
          plane: {
            dimensions: new Cesium.Cartesian2(2000000.0, 2000000.0),
            material: Cesium.Color.WHITE.withAlpha(0.0),
            plane: new Cesium.CallbackProperty(
              that.createPlaneUpdateFunctionZ(plane),
              false
            ),
            outline: false,
            outlineColor: Cesium.Color.WHITE
          }
        });
        if (planeEntity) {
          this.planeEntities.push(planeEntity);
        }
      }
      entity.show = isHidden;
    },
    // 加载水平裁切模型
    loadLevelModel(name, color, isHidden) {
      let imagePath = "";
      let that = this;
      if (process.env.NODE_ENV === "production") {
        imagePath = "gis/";
      }
      // let url = '../../../' + process.env.GIS_HOST + 'static/3dmodel/' + name + '-d.gltf';
      let url =
        "../../../" +
        process.env.GIS_HOST +
        imagePath +
        "static/3dmodel/" +
        name +
        "-d.gltf";
      // console.log("url", url);

      let distance = 0;
      // 创建一组剪切平面
      this.clippingPlanes = new Cesium.ClippingPlaneCollection({
        planes: [
          // new Cesium.ClippingPlane(
          //   new Cesium.Cartesian3(83.0, 0.0, 0.0),
          //   distance
          // ),
          new Cesium.ClippingPlane(
            new Cesium.Cartesian3(-83.0, 0.0, 0.0),
            distance
          ),
          // new Cesium.ClippingPlane(
          //   new Cesium.Cartesian3(0.0, 83.0, 0.0),
          //   distance
          // ),
          new Cesium.ClippingPlane(
            new Cesium.Cartesian3(0.0, -83.0, 0.0),
            distance
          )
        ],
        edgeWidth: 0.0,
        edgeColor: Cesium.Color.TRANSPARENT,
        unionClippingRegions: true
      });

      var position = Cesium.Cartesian3.fromDegrees(116.5, 34.5, 200000);
      // 设置模型方向
      var heading = Cesium.Math.toRadians(89); // 旋转
      var pitch = 0; // 上下翻转
      var roll = 0; // 左右翻转
      var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      var orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        hpr
      );
      var entity = window.viewer.entities.add({
        id: name,
        name: "gltfModel",
        position: position,
        orientation: orientation,
        model: {
          uri: url,
          scale: 2000,
          minimumPixelSize: 100.0,
          clippingPlanes: that.clippingPlanes,
          color: color,
          show: true,
          colorBlendMode: 1
        }
      });
      // window.viewer.trackedEntity = entity;
      // "cesium-navigation-es6": "^1.0.8"
      for (var i = 0; i < this.clippingPlanes.length; ++i) {
        var plane = this.clippingPlanes.get(i);
        var planeEntity = window.viewer.entities.add({
          id: "levelPlane" + i + name,
          position: position,
          plane: {
            dimensions: new Cesium.Cartesian2(2000000.0, 200000.0),
            material: Cesium.Color.WHITE.withAlpha(0.0),
            plane: new Cesium.CallbackProperty(
              i === 0 ?  that.createPlaneUpdateFunctionX(plane) : that.createPlaneUpdateFunctionY(plane),
              false
            ),
            outline: false,
            outlineColor: Cesium.Color.WHITE
          }
        });
        if (planeEntity) {
          this.planeEntities.push(planeEntity);
        }
      }
      entity.show = isHidden;
    },
    handleInitEnableInputs() {
      this.scene.screenSpaceCameraController.enableInputs = true;
    },
    handleUpdateSelectedPlane(e) {
      // console.log(window.viewer.entities.removeAll())
      this.scene.screenSpaceCameraController.enableInputs = true;
      console.log('this.targetY', this.targetY)
      if (e === 'lengthways') {
        if (window.viewer.entities.getById("lengthwaysPlane010")) return
        window.viewer.entities.removeAll()
        // window.viewer.camera.setView({
        //   destination: Cesium.Cartesian3.fromDegrees(110, 14, 5500000), // 设置位置
        //   orientation: {
        //     heading: Cesium.Math.toRadians(-3.0), // 方向
        //     pitch: Cesium.Math.toRadians(-70.0), // 倾斜角度
        //     roll: 0
        //   }
        // });
        this.targetX = 15000.0
        this.targetY = 15000.0
        this.handleLoadLengthwaysModel()
        // window.viewer.entities.remove('10');
      } else {
        if (window.viewer.entities.getById("levelPlane010")) return
        window.viewer.entities.removeAll()
        this.targetZ = 15000.0
        this.handleLoadLevelModel()
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.Gltf-demo-component {
  height: 100vh;
}
</style>
