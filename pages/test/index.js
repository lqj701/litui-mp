import { customer } from '../../utils/core.js'

Page({

  onLoad(options) {
    wx.hideLoading()

    const params = {
      salesToken: wx.getStorageSync('salesToken'),
      getWay: wx.getStorageSync('getWay'),
      redpacket_order: null
    }

    const _customer = new customer(false, params)
    const a = _customer.customer
    console.log(a)
  },

})