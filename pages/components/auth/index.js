import api from '../../../utils/api.js'

Component({

  data: {
    visible: true,
  },

  methods: {
    getAuth(e) {
      const customerData = wx.getStorageSync('customerData')
      const wxUserInfo = e.detail
      wx.setStorageSync('wxUserInfo', wxUserInfo)
      if (wxUserInfo.errMsg === 'getUserInfo:ok' && customerData) {
        api.setUserInfo(customerData.openid, wxUserInfo).then(() => {
          wx.setStorageSync('hasMpAuth', true)
          this.setData({ visible: false })
          getApp().globalData.authVisibleListeners.forEach((fn) => fn())
        })
        wx.showTabBar({ animation: true })
      }
    },
  },

})
