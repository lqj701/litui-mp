import login from '../../../utils/login.js'
import api from '../../../utils/api.js'
import im from '../../../utils/im.js'

Page(login({

  data: {
    isReady: false,
    authVisible: false,
    hongbaoVisible: false,
    salesData: null,
  },

  // 获取名片信息
  getCardData() {
    const customerData = wx.getStorageSync('customerData')
    return new Promise((resolve, reject) => {
      api.getCardDetail().then((res) => {
        let result = res.data
        let informationData = {
          customerId: customerData.id,
          bCardId: result.bCardInfo.id,
          avatar: result.wxUser.avatar || '',
          name: result.wxUser.name || '',
          position: result.wxUser.position || '',
          company: result.corpWebsite ? result.corpWebsite.name : ''
        }
        let socialData = {
          customerId: customerData.id,
          bCardId: result.bCardInfo.id,
          browsed: result.bCardInfo.browsed_num || 0,
          support: result.bCardInfo.support_num || 0,
          forward: result.bCardInfo.forward_num || 0
        }
        let formData = {
          customerId: customerData.id,
          bCardId: result.bCardInfo.id,
          name: result.wxUser.name || '',
          phone1: result.wxUser.phone1 || '',
          phone2: result.wxUser.phone2 || '',
          email: result.wxUser.email || '',
          weixinid: result.wxUser.weixinid || '',
          company: result.corpWebsite ? (result.corpWebsite.name || '') : '',
          address: result.corpWebsite ? (result.corpWebsite.address || '') : ''
        }
        let signatureData = result.bCardInfo.signature || ''
        let productData = {
          customerId: customerData.id,
          bCardId: result.bCardInfo.id,
          id: result.mainProduct.id || '',
          image: result.productImage || '',
          name: result.mainProduct.name || '',
          price: (result.mainProduct.price / 100).toFixed(2) || 0,
          introduce: result.mainProduct.product_introduce || '这个人很懒，没有写商品简介...'
        }
        let photoData = result.cardImages ? (result.cardImages.map((value) => {
          return value.url
        }) || []) : []

        this.setData({
          salesData: result,
          informationData: informationData,
          socialData: socialData,
          formData: formData,
          signatureData: signatureData,
          productData: productData,
          photoData: photoData,
          formVisible: formData.name || formData.phone1 || formData.phone2 || formData.email || formData.weixinid || formData.company || formData.address,
          signatureVisible: !!signatureData,
          productVisible: !!productData.id,
          photoVisible: !!photoData[0],
        })

        wx.setStorageSync('salesData', result.wxUser)
        wx.setStorageSync('bCardInfo', result.bCardInfo)

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

  addInfoReadCard() {
    const customerData = wx.getStorageSync('customerData')
    api.addInfo({
      fromId: customerData.id,
      objectType: 'card',
      objectId: this.data.salesData.bCardInfo.id,
      goalsType: 0,
      fromType: 0,
      action: 'read',
      actionGoals: 'bcard',
      revisitLog: ''
    })
  },

  gohome(e) {
    wx.redirectTo({
      url: `/pages/home/cards/index`,
    })
  },

  onLoad: function (options, authVisible) {
    console.log('名片详情页 options', options)

    const customerData = wx.getStorageSync('customerData')
    const salesToken = wx.getStorageSync('salesToken')
    const hasRedpacket = options.redpacket
    hasRedpacket && wx.setStorageSync('hasRedpacket', true)
    this.setData({ salesToken: salesToken, })

    if (hasRedpacket) {
      api.canReceive({ redpacket_order: options.orderId, customer_id: customerData.id }).then((res) => {
        if (res.code === -2) {
          wx.removeStorageSync('hasRedpacket')
          wx.redirectTo({
            url: `/pages/home/hongbaoDetail/index?orderId=${options.orderId}&redpacketId=${options.redpacketId}&customerId=${customerData.id}&myPacketAmount=&myPacketTime=&salesToken=${salesToken}`,
          })
          return
        }
      })
    }

    this.getCardData().then(() => {
      this.setData({ authVisible: authVisible, })
      if (hasRedpacket) {
        wx.hideTabBar()
        wx.setStorageSync('redpacketOwnerToken', salesToken)
        this.setData({
          orderId: options.orderId,
          redpacketId: options.redpacketId,
          redpacketInfo: {
            avatar: this.data.salesData.wxUser.avatar,
            name: this.data.salesData.wxUser.name,
            remark: options.remark || '',
          },
          hongbaoVisible: true,
        })
      } else if (authVisible) {
        wx.hideTabBar()
        getApp().globalData.authVisibleListeners.push(this.addInfoReadCard)
      } else {
        this.addInfoReadCard()
      }

      this.setData({
        isReady: true,
      })

      wx.hideLoading()
      const getSalesImAccount = this.getImAccount(1, { id: wx.getStorageSync('salesData').id })
      const getCustomerImAccount = this.getImAccount(2, { id: customerData.id, openid: customerData.openid })

      Promise.all([getSalesImAccount, getCustomerImAccount]).then((res) => {
        wx.setStorageSync('salesImAccount', res[0])
        wx.setStorageSync('customerImAccount', res[1])
        im()
      })
    })

    api.updateCard(customerData.id, 'view')

    api.updateLastView(customerData.id)
  },

  onShow: function () {
    const customerData = wx.getStorageSync('customerData')
    const isImLogin = wx.getStorageSync('isImLogin')

    if (customerData.id && this.data.salesData) {
      this.addInfoReadCard()
      api.updateCard(customerData.id, 'view').then((res) => {
        this.getCardData()
      })
    }

    !isImLogin && this.data.salesData && customerData && im()

  },

  onShareAppMessage: function () {
    let customerData = wx.getStorageSync('customerData')

    return {
      title: `【${this.data.salesData.wxUser.name}】的名片`,
      path: `pages/people/card/index?salesToken=${this.data.salesToken}&getWay=1`,
      imageUrl: this.data.salesData.wxUser.avatar,
      complete: (res) => {
        api.updateCard(customerData.id, 'forward').then((res) => {
          this.setData({
            socialData: {
              browsed: this.data.salesData.bCardInfo.browsed_num || 0,
              support: this.data.salesData.bCardInfo.support_num || 0,
              forward: res.data.forward_num || 0
            },
          })
        })
        api.addInfo({
          fromId: customerData.id,
          objectType: 'card',
          objectId: this.data.salesData.bCardInfo.id,
          goalsType: 0,
          fromType: 0,
          action: 'forward',
          actionGoals: 'bcard',
          revisitLog: null
        })
      }
    }
  }
}))