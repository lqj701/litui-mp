import login from '../../../utils/login.js'
import api from '../../../utils/api.js'
import im from '../../../utils/im.js'

Page(login({

  data: {
    websiteData: null,
    isReady: false,
    isNull: false,
  },

  getWebsiteData() {
    const customerId = wx.getStorageSync('customerData').id
    return new Promise((resolve, reject) => {
      api.getWebSite().then((res) => {
        const result = res.data
        const blockData = result.blockList ? result.blockList.map((data, index) => {
          let block = JSON.parse(data.content)
          block.type = data.type
          block.id = index
          return block
        }) : null
        const blockInfo = result.corpWebsite ? {
          websiteId: result.corpWebsite.id || 0,
          company: result.corpWebsite.name || '',
        } : null
        const companyName = result.corpWebsite ? result.corpWebsite.name || '' : null
        const informationData = result.corpWebsite ? {
          image: result.corpWebsite.cover_image_url || '',
          name: result.corpWebsite.name || '',
          introduce: result.corpWebsite.introduce || '这个人很懒，没有写官网简介...'
        } : null

        this.setData({
          websiteData: result,
          topbarData: result.wxUser,
          blockData: blockData,
          blockInfo: blockInfo,
          informationData: informationData,
          isNull: !result.corpWebsite,
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

  addInfoReadWebsite() {
    const customerData = wx.getStorageSync('customerData')
    if (this.data.websiteData.corpWebsite) {
      api.addInfo({
        fromId: customerData.id,
        objectType: 'web',
        objectId: this.data.websiteData.corpWebsite.id,
        goalsType: 0,
        fromType: 0,
        action: 'read',
        actionGoals: 'coreWeb',
        revisitLog: null
      })
    }
  },

  addInfoForwardWebsite() {
    const customerData = wx.getStorageSync('customerData')
    if (this.data.websiteData.corpWebsite) {
      api.addInfo({
        fromId: customerData.id,
        objectType: 'web',
        objectId: this.data.websiteData.corpWebsite.id,
        goalsType: 0,
        fromType: 0,
        action: 'forward',
        actionGoals: 'coreWeb',
        revisitLog: null
      })
    }
  },

  onLoad: function (options, authVisible) {
    this.setData({
      authVisible: authVisible,
      salesToken: wx.getStorageSync('salesToken')
    })
    const customerData = wx.getStorageSync('customerData')
    this.getWebsiteData().then(() => {
      this.setData({
        isReady: true,
      })
      wx.hideLoading()
      //发送情报

      if (authVisible) {
        getApp().globalData.authVisibleListeners.push(this.addInfoReadWebsite)
      } else {
        this.addInfoReadWebsite()
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

    if (customerData.id && !!this.data.websiteData) {
      this.addInfoReadWebsite()
      this.getWebsiteData()
    }

    !isImLogin && salesData && customerData && im()
  },

  onShareAppMessage: function () {
    const customerId = wx.getStorageSync('customerData').id
    console.log(this.data.salesToken)

    return {
      title: `【${this.data.websiteData.corpWebsite.name}】`,
      path: `/pages/people/website/index?salesToken=${this.data.salesToken}&getWay=1`,
      imageUrl: this.data.websiteData.coverImage,
      complete: res => {
        this.addInfoForwardWebsite()
      }
    }
  }
}))