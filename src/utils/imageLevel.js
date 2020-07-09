let showImage = false
export function removeLevel(viewer) {
  if (!viewer.entities.getById(`3d-map-0`)) return
  showImage = false
  for (let i = 0; i <= 23; i++) {
    var entity = viewer.entities.getById(`3d-map-${i}`)
    if (entity) {
      entity.show = false
    }
  }
}
export function showLevel(viewer) {
  showImage = !showImage
  for (let i = 0; i <= 23; i++) {
    var entity = viewer.entities.getById(`3d-map-${i}`)
    entity.show = showImage
  }
}
export function drawImageLevel(viewer, imageName) {
  viewer.entities.add({
    id: `3d-map-${imageName}`,
    show: false,
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(73, 12.2, 135, 54.2),
      height: 20000 + imageName * 20000,
      material: new Cesium.ImageMaterialProperty({
        image: 'http://47.95.129.34:9002/file/china/z' + imageName + '.png',
        transparent: true // 是否透明
      })
    }
  })
}
