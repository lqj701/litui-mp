import login from '../../../utils/login.js'
import api from '../../../utils/api.js'
import im from '../../../utils/im.js'
import { numberUpperFormat } from '../../../utils/tool.js'

Page(login({

  data: {
    productData: null,
    supportState: false,
    isReady: false,
  },

  getProductSupportState(productId) {
    const customerId = wx.getStorageSync('customerData').id
    return new Promise((resolve, reject) => {
      api.getProductSupportState(customerId, productId).then(res => {
        this.setData({ supportState: res.data })
        resolve()
      })
    })
  },

  getProductData(productId) {
    return new Promise((resolve, reject) => {
      const customerId = wx.getStorageSync('customerData').id
      api.getProductDetail(productId).then((res) => {
        const result = res.data
        const productData = {
          id: result.product.id || 0,
          name: result.product.name || '',
          introduce: result.product.product_introduce || '这个人很懒，没有写商品简介...',
          price: (result.product.price / 100).toFixed(2) || 0,
          support: result.product.support_num || 0,
          coverImages: result.imageShow || [],
          images: result.imageDetail || []
        }

        const topbarData = {
          productId: result.product.id || 0,
          name: result.wxUser.name || '',
          avatar: result.wxUser.avatar || '',
          position: result.wxUser.position || '',
          unread: result.wxUser.unread || 0
        }

        const actionbarData = {
          customerId: customerId,
          forward: result.product.forward_num || 0,
          support: result.product.support_num || 0,
        }

        this.setData({
          salesData: result.wxUser,
          productData: productData,
          topbarData: topbarData,
          actionbarData: actionbarData,
        })

        wx.setStorageSync('salesData', result.wxUser)
        resolve()
      })

    })
  },

  getImAccount(accountType, data) {
    return new Promise((resolve, reject) => {
      api.getImAccount(accountType, data).then((res) => {
        resolve(res.data)
      })
    })
  },

  onSupport: function () {
    const customerId = wx.getStorageSync('customerData').id

    this.setData({
      actionbarData: {
        customerId: customerId,
        forward: this.data.actionbarData.forward,
        support: this.data.supportState ? this.data.actionbarData.support - 1 : this.data.actionbarData.support + 1,
      },
      productData: {
        id: this.data.productData.id || 0,
        name: this.data.productData.name || '',
        introduce: this.data.productData.introduce || '',
        price: this.data.productData.price || 0,
        support: this.data.supportState ? this.data.actionbarData.support - 1 : this.data.actionbarData.support + 1,
        coverImages: this.data.productData.coverImages || [],
        images: this.data.productData.images || []
      },
      supportState: !this.data.supportState
    })

    api.updateProduct(customerId, this.data.productData.id, this.data.supportState ? 'support' : 'unsupport').then((res) => {
      api.addInfo({
        fromId: customerId,
        objectType: 'prod',
        objectId: this.data.productData.id,
        goalsType: 0,
        fromType: 0,
        action: this.data.supportState ? 'click' : 'cancel',
        actionGoals: 'support',
        revisitLog: null
      })
    })

  },

  addInfoReadProduct() {
    const customerData = wx.getStorageSync('customerData')
    api.addInfo({
      fromId: customerData.id,
      objectType: 'prod',
      objectId: this.data.productData.id,
      goalsType: 0,
      fromType: 0,
      action: 'read',
      actionGoals: 'product',
      revisitLog: null
    })
  },

  addInfoForwardProduct() {
    const customerData = wx.getStorageSync('customerData')
    api.addInfo({
      fromId: customerData.id,
      objectType: 'prod',
      objectId: this.data.productData.id,
      goalsType: 0,
      fromType: 0,
      action: 'forward',
      actionGoals: 'product',
      revisitLog: null
    })
  },

  onLoad: function (options, authVisible) {
    this.setData({
      authVisible: authVisible,
      salesToken: wx.getStorageSync('salesToken')
    })

    const { productId } = options
    const customerData = wx.getStorageSync('customerData')

    this.getProductData(Number(productId)).then((res) => {
      this.setData({
        isReady: true,
      })
      wx.hideLoading()

      const getSalesImAccount = this.getImAccount(1, { id: this.data.salesData.id })
      const getCustomerImAccount = this.getImAccount(2, { id: customerData.id, openid: customerData.openid })

      Promise.all([getSalesImAccount, getCustomerImAccount]).then((res) => {
        wx.setStorageSync('salesImAccount', res[0])
        wx.setStorageSync('customerImAccount', res[1])
        im()
      })

      if (authVisible) {
        getApp().globalData.authVisibleListeners.push(this.addInfoReadProduct)
      } else {
        this.addInfoReadProduct()
      }

    })

    this.getProductSupportState(productId)
  },

  onShow: function () {
    const customerData = wx.getStorageSync('customerData')
    const salesData = wx.getStorageSync('salesData')
    const isImLogin = wx.getStorageSync('isImLogin')

    if (customerData.id && !!this.data.productData) {
      this.addInfoReadProduct()
    }

    !isImLogin && salesData && customerData && im()
  },

  onShareAppMessage: function (res) {
    const customerId = wx.getStorageSync('customerData').id

    return {
      title: `【${this.data.productData.name}】`,
      path: `pages/people/productDetail/index?salesToken=${this.data.salesToken}&getWay=1&productId=${this.data.productData.id}`,
      imageUrl: this.data.productData.coverImages[0],
      complete: (res) => {
        this.setData({
          actionbarData: {
            customerId: customerId,
            forward: this.data.actionbarData.forward + 1,
            support: this.data.actionbarData.support,
          },
        })
        api.updateProduct(customerId, this.data.productData.id, 'forward')
        this.addInfoForwardProduct()
      }
    }
  }
}))