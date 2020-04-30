// import login from '../../utils/login.js'
// import api from '../../utils/api.js'
// import webimHandler from '../../utils/imsdk/webim-handler'
// import webim from '../../utils/imsdk/webim-wx'
// import { formatTime, findLast } from '../../utils/tool.js'
// import watch from '../../utils/watch.js'
// import im from '../../utils/im.js'

// Page({

//   data: {
//     isReady: false,
//     message: '',
//     historyMessage: [],
//     scrollIntoMsgId: '',
//     salesToken: ''
//   },

//   inputMessage(e) {
//     this.setData({ message: e.detail.value })
//   },

//   formSubmit(e) {

//     const customerImAccount = wx.getStorageSync('customerImAccount')

//     api.sendFormId([{
//       account_id: customerImAccount.account_id,
//       form_id: e.detail.formId
//     }])

//     this.send()
//   },

//   msgTimeFormat(msgs) {
//     let latestTime = msgs[msgs.length - 1].time // 最新消息时间戳
//     let time1, time2 = 0 // time1为当前计算时间,time2为上一个时间
//     let count = 0

//     for (let i = msgs.length - 1; i > 0; i--) {

//       if (i === msgs.length - 1) {
//         time1 = msgs[i].time
//         time2 = msgs[i].time
//       } else {
//         time1 = msgs[i].time
//         time2 = msgs[i + 1].time

//         if (time2 - time1 <= 60000 && count <= 20) {
//           // 最新消息离当前时间不到一分钟且连续消息少于20个
//           msgs[i + 1].timeVisible = false
//           count = count + 1
//         } else if (time2 - time1 <= 60000 && count > 20) {
//           // 最新消息离当前时间不到一分钟且连续消息多于20个
//           msgs[i + 1].timeVisible = true
//           count > 20 ? count = 0 : count = count
//         } else {
//           msgs[i + 1].timeVisible = true
//           count = 0
//         }
//       }
//     }

//     msgs.forEach((msg) => {
//       msg.time = formatTime(msg.time)
//       return msg
//     })

//     return msgs
//   },

//   send() {
//     if (!this.data.message) return

//     const customerImAccount = wx.getStorageSync('customerImAccount')
//     const salesImAccount = wx.getStorageSync('salesImAccount')
//     const random = Math.round(Math.random() * 4294967296) // 消息随机数，用于去重
//     const msgTime = Math.round(new Date().getTime() / 1000) // 消息时间戳

//     if (this.data.message !== '') {
//       webimHandler.onSendMsg({
//         content: this.data.message,
//         toId: salesImAccount.account_id,
//         random,
//         msgTime
//       })

//       getApp().globalData.historyMessage = [...getApp().globalData.historyMessage, {
//         id: random,
//         message: this.data.message,
//         avatar: customerImAccount.face_url,
//         from: 'customer',
//         time: msgTime * 1000
//       }]

//       api.pushMsg({
//         from_account_id: customerImAccount.account_id,
//         to_account_id: salesImAccount.account_id,
//         msg_seq: random,
//         msg_send: msgTime * 1000,
//         content: this.data.message
//       }).then((res) => {
//         console.log('消息发送成功')
//       })

//       this.setData({ scrollIntoMsgId: `msg${random}` })
//       this.setData({ message: '' })
//     }
//   },

//   fetchHistoryMsgs(cb) {
//     console.log(wx.getStorageSync('salesImAccount'))
//     console.log(wx.getStorageSync('customerImAccount'))

//     const options = {
//       Peer_Account: wx.getStorageSync('salesImAccount').account_id,
//       MaxCnt: 15,
//       LastMsgTime: this.data.LastMsgTime,
//       MsgKey: this.data.MsgKey
//     }

//     webim.getC2CHistoryMsgs(options, (resp) => {
//       this.setData({
//         LastMsgTime: resp.LastMsgTime,
//         MsgKey: resp.MsgKey,
//         moreMsgs: resp.Complete === 0,
//       })

//       const msgs = resp.MsgList.map((msg, idx) => {
//         return {
//           id: msg.random,
//           message: msg.elems[0].content.text,
//           avatar: /^c/.test(msg.fromAccount) ? wx.getStorageSync('customerImAccount').face_url : wx.getStorageSync('salesImAccount').face_url,
//           from: /^c/.test(msg.fromAccount) ? 'customer' : 'saler',
//           time: msg.time * 1000
//         }
//       })

//       if (resp.Complete === 1 && wx.getStorageSync('bCardInfo').welcome_chat) {
//         msgs.unshift({
//           id: Math.round(Math.random() * 4294967296),
//           message: wx.getStorageSync('bCardInfo').welcome_chat,
//           avatar: wx.getStorageSync('salesImAccount').face_url,
//           from: 'saler',
//           time: msgs[0] ? msgs[0].time : Date.parse(new Date()),
//           isWelcome: true
//         })
//       }

//       setTimeout(() => {
//         cb(msgs)
//       }, 16)
//     })
//   },

//   onScrollToUpper() {
//     if (!this.data.moreMsgs) return

//     this.fetchHistoryMsgs((msgs) => {
//       if (!msgs.length) return
//       getApp().globalData.historyMessage = [...msgs, ...getApp().globalData.historyMessage]
//       this.setData({
//         scrollIntoMsgId: `msg${msgs[msgs.length - 1].id}`
//       })
//     })
//   },

//   onLoad: function (options) {

//     api.getCardDetail().then((res) => {
//       api.getImAccount(1, { id: res.data.wxUser.id }).then((res) => {
//         wx.setStorageSync('salesImAccount', res.data)
//         im()
//       })
//     })

//     setTimeout(() => {
//       watch(getApp().globalData, this, {
//         historyMessage: (newVal, oldVal) => {
//           const salesImAccountId = wx.getStorageSync('salesImAccount').account_id
//           if (!newVal.length) return
//           let msgs = [...this.data.historyMessage, ...newVal]
//           msgs = JSON.parse(JSON.stringify(msgs))
//           msgs = this.msgTimeFormat(msgs)
//           this.setData({
//             historyMessage: [...msgs],
//             scrollIntoMsgId: `msg${newVal[newVal.length - 1].id}`
//           })

//           const msgSess = webim.MsgStore.sessByTypeId(webim.SESSION_TYPE.C2C, salesImAccountId)
//           const lastSalerMsg = findLast(newVal, (o) => o.from === 'saler')

//           webim.setAutoRead(msgSess, true, true)
//           api.markMsgRead(lastSalerMsg.id)
//         },
//       })

//       this.setData({
//         scrollIntoMsgId: '',
//         LastMsgTime: 0,
//         MsgKey: '',
//         moreMsgs: false,
//       })

//       wx.setNavigationBarTitle({
//         title: '聊天'
//       })

//       wx.hideLoading()
//       this.setData({ isReady: true })

//       webimHandler.onLogin(() => {

//         this.fetchHistoryMsgs((msgs) => {
//           if (!msgs.length) return

//           getApp().globalData.historyMessage = [...msgs]

//           this.setData({
//             scrollIntoMsgId: `msg${msgs[msgs.length - 1].id}`
//           })

//           if (msgs[msgs.length - 1].isWelcome) return // 欢迎语不用上报

//           const salesImAccountId = wx.getStorageSync('salesImAccount').account_id

//           if (!getApp().globalData.imContacts[salesImAccountId]) return

//           const msgSess = webim.MsgStore.sessByTypeId(webim.SESSION_TYPE.C2C, salesImAccountId)
//           const lastSalerMsg = findLast(msgs, (o) => o.from === 'saler')

//           webim.setAutoRead(msgSess, true, true)
//           api.markMsgRead(lastSalerMsg.id)
//         })
//       })

//       const salesImAccountId = wx.getStorageSync('salesImAccount').account_id
//       getApp().globalData.imContacts = Object.assign({}, getApp().globalData.imContacts, { [salesImAccountId]: { unread: 0 } })
//       getApp().globalData.unreadListeners.forEach((fn) => fn())
//     }, 1000)

//   },

//   onShow: function () {
//     const customerData = wx.getStorageSync('customerData')
//     const salesImAccount = wx.getStorageSync('salesImAccount')

//     api.addInfo({
//       fromId: customerData.id,
//       objectType: 'card',
//       objectId: salesImAccount.user_id,
//       goalsType: 0,
//       fromType: 0,
//       action: 'enter',
//       actionGoals: 'talkingWindow',
//       revisitLog: null
//     })

//   },

// })



import login from '../../utils/login.js'
import api from '../../utils/api.js'
import webimHandler from '../../utils/imsdk/webim-handler'
import webim from '../../utils/imsdk/webim-wx'
import { formatTime, findLast } from '../../utils/tool.js'
import watch from '../../utils/watch.js'
import im from '../../utils/im.js'

Page({

  data: {
    isReady: false,
    message: '',
    historyMessage: [],
    scrollIntoMsgId: '',
    salesToken: wx.getStorageSync('salesToken')
  },

  inputMessage(e) {
    this.setData({ message: e.detail.value })
  },

  formSubmit(e) {

    const customerImAccount = wx.getStorageSync('customerImAccount')

    api.sendFormId([{
      account_id: customerImAccount.account_id,
      form_id: e.detail.formId
    }])

    this.send()
  },

  send() {
    if (!this.data.message) return

    const customerImAccount = wx.getStorageSync('customerImAccount')
    const salesImAccount = wx.getStorageSync('salesImAccount')
    const random = Math.round(Math.random() * 4294967296) // 消息随机数，用于去重
    const msgTime = Math.round(new Date().getTime() / 1000) // 消息时间戳

    if (this.data.message !== '') {
      webimHandler.onSendMsg({
        content: this.data.message,
        toId: salesImAccount.account_id,
        random,
        msgTime
      })

      getApp().globalData.historyMessage = [...getApp().globalData.historyMessage, {
        id: random,
        message: this.data.message,
        avatar: customerImAccount.face_url,
        from: 'customer',
        time: formatTime(msgTime * 1000)
      }]

      api.pushMsg({
        from_account_id: customerImAccount.account_id,
        to_account_id: salesImAccount.account_id,
        msg_seq: random,
        msg_send: msgTime * 1000,
        content: this.data.message
      }).then((res) => {
        console.log('消息发送成功')
      })

      this.setData({ scrollIntoMsgId: `msg${random}` })
      this.setData({ message: '' })
    }
  },

  fetchHistoryMsgs(cb) {
    console.log(wx.getStorageSync('salesImAccount'))
    console.log(wx.getStorageSync('customerImAccount'))

    const options = {
      Peer_Account: wx.getStorageSync('salesImAccount').account_id,
      MaxCnt: 15,
      LastMsgTime: this.data.LastMsgTime,
      MsgKey: this.data.MsgKey
    }

    webim.getC2CHistoryMsgs(options, (resp) => {
      this.setData({
        LastMsgTime: resp.LastMsgTime,
        MsgKey: resp.MsgKey,
        moreMsgs: resp.Complete === 0,
      })

      const msgs = resp.MsgList.map((msg, idx) => {
        return {
          id: msg.random,
          message: msg.elems[0].content.text,
          avatar: /^c/.test(msg.fromAccount) ? wx.getStorageSync('customerImAccount').face_url : wx.getStorageSync('salesImAccount').face_url,
          from: /^c/.test(msg.fromAccount) ? 'customer' : 'saler',
          time: formatTime(msg.time * 1000)
        }
      })

      if (resp.Complete === 1 && wx.getStorageSync('bCardInfo').welcome_chat) {
        msgs.unshift({
          id: Math.round(Math.random() * 4294967296),
          message: wx.getStorageSync('bCardInfo').welcome_chat,
          avatar: wx.getStorageSync('salesImAccount').face_url,
          from: 'saler',
          time: msgs[0] ? msgs[0].time : formatTime(+new Date()),
          isWelcome: true
        })
      }

      setTimeout(() => {
        cb(msgs)
      }, 16)
    })
  },

  onScrollToUpper() {
    if (!this.data.moreMsgs) return

    this.fetchHistoryMsgs((msgs) => {
      if (!msgs.length) return
      getApp().globalData.historyMessage = [...msgs, ...getApp().globalData.historyMessage]
      this.setData({
        scrollIntoMsgId: `msg${msgs[msgs.length - 1].id}`
      })
    })
  },

  onShow: function (options) {

    this.setData({ onShow: true })

    api.getCardDetail().then((res) => {
      api.getImAccount(1, { id: res.data.wxUser.id }).then((res) => {
        wx.setStorageSync('salesImAccount', res.data)
        im()
      })
    })

    setTimeout(() => {
      watch(getApp().globalData, this, {
        historyMessage: (newVal, oldVal) => {
          const salesImAccountId = wx.getStorageSync('salesImAccount').account_id
          if (!newVal.length) return
          this.setData({
            historyMessage: [...newVal],
            scrollIntoMsgId: `msg${newVal[newVal.length - 1].id}`
          })

          const msgSess = webim.MsgStore.sessByTypeId(webim.SESSION_TYPE.C2C, salesImAccountId)
          const lastSalerMsg = findLast(newVal, (o) => o.from === 'saler')

          this.data.onShow && webim.setAutoRead(msgSess, true, true)
          this.data.onShow && api.markMsgRead(lastSalerMsg.id)
        },
      })

      this.setData({
        scrollIntoMsgId: '',
        LastMsgTime: 0,
        MsgKey: '',
        moreMsgs: false,
      })

      wx.setNavigationBarTitle({
        title: '聊天'
      })

      wx.hideLoading()
      this.setData({ isReady: true })

      webimHandler.onLogin(() => {

        this.fetchHistoryMsgs((msgs) => {
          if (!msgs.length) return

          getApp().globalData.historyMessage = [...msgs]

          this.setData({
            scrollIntoMsgId: `msg${msgs[msgs.length - 1].id}`
          })

          if (msgs[msgs.length - 1].isWelcome) return // 欢迎语不用上报

          const salesImAccountId = wx.getStorageSync('salesImAccount').account_id

          if (!getApp().globalData.imContacts[salesImAccountId]) return

          const msgSess = webim.MsgStore.sessByTypeId(webim.SESSION_TYPE.C2C, salesImAccountId)
          const lastSalerMsg = findLast(msgs, (o) => o.from === 'saler')

          this.data.onShow && webim.setAutoRead(msgSess, true, true)
          this.data.onShow && api.markMsgRead(lastSalerMsg.id)
        })
      })

      const salesImAccountId = wx.getStorageSync('salesImAccount').account_id
      getApp().globalData.imContacts = Object.assign({}, getApp().globalData.imContacts, { [salesImAccountId]: { unread: 0 } })
      getApp().globalData.unreadListeners.forEach((fn) => fn())
    }, 1000)

    const customerData = wx.getStorageSync('customerData')
    const salesImAccount = wx.getStorageSync('salesImAccount')

    api.addInfo({
      fromId: customerData.id,
      objectType: 'card',
      objectId: salesImAccount.user_id,
      goalsType: 0,
      fromType: 0,
      action: 'enter',
      actionGoals: 'talkingWindow',
      revisitLog: null
    })

  },

  onUnload() {
    this.setData({ onShow: false })
  }

})
