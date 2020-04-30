import api from '../../utils/api.js'

Page({

  data: {
    originPath: '/pages/home/index'
  },

  userInfoHandler(e) {
    console.log(e)
    const customerData = wx.getStorageSync('customerData')
    const wxUserInfo = e.detail
    if (wxUserInfo.errMsg === 'getUserInfo:ok') {
      api.setUserInfo(customerData.openid, wxUserInfo)
      wx.reLaunch({
        url: this.data.originPath
      })
    }
  },

  onLoad: function () {
    this.setData({
      originPath: '/' + wx.getStorageSync('originPath') + '?salesToken=' + wx.getStorageSync('salesToken') + '&getWay=' + wx.getStorageSync('getWay')
    })
  },

})