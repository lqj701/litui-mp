import webim from './utils/imsdk/webim-wx.js'

App({

  onLaunch: function (options) {

    console.log('App onLaunch options', options)

    wx.showLoading({ title: '小程序登陆中', mask: false })
    wx.hideTabBar()

    wx.clearStorageSync()
    options.query.scene && wx.setStorageSync('authToken', options.query.scene) // authToken
    options.query.salesToken && wx.setStorageSync('salesToken', options.query.salesToken) // salesToken
    options.query.redpacketOwnerToken && wx.setStorageSync('redpacketOwnerToken', options.query.redpacketOwnerToken) // redpacketOwnerToken
    options.query.getWay && wx.setStorageSync('getWay', options.query.getWay) // getWay
    options.scene && wx.setStorageSync('scene', options.scene) // scene

  },

  onShow(options) {
    console.log('App onShow options', options)

    const scene = options.scene
    if ((options.query.scene && (options.query.scene !== wx.getStorageSync('authToken'))) || (options.query.salesToken && (options.query.salesToken !== wx.getStorageSync('salesToken')))) {
      // 热启动时扫小程序码需要刷新 isLogin 状态，避免异步登陆使得数据不刷新。
      wx.showLoading({ title: '小程序登陆中', mask: false })
      wx.clearStorageSync()
    }

    options.query.scene && wx.setStorageSync('authToken', options.query.scene)  // authToken
    options.query.redpacketOwnerToken && wx.setStorageSync('redpacketOwnerToken', options.query.redpacketOwnerToken)  // redpacketOwnerToken
    options.query.salesToken && wx.setStorageSync('salesToken', options.query.salesToken) // salesToken
    options.scene && wx.setStorageSync('scene', options.scene) // scene
    options.query.getWay && wx.setStorageSync('getWay', options.query.getWay) // getWay
    wx.getStorageSync('hasMpAuth') && !wx.getStorageSync('hasRedpacket') ? wx.showTabBar() : wx.hideTabBar() // showTabBar

  },

  onHide() {
    webim.logout(() => {
      wx.removeStorageSync('isImLogin')
      console.log('im has logout')
    })
  },

  globalData: {
    historyMessage: [],
    imContacts: [],
    unreadListeners: [],
    historyMessageListeners: [],
    authVisible: false,
    authVisibleListeners: [],
    hasDecodeAuthToken: false,
  },

})


// pages/people/card/index?scene=6ac7419b4a45fe294fcde3f25fe5b350
// pages/people/card/index?scene=64f434ad96fc83be023a283fd5e88043