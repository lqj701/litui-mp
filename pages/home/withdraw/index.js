import api from '../../../utils/api.js'

Page({

  data: {
    amount: 0,
    inputAmount: 0,
  },

  goRecords() {
    wx.navigateTo({
      url: '/pages/home/records/index',
    })
  },

  getall() {
    this.setData({
      inputAmount: this.data.amount,
    })
  },

  onInput(e) {
    let value = e.detail.value
    if (value.charAt(0) == '0' && value.charAt(1) && value.charAt(1) != '.') {
      value = value.slice(1)
    }
    this.setData({ inputAmount: value })
    return value
  },

  pop(text) {
    wx.showModal({
      title: '提示',
      content: text,
      confirmText: '确定',
      confirmColor: '#EA473D',
      showCancel: false,
    })
  },

  withdraw() {

    const customerData = wx.getStorageSync('customerData')
    const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;

    if (!reg.test(this.data.inputAmount)) {
      this.pop('输入格式有误')
      return
    }

    if (Number(this.data.inputAmount) > this.data.amount) {
      this.pop('余额不足')
      return
    }

    if (this.data.inputAmount < 10) {
      this.pop('最低提现金额为10元')
      return
    }

    wx.showLoading({ title: '处理中', mask: true })

    const params = {
      customer_id: customerData.id,
      amount: this.data.inputAmount,
    }

    api.withdraw(params).then((res) => {
      wx.hideLoading()
      if (res.code === 0) {
        if (res.data.payGatewayReturn.code === 0) {
          wx.navigateTo({
            url: '/pages/home/withdrawSuccess/index',
          })
        } else {
          this.pop(res.data.payGatewayReturn.message)
        }
      } else {
        this.pop(res.message)
      }
    })
  },

  onLoad: function (options) {
    wx.hideLoading()
    const customerData = wx.getStorageSync('customerData')
    api.getRedpacketBalance(customerData.id).then((res) => {
      this.setData({
        amount: (res.data.balance / 100).toFixed(2) || '0.00'
      })
    })

  },

})