let UA = navigator.userAgent
/**
 * 判断运行环境
 */
export const isMobile = UA.indexOf('iPhone') > -1 || UA.indexOf('Android') > -1

/**
 * 图片缩放比例
 */
// export const mapScaling = isMobile ? 0.5 : 1
export const mapScaling = 0.5

/**
 * 初始化相机视角
 */
export function initCameraAngle (angle) {
  if (!Cesium || !window.viewer || !angle) return
  // 设置镜头位置与方向
  console.log('初始化相机视角', angle)
  const initialPosition = new Cesium.Cartesian3.fromDegrees(
    Number(angle.lon),
    Number(angle.lat),
    Number(angle.height)
  )
  const homeCameraView = {
    destination: initialPosition,
    orientation: {
      heading: Cesium.Math.toRadians(
        Number(this.getInitCameraData.heading)
      ),
      pitch: Cesium.Math.toRadians(Number(this.getInitCameraData.pitch)),
      roll: 0.0
    }
  }
  // eslint-disable-next-line no-undef
  viewer.scene.camera.setView(homeCameraView)
}

/**
 * 获取屏幕中心点坐标
 */
export function getScreenCenterCoord () {
  if (!Cesium || !window.viewer) return null
  let result = viewer.camera.pickEllipsoid(
    new Cesium.Cartesian2(
      viewer.canvas.clientWidth / 2,
      viewer.canvas.clientHeight / 2
    )
  );
  let curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(result)
  let lng = (curPosition.longitude * 180) / Math.PI
  let lat = (curPosition.latitude * 180) / Math.PI
  let height = viewer.scene.globe.ellipsoid.cartesianToCartographic(
    viewer.camera.position
  ).height
  return {
    lng,
    lat,
    height
  }
}

/**
 * 经纬度像素换算
 * @params coord: 坐标
 */
export function coordMatrixingPX({ lng, lat }) {
  const westLon = 73; // 西经
  const eastLon = 135; // 东经
  const northLan = 54.2; // 北纬边界值
  const southLan = 12.2; // 南纬

  // let x1=123  //裁剪的西经
  // let x2=133 //裁剪的东经
  // let y1=44.2 //裁剪的北纬
  // let y2=34.2 //裁剪的南纬

  const clipX = (lng - westLon) * 100 * mapScaling;
  const clipY = (northLan - lat) * 100 * mapScaling;
  return {
    clipX,
    clipY
  };
}

/**
 * 3D空间坐标转为经纬度坐标
 * @params coord: 空间坐标
 */
export function spaceCoordToLng (coord) {
  let ellipsoid = viewer.scene.globe.ellipsoid;
  let cartographic = ellipsoid.cartesianToCartographic(coord);
  let lat = Cesium.Math.toDegrees(cartographic.latitude);
  let lng = Cesium.Math.toDegrees(cartographic.longitude);
  return {
    lng,
    lat
  }
}

/**
 * 计算canvas宽度
 * @param point1: 
 * @param point2: 
 */
export function getCanvasWidth({ point1, point2 }) {
  // const westLon = 73 // 西经
  // const eastLon = 135 // 东经
  // const northLan = 54.2 // 北纬边界值
  // const southLan = 12.2 // 南纬

  // let x1=123  //裁剪的西经
  // let x2=133 //裁剪的东经
  // let y1=44.2 //裁剪的北纬
  // let y2=34.2 //裁剪的南纬

  let point3 = {
    lng: 0,
    lat: 0
  };

  let point1Location = {
    left: true,
    top: true
  };
  if (point1.lng < point2.lng) {
    // 在左
    point1Location.left = true;
  } else {
    // 在右
    point1Location.left = false;
  }
  // 纬度对比 => 判断出上下
  if (point1[1] > point2[1]) {
    // 在上
    point1Location.top = true;
  } else {
    // 在下
    point1Location.top = false;
  }
  // point1到point3
  let a = 0;
  // point1到point3
  let b = 0;
  // canvas宽度
  let c = 0;

  // point1位于左上角的位置
  if (point1Location.left && point1Location.top) {
    point3 = {
      lng: point2.lng,
      lat: point1.lat
    };
    a = Math.abs(point3.lng - point1.lng) * 100;
    b = Math.abs(point3.lat - point2.lat) * 100;
  } else if (point1Location.left && !point1Location.top) {
    // point1位于左下角的位置
    point3 = {
      lng: point1.lng,
      lat: point2.lat
    };
    a = Math.abs(point3.lat - point1.lat) * 100;
    b = Math.abs(point2.lng - point3.lng) * 100;
  } else if (!point1Location.left && point1Location.top) {
    // point1位于右上角的位置
    point3 = {
      lng: point2.lng,
      lat: point1.lat
    };
    a = Math.abs(point1.lng - point3.lng) * 100;
    b = Math.abs(point3.lat - point2.lat) * 100;
  } else {
    // point1位于右下角的位置
    point3 = {
      lng: point2.lng,
      lat: point1.lat
    };
    a = Math.abs(point3.lng - point1.lng) * 100;
    b = Math.abs(point2.lat - point3.lat) * 100;
  }

  c = Math.sqrt(a * a + b * b);
  return c;
}
