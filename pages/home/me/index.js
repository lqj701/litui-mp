import login from '../../../utils/login.js'
import api from '../../../utils/api.js'

Page(login({

  data: {
    isReady: false,
  },

  getRedpacketBalance() {
    const customerData = wx.getStorageSync('customerData')

    api.getRedpacketBalance(customerData.id).then((res) => {

      let result = res.data
      let informationData = {
        avatar: customerData.avatar_url || '',
        name: customerData.nickname || '',
      }
      let menuData = (result.balance / 100).toFixed(2) || '0.00'

      wx.setStorageSync('redpacketOwnerToken', result.salesToken || '')

      this.setData({
        informationData: informationData,
        menuData: menuData,
        menuVisible: true,
        sendVisible: result.haveBinded,
      })

      this.setData({ isReady: true })

    })
  },

  onLoad: function (options) {
    wx.hideLoading()
    this.getRedpacketBalance()
  },

  onShow: function () {
    if (wx.getStorageSync('customerData').id) {
      this.getRedpacketBalance()
    }
  },

}))