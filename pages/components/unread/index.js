import watch from '../../../utils/watch.js'

Component({

  data: {
    visible: false,
    data: 0,
  },

  attached: function () {
    getApp().globalData.unreadListeners.push((page) => {
      const salesImAccountId = wx.getStorageSync('salesImAccount').account_id || ''
      if (!getApp().globalData.imContacts[salesImAccountId]) return
      let unread = getApp().globalData.imContacts[salesImAccountId].unread
      if (getCurrentPages()[getCurrentPages().length - 1].route === 'pages/im/index') {
        unread = 0
        getApp().globalData.imContacts = Object.assign({}, getApp().globalData.imContacts, { [salesImAccountId]: { unread: 0 } })
      }
      this.setData({
        data: unread,
        visible: Number(unread) > 0
      })
      if (Number(unread) > 0 && !wx.getStorageSync('hasRead')) {
        wx.setStorageSync('hasRead', true)
        wx.showModal({
          title: '未读消息',
          content: `你有${unread}条未读消息`,
          confirmText: '查看',
          success: (res) => {
            if (res.confirm) {
              wx.navigateTo({ url: '/pages/im/index' })
            }
          }
        })
      }
    })

    setTimeout(() => {
      const salesImAccountId = wx.getStorageSync('salesImAccount').account_id || ''
      if (!getApp().globalData.imContacts[salesImAccountId]) return
      const unread = getApp().globalData.imContacts[salesImAccountId].unread
      this.setData({
        data: unread,
        visible: unread > 0
      })
      if (Number(unread) > 0 && !wx.getStorageSync('hasRead')) {
        wx.setStorageSync('hasRead', true)
        wx.showModal({
          title: '未读消息',
          content: `你有${unread}条未读消息`,
          confirmText: '查看',
          success: (res) => {
            if (res.confirm) {
              wx.navigateTo({ url: '/pages/im/index' })
            }
          }
        })
      }
    }, 1200)
  }
})
