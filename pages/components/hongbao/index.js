import api from '../../../utils/api.js'

Component({

  properties: {
    salesData: {
      type: Object,
      value: {
        avatar: '',
        name: '',
        remark: '',
      }
    },
    orderId: {
      type: String,
      value: ''
    },
    redpacketId: {
      type: String,
      value: ''
    },
    auth: {
      type: Boolean,
      value: false,
    },
    hongbaoVisible: {
      type: Boolean,
      value: false,
    }
  },

  data: {
    newVisible: true,
    expiredVisible: false,
    expiredText: '',
  },

  methods: {
    open() {
      api.receiveRedpacket({ redpacket_order: this.data.orderId, customer_id: wx.getStorageSync('customerData').id })
        .then((res) => {

          api.addInfo({
            objectType: 'redpacket',
            objectId: this.data.redpacketId,
            goalsType: 0,
            fromType: 0,
            fromId: wx.getStorageSync('customerData').id,
            action: res.code === 0 ? 'gain' : 'read',
            actionGoals: 'redpacket',
            revisitLog: null,
          })

          const customerData = wx.getStorageSync('customerData')

          if (res.code === -3) {
            //该红包已经过期
            this.setData({
              newVisible: false,
              expiredVisible: true,
              expiredText: '红包已过期',
            })
          } else if (res.code === -2) {
            //该用户已经抢过红包
            this.setData({
              newVisible: false,
              expiredVisible: true,
              expiredText: '您已经抢过红包了',
            })
          } else if (res.code === -1) {
            // 红包已被抢完
            this.setData({
              newVisible: false,
              expiredVisible: true,
              expiredText: '来晚了，红包领完了',
            })
          } else {
            // 抢到
            this.setData({
              amount: res.data.amount,
              time: res.data.time,
            })
            this.goto()
          }

        })
    },
    goto() {
      wx.setStorageSync('hasRedpacket', false)
      const customerData = wx.getStorageSync('customerData')
      const salesToken = wx.getStorageSync('salesToken')
      wx.redirectTo({
        url: `/pages/home/hongbaoDetail/index?orderId=${this.data.orderId}&redpacketId=${this.data.redpacketId}&customerId=${customerData.id}&myPacketAmount=${this.data.amount}&myPacketTime=${this.data.time}&salesToken=${salesToken}`,
      })
    },
    getAuth(e) {
      const customerData = wx.getStorageSync('customerData')
      const wxUserInfo = e.detail
      wx.setStorageSync('wxUserInfo', wxUserInfo)
      if (wxUserInfo.errMsg === 'getUserInfo:ok' && customerData) {
        api.setUserInfo(customerData.openid, wxUserInfo).then((res) => {
          wx.setStorageSync('hasMpAuth', true)
          api.receiveRedpacket({ redpacket_order: this.data.orderId, customer_id: wx.getStorageSync('customerData').id })
            .then((res) => {
              
              api.addInfo({
                objectType: 'redpacket',
                objectId: this.data.redpacketId,
                goalsType: 0,
                fromType: 0,
                fromId: wx.getStorageSync('customerData').id,
                action: res.code === 0 ? 'gain' : 'read',
                actionGoals: 'redpacket',
                revisitLog: null,
              })

              const customerData = wx.getStorageSync('customerData')

              if (res.code === -3) {
                //该红包已经过期
                this.setData({
                  newVisible: false,
                  expiredVisible: true,
                  expiredText: '红包已过期',
                })
              } else if (res.code === -2) {
                //该用户已经抢过红包
                this.setData({
                  newVisible: false,
                  expiredVisible: true,
                  expiredText: '您已经抢过红包了',
                })
              } else if (res.code === -1) {
                // 红包已被抢完
                this.setData({
                  newVisible: false,
                  expiredVisible: true,
                  expiredText: '来晚了，红包领完了',
                })
              } else {
                // 抢到
                this.setData({
                  amount: res.data.amount,
                  time: res.data.time,
                })
                this.goto()
              }
            })
        })
      }
    },
  },

})
