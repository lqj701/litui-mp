import login from '../../../utils/login.js'
import { formatTime } from '../../../utils/tool.js'
import api from '../../../utils/api.js'
import im from '../../../utils/im.js'

Page(login({

  data: {
    isReady: false,
    row: 20,
    page: 1,
    hasNext: 1,
    cardListData: null
  },

  goto(e) {
    wx.showLoading({ title: '匹配数据中', mask: false })
    const bCardId = e.currentTarget.dataset.value
    api.getSalesToken(bCardId).then((res) => {
      wx.setStorageSync('salesToken', res.data)
      wx.reLaunch({ url: `/pages/people/card/index?bCardId=${bCardId}}` })
    })
  },

  getCardListData(customerId, salesToken) {
    if (this.data.hasNext) {
      return new Promise((resolve, reject) => {
        api.getCardList(customerId, this.data.page, this.data.row, salesToken).then((res) => {
          const result = res.data
          let cardListData = result.customerCardDtoList.map((data, index) => {
            let getWay = ''
            if (data.get_way == 0) {
              getWay = '通过小程序码'
            } else if (data.get_way == 1 || data.get_way == 2) {
              getWay = '通过分享名片'
            } else {
              getWay = '通过分享红包'
            }
            return {
              id: data.id || null,
              name: data.name || '',
              position: data.position || '',
              phone: data.phone1 || data.phone2 || '',
              company: data.corp_name || '',
              avatar: data.avatar || '',
              getDate: formatTime(data.get_time) || '',
              getWay: getWay,
              imAccount: data.im_account,
              unread: 0
            }
          })

          this.data.cardListData ? cardListData.push(...cardListData) : cardListData

          this.setData({
            cardListData: cardListData,
            page: this.data.page + 1,
            hasNext: result.hasNext,
            isNull: !cardListData[0],
          })

          resolve()
        })
      })
    }
  },

  onLoad: function (options) {
    const customerData = wx.getStorageSync('customerData')
    const salesToken = wx.getStorageSync('salesToken')

    if (customerData.id) {
      this.getCardListData(customerData.id, salesToken).then((res) => {
        this.setData({ isReady: true })
        wx.hideLoading()
      })
    } else {
      this.setData({ isNull: true })
      wx.hideLoading()
    }
  },

  onReachBottom: function () {
    const customerId = wx.getStorageSync('customerData').id
    const salesToken = wx.getStorageSync('salesToken')
    this.getCardListData(customerId, salesToken)
  },

}))