let intervalInfo

export function removeMoveImage(viewer) {
  for (let i = 1; i < 7; i++) {
    const moveImage = viewer.entities.getById('Box' + i)
    if (moveImage) {
      moveImage.show = false
    }
  }
  window.clearInterval(intervalInfo)// 清除定时器
}
export function drawMoveImage(viewer) {
  var i
  var height
  for (i = 1; i < 7; i++) {
    // console.log('http://localhost/file/move/z-' + i * 1000 + '.png')
    // imageHeight = 200000.0 + i * 1000
    // console.log('Box', i)
    height = 200000.0 * 1 // 控制层数
    viewer.entities.add({
      id: 'Box' + i,
      show: false,
      rectangle: {
        coordinates: Cesium.Rectangle.fromDegrees(73.0, 12.2, 135, 54.2),
        // coordinates: Cesium.Rectangle.fromDegrees(73.0 + i, 12.2, 135 + i, 54.2),
        height: height,
        material: new Cesium.ImageMaterialProperty({
          image: 'http://47.95.129.34:9002/file/move/z-' + (i * 1000) + '.png',
          transparent: true // 是否透明
        })
      }
    })
  }
}
// 移动云图
export function moveImage(viewer) {
  // 隐藏多层效果
  removeMoveImage(viewer)
  var executeCount = 1
  window.clearInterval(intervalInfo)
  intervalInfo = setInterval(() => {
    if (executeCount >= 2) {
      var num = executeCount - 1
      var getCurrentBox1 = viewer.entities.getById('Box' + num)
      if (getCurrentBox1) {
        getCurrentBox1.show = false
      }
    }
    if (executeCount === 7) {
      // window.clearInterval(intervalInfo)
      executeCount = 1
      // removeMoveImage(viewer)
      // console.log('executeCount==', executeCount)
      // return
    }
    var getCurrentBox = viewer.entities.getById('Box' + executeCount)
    // console.log('getCurrentBox', getCurrentBox)
    if (getCurrentBox) {
      getCurrentBox.show = true
    }

    executeCount = executeCount + 1
  }, 1000)
}
