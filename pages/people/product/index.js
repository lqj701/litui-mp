import login from '../../../utils/login.js'
import api from '../../../utils/api.js'
import im from '../../../utils/im.js'
import { numberUpperFormat } from '../../../utils/tool.js'

Page(login({

  data: {
    productListData: null,
    isReady: false,
    page: 1,
    row: 20,
    hasNext: 1,
    unread: 0,
    isNull: false,
  },

  goto(e) {
    const productId = e.currentTarget.dataset.value
    wx.navigateTo({ url: `/pages/people/productDetail/index?productId=${productId}` })
  },

  getProductListData(lifecycle) {
    if (this.data.hasNext) {
      return new Promise((resolve, reject) => {
        api.getProductList(this.data.page, this.data.row).then((res) => {
          const result = res.data
          let products = result.products.map((data, index) => {
            return {
              id: data.product.id || '',
              name: data.product.name || '',
              price: (data.product.price / 100).toFixed(2) || 0,
              introduce: data.product.product_introduce || '这个人很懒，没有写商品简介...',
              support: data.product.support_num || 0,
              image: data.image[0] ? (data.image[0].image_url || '') : ''
            }
          })
          const topbarData = {
            name: result.wxUser.name || '',
            avatar: result.wxUser.avatar || '',
            position: result.wxUser.position || '',
          }

          if (lifecycle === 'onShow') {
            this.setData({
              productListData: result,
              products: products,
              topbarData: topbarData,
              hasNext: 1,
              page: 1,
              isNull: !products[0],
            })
          } else {
            this.setData({
              productListData: result,
              products: (this.data.products && this.data.products.length !== products.length) ? [...this.data.products, ...products] : products,
              topbarData: topbarData,
              hasNext: res.data.hasNext,
              page: this.data.page + 1,
              isNull: !products[0],
            })
          }

          wx.setStorageSync('salesData', result.wxUser)
          resolve()
        })
      })
    }
  },

  getImAccount(accountType, data) {
    return new Promise((resolve, reject) => {
      api.getImAccount(accountType, data).then((res) => {
        resolve(res.data)
      })
    })
  },

  addInfoReadProducts() {
    const customerData = wx.getStorageSync('customerData')
    api.addInfo({
      fromId: customerData.id,
      objectType: 'card',
      objectId: wx.getStorageSync('bCardInfo').id || -1,
      goalsType: 0,
      fromType: 0,
      action: 'read',
      actionGoals: 'productList',
      revisitLog: null
    })
  },

  addInfoForwardProducts() {
    const customerData = wx.getStorageSync('customerData')
    api.addInfo({
      fromId: customerData.id,
      objectType: 'card',
      objectId: wx.getStorageSync('bCardInfo').id || -1,
      goalsType: 0,
      fromType: 0,
      action: 'forward',
      actionGoals: 'productList',
      revisitLog: null
    })
  },

  onLoad: function (options, authVisible) {
    this.setData({
      authVisible: authVisible,
      salesToken: wx.getStorageSync('salesToken'),
    })
    const customerData = wx.getStorageSync('customerData')
    this.getProductListData('onLoad').then((res) => {
      wx.hideLoading()
      this.setData({
        isReady: true,
      })

      if (authVisible) {
        getApp().globalData.authVisibleListeners.push(this.addInfoReadProducts)
      } else {
        this.addInfoReadProducts()
      }

      const getSalesImAccount = this.getImAccount(1, { id: wx.getStorageSync('salesData').id })
      const getCustomerImAccount = this.getImAccount(2, { id: customerData.id, openid: customerData.openid })

      Promise.all([getSalesImAccount, getCustomerImAccount]).then((res) => {
        wx.setStorageSync('salesImAccount', res[0])
        wx.setStorageSync('customerImAccount', res[1])
        im()
      })

    })
  },

  onShow: function () {
    const customerData = wx.getStorageSync('customerData')
    const salesData = wx.getStorageSync('salesData')
    const isImLogin = wx.getStorageSync('isImLogin')

    if (customerData && !!this.data.productListData) {
      this.setData({ hasNext: 1, page: 1 })
      this.getProductListData('onShow')
      //发送情报
      this.addInfoReadProducts()
    }

    !isImLogin && salesData && customerData && im()
  },

  onReachBottom: function () {
    this.getProductListData()
  },

  onShareAppMessage: function (res) {
    const customerId = wx.getStorageSync('customerData').id
    return {
      title: `【${wx.getStorageSync('salesData').name || ''}】的产品`,
      path: `pages/people/product/index?salesToken=${this.data.salesToken}&getWay=1`,
      complete: (res) => {
        this.addInfoForwardProducts()
      }
    }
  }
}))