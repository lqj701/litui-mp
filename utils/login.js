import { wxLogin, wxGetSetting, wxGetUserInfo } from '../utils/wx.js'
import api from '../utils/api.js'

function getPageInstance() {
  var pages = getCurrentPages();
  return pages[pages.length - 1];
}

function decodeAuthToken(authToken) {
  return new Promise((resolve, reject) => {
    api.decodeAuthToken(authToken)
      .then((res) => {
        wx.setStorageSync('salesToken', res.data.salesToken)
        wx.setStorageSync('getWay', res.data.getWay)
        wx.setStorageSync('hasDecodeAuthToken', true)
        resolve(res.data.salesToken, res.data.getWay)
      })
  })
}

function globalLogin(options) {
  console.log('Page login check start', options)
  const authToken = wx.getStorageSync('authToken')
  const hasDecodeAuthToken = wx.getStorageSync('hasDecodeAuthToken')
  const orderId = options.orderId || ''

  return new Promise((resolve, reject) => {
    const isLogin = wx.getStorageSync('isLogin')
    // 第一次登陆完成后，以后可以进行异步登陆，新增客户需要
    isLogin && resolve()
    if (options.scene && (options.scene !== authToken || !isLogin) && !hasDecodeAuthToken && !options.salesToken) {
      decodeAuthToken(authToken).then((res) => {
        const { salesToken, getWay } = res
        wxLogin().then((res) => {
          const code = res.code
          api.customerLogin(code, { salesToken: salesToken, getWay: Number(getWay), redpacket_order: orderId }).then((res) => {
            res.data.nickname && wx.setStorageSync('hasMpAuth', true)
            wx.setStorageSync('isLogin', true)
            wx.setStorageSync('customerData', res.data)
            resolve()
          })
        })
      })
    } else {
      wxLogin().then((res) => {
        const salesToken = wx.getStorageSync('salesToken')
        const getWay = wx.getStorageSync('getWay')
        const code = res.code
        api.customerLogin(code, { salesToken: salesToken, getWay: Number(getWay), redpacket_order: orderId }).then((res) => {
          res.data.nickname && wx.setStorageSync('hasMpAuth', true)
          wx.setStorageSync('isLogin', true)
          wx.setStorageSync('customerData', res.data)
          resolve()
        })
      })
    }
  })
}

export default function login(pageObj) {
  const { onLoad } = pageObj
  pageObj.onLoad = (options) => {
    globalLogin(options).then(() => {
      const hasMpAuth = wx.getStorageSync('hasMpAuth')
      hasMpAuth ? wx.showTabBar() : wx.hideTabBar()
      wx.showLoading({ title: '智能搜索中', mask: false })
      const currentInstance = getPageInstance()
      onLoad.call(currentInstance, options, !hasMpAuth);
    })
  }

  return pageObj
}
