const customerData = wx.getStorageSync('customerData')
import api from '../../../utils/api.js'

Component({

  properties: {
    data: {
      type: Object,
      value: {
        productId: 0,
        name: '',
        avatar: '',
        position: ''
      }
    },
    unread: {
      type: Number,
      value: 0
    }
  },

  data: {
    visible: false,
    authVisible: true
  },

  methods: {
    goto(e) {
      wx.setStorageSync('hasRedpacket',false)
      if (e.target.dataset.value === 'card') {
        wx.reLaunch({ url: `/pages/people/card/index?productId=${this.data.data.productId}&salesToken=${wx.getStorageSync('salesToken') || wx.getStorageSync('redpacketOwnerToken')}` })
      } else {
        wx.navigateTo({ url: `/pages/im/index?productId=${this.data.data.productId}` })
      }
    },
    getPhoneNumber(e) {
      const customerData = wx.getStorageSync('customerData')
      this.setData({ authVisible: false })
      if (e.detail.errMsg === 'getPhoneNumber:ok') {
        api.setUserInfo(customerData.openid, e.detail)
      }
      api.addInfo({
        fromId: customerData.id,
        objectType: 'prod',
        objectId: this.data.data.productId,
        goalsType: 0,
        fromType: 0,
        action: 'consult',
        actionGoals: 'product',
        revisitLog: null
      }).then(() => {
        wx.navigateTo({ url: `/pages/im/index?productId=${this.data.data.productId}` })
      })
      wx.setStorageSync('hasPhoneAuth', true)
    }
  },

  attached() {
    const customerData = wx.getStorageSync('customerData')
    this.setData({
      visible: !!this.data.data && (!!this.data.data.name || !!this.data.data.avatar || !!this.data.data.position || !!this.data.data.unread),
      authVisible: !customerData.bindphone && (getCurrentPages()[getCurrentPages().length - 1].route === 'pages/people/productDetail/index') && !wx.getStorageSync('hasPhoneAuth'),
    })
  }
})
