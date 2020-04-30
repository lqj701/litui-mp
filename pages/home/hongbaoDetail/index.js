import api from '../../../utils/api.js'

Page({

  data: {
    page: 1,
    row: 20,
    hasNext: 1,
  },

  goto() {
    wx.navigateTo({
      url: '/pages/home/withdraw/index',
    })
  },

  getRedpacketRecord(options) {
    if (!this.data.hasNext) return

    let customerData = wx.getStorageSync('customerData')
    let salesData = wx.getStorageSync('salesData')
    const params = {
      redpacket_order: this.data.orderId,
      customer_id: customerData.id,
      page: this.data.page,
      row: this.data.row,
    }

    api.redpacketRecord(params).then((res) => {

      let customerData = wx.getStorageSync('customerData')
      let result = res.data
      let myAmount = ''

      result.list.forEach((data) => {
        if (data.customer_id === customerData.id) {
          myAmount = (data.amount / 100).toFixed(2)
        }
      })

      console.log(customerData.id)

      this.setData({
        redpacketRecord: result,
        topbarData: {
          productId: null,
          name: result.name || '',
          avatar: result.avatar,
          position: result.position || '',
        },
        header: {
          avatar: result.avatar,
          name: result.name || '',
          remark: result.remark,
          amount: (result.amount / 100).toFixed(2),
        },
        historyData: {
          header: {
            amount: (result.amount / 100).toFixed(2),
            count: result.count,
            remain_count: result.remain_count,
            cusCount: result.cusCount,
            remark: result.remark,
            myRedpacket: res.data.myRedpacket,
            lucky: res.data.lucky,
          },
          list: this.data.historyData ? this.data.historyData.list.concat(res.data.list) : res.data.list,
          myPacket: {
            amount: this.data.myPacket.amount || '0.00',
            time: this.data.myPacket.time || '',
          }
        },
        shareVisible: !!result.remain_count,
        myAmount: myAmount,
        listVisible: true
      })
      this.setData({
        isReady: true,
        page: this.data.page + 1,
        hasNext: res.data.hasNext,
      })
    })
  },

  onLoad: function (options) {

    wx.setStorageSync('hasRedpacket', false)

    this.setData({
      redpacketId: options.redpacketId,
      orderId: options.orderId,
      myPacket: {
        amount: options.myPacketAmount || '0.00',
        time: options.myPacketTime || '',
      },
    })

    this.getRedpacketRecord()
    wx.hideLoading()

  },

  onReachBottom: function () {
    this.getRedpacketRecord()
  },

  onShareAppMessage: function (options) {
    let salesToken = wx.getStorageSync('redpacketOwnerToken') || wx.getStorageSync('salesToken')
    if (options.from === 'button') {
      let customerData = wx.getStorageSync('customerData')
      return {
        title: this.data.redpacketRecord.remark,
        path: `pages/people/card/index?getWay=3&redpacket=true&orderId=${this.data.orderId}&redpacketId=${this.data.redpacketId}&remark=${this.data.redpacketRecord.remark}&salesToken=${salesToken}`,
        imageUrl: '/static/image/redpacket.png',
        success: (res) => {
          api.forwardRedpacket({ redpacket_id: this.data.redpacketId })
        }
      }
    }
  }

})