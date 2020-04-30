// 监听小程序版本状态并请求更新

export default function update() {

  const updateManager = wx.getUpdateManager()

  updateManager.onCheckForUpdate(function (res) {
    console.log(res)
  })

  updateManager.onUpdateReady(function () {
    wx.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success: function (res) {
        if (res.confirm) {
          wx.clearStorage()
          updateManager.applyUpdate()
        }
      }
    })
  })

  updateManager.onUpdateFailed(function () {
    wx.showToast({
      title: '升级失败了ww',
    })
  })
  
}
