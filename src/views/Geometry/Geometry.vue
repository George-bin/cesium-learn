<template>
  <div class="geometry-instance-component">
    <div id="china" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script>
let Cesium = null;
export default {
  name: "",
  props: {},
  components: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    Cesium = this.$Cesium;
    this.init();
    // this.test();
    this.test2();
  },
  methods: {
    init() {
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
          url:
            "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
          maximumLevel: 13,
          minimumLevel: 3
        })
      });
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
    test() {
      // GeometryInstance是Geometry的一个容器
      // 1、模型矩阵
      var scale = 50000;
      var position = Cesium.Cartesian3.fromDegrees(73, 12.2);
      var point3d = new Cesium.Cartesian3(73, 12.2, 1000);
      var translation = Cesium.Transforms.eastNorthUpToFixedFrame(position);
      var matrix = Cesium.Matrix4.multiplyByTranslation(
        translation,
        point3d,
        new Cesium.Matrix4()
      );
      var modelMatrix = Cesium.Matrix4.multiplyByUniformScale(
        matrix,
        scale,
        new Cesium.Matrix4()
      );

      var instances = [];
      const color20 = new Cesium.Color(0 / 255, 214 / 255, 4 / 255, 1);
      const color25 = new Cesium.Color(5 / 255, 142 / 255, 1 / 255, 1);
      const color30 = new Cesium.Color(249 / 255, 252 / 255, 5 / 255, 1);
      const color35 = new Cesium.Color(229 / 255, 188 / 255, 8 / 255, 1);
      const color40 = new Cesium.Color(249 / 255, 144 / 255, 3 / 255, 1);
      const color45 = new Cesium.Color(242 / 255, 5 / 255, 0, 1);
      const color50 = new Cesium.Color(216 / 255, 2 / 255, 6 / 255, 1);
      const color60 = new Cesium.Color(247, 7, 231, 1);
      for (let i = 20; i <= 20; i += 5) {
        let color = null;
        if (i === 20) {
          color = color20;
        } else if (i === 25) {
          color = color25;
        } else if (i === 30) {
          color = color30;
        } else if (i === 35) {
          color = color35;
        } else if (i === 40) {
          color = color40;
        } else if (i === 45) {
          color = color45;
        } else if (i === 50) {
          color = color50;
        } else if (i === 60) {
          color = color60;
        }
        console.log(new this.TetrahedronGeometry(i))
        // 四面体的实例(定义了一个Geometry容器)
        const instance = new Cesium.GeometryInstance({
          // geometry : Cesium.GeometryPipeline.toWireframe(new this.TetrahedronGeometry()),
          geometry: new this.TetrahedronGeometry(i),
          modelMatrix: modelMatrix,
          attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(color) // 白色
          }
        });
        instances.push(instance);
      }
      // 加入场景
      viewer.scene.primitives.add(
        new Cesium.Primitive({
          geometryInstances: instances, // 合并几何图元
          appearance: new Cesium.PerInstanceColorAppearance({
            flat: false,
            translucent: false
            // closed:true
          }),
          asynchronous: false
        })
      );
    },
    TetrahedronGeometry(i) {
      // let url = "http://localhost/file/data/cesium/positions-" + i + ".json";
      // let data = [];
      // //从别处获取模型
      // $.ajax({
      //   url: url,
      //   async: false,
      //   success: function(res) {
      //     data = res;
      //   }
      // });

      //四面体的四个顶点
      // let positions = data[0];
      var positions = [
        0.0, 0.0, 0.0,
        7500000.0, 0.0, 0.0,
        0.0, 7500000.0, 0.0
      ];
      var attributes = new Cesium.GeometryAttributes({
        position: new Cesium.GeometryAttribute({
          componentDatatype: Cesium.ComponentDatatype.DOUBLE,
          componentsPerAttribute: 3,
          values: positions
        })
      });
      //顶点索引
      // let indices = data[1];
      let indices = new Uint16Array([0, 1, 1, 2, 2, 0])

      //包围球
      var boundingSphere = new Cesium.BoundingSphere(
        new Cesium.Cartesian3(0.0, 0.0, 0.0),
        10.0
      );

      return Cesium.GeometryPipeline.computeNormal(
        new Cesium.Geometry({
          attributes: attributes,
          indices: indices,
          primitiveType: Cesium.PrimitiveType.TRIANGLES,
          // boundingSphere: boundingSphere
          boundingSphere: Cesium.BoundingSphere.fromVertices(positions)
        })
      )

      // var geometry = Cesium.GeometryPipeline.computeNormal(
      //   new Cesium.Geometry({
      //     attributes: attributes,
      //     indices: indices,
      //     primitiveType: Cesium.PrimitiveType.TRIANGLES,
      //     boundingSphere: boundingSphere
      //   })
      // );
      // this.attributes = geometry.attributes;
      // this.indices = geometry.indices;
      // this.primitiveType = geometry.primitiveType;
      // this.boundingSphere = geometry.boundingSphere;
      //this.boundingSphere = Cesium.BoundingSphere.fromVertices(positions);
    },
    test2() {
      let ellipsoid = viewer.scene.globe.ellipsoid;
      //模型矩阵
      var modelMatrix = Cesium.Matrix4.multiplyByUniformScale(
        Cesium.Matrix4.multiplyByTranslation(
          Cesium.Transforms.eastNorthUpToFixedFrame(
            ellipsoid.cartographicToCartesian(
              Cesium.Cartographic.fromDegrees(-100.0, 40.0)
            )
          ),
          new Cesium.Cartesian3(0.0, 0.0, 200000.0)
        ),
        500000.0
      );
    
      //四面体的实例
      var instance = new Cesium.GeometryInstance({
        geometry : new TetrahedronGeometry(),
        modelMatrix : modelMatrix,
        attributes : {
            color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.WHITE)    //白色
        }
      });
    
      //加入场景
      viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances : instance,
        appearance : new Cesium.PerInstanceColorAppearance({
            flat : true,
            translucent : false
        })
      }));

      function TetrahedronGeometry () {
        var negativeRootTwoOverThree = -Math.sqrt(2.0) / 3.0;
        var negativeOneThird = -1.0 / 3.0;
        var rootSixOverThree = Math.sqrt(6.0) / 3.0;
        
        //四面体的四个顶点
        var positions = new Float64Array(4 * 3);

        // position 0
        positions[0] = 0.0;
        positions[1] = 0.0;
        positions[2] = 1.0;

        // position 1
        positions[3] = 0.0;
        positions[4] = (2.0 * Math.sqrt(2.0)) / 3.0;
        positions[5] = negativeOneThird;

        // position 2
        positions[6] = -rootSixOverThree;
        positions[7] = negativeRootTwoOverThree;
        positions[8] = negativeOneThird;

        // position 3
        positions[9] = rootSixOverThree;
        positions[10] = negativeRootTwoOverThree;
        positions[11] = negativeOneThird;

        var attributes = new Cesium.GeometryAttributes({
            position : new Cesium.GeometryAttribute({
                componentDatatype : Cesium.ComponentDatatype.DOUBLE,
                componentsPerAttribute : 3,
                values : positions
            })
        });

        //顶点索引
        var indices = new Uint16Array(4 * 3);

        // back triangle
        indices[0] = 0;
        indices[1] = 1;
        indices[2] = 2;

        // left triangle
        indices[3] = 0;
        indices[4] = 2;
        indices[5] = 3;

        // right triangle
        indices[6] = 0;
        indices[7] = 3;
        indices[8] = 1;

        // bottom triangle
        indices[9] = 2;
        indices[10] = 1;
        indices[11] = 3;
        
        //包围球
        var boundingSphere = new Cesium.BoundingSphere(new Cesium.Cartesian3(0.0,0.0,0.0),1.0);

        var geometry = Cesium.GeometryPipeline.computeNormal(new Cesium.Geometry({
            attributes: attributes,
            indices: indices,
            primitiveType: Cesium.PrimitiveType.TRIANGLES,
            boundingSphere: boundingSphere
        }));

        this.attributes = geometry.attributes;
        this.indices = geometry.indices;
        this.primitiveType = geometry.primitiveType;
        this.boundingSphere = geometry.boundingSphere;
        //this.boundingSphere = Cesium.BoundingSphere.fromVertices(positions);
      };
    }
  }
};
</script>

<style lang="scss">
.geometry-instance-component {
  height: 100vh;
}
</style>
