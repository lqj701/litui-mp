// im 业务

import webimHandler from '../utils/imsdk/webim-handler.js'
import webim from '../utils/imsdk/webim-wx.js'
import { formatTime } from '../utils/tool.js'
import api from '../utils/api.js'
import { imAccountMode, imSdkAppID, imAccountType } from '../environment.js'

const imConfig = {
  accountMode: imAccountMode,
  sdkAppID: imSdkAppID,
  accountType: imAccountType,
}

function initIM(salesAvatar) {
  const { account_id, sign_password } = wx.getStorageSync('customerImAccount')

  webimHandler.init({
    accountMode: imConfig.accountMode,
    accountType: imConfig.accountType,
    sdkAppID: imConfig.sdkAppID,
    selType: webim.SESSION_TYPE.C2C
  })

  const loginInfo = {
    sdkAppID: imConfig.sdkAppID,
    ' ': imConfig.sdkAppID,
    accountType: imConfig.accountType,
    identifier: account_id,
    identifierNick: account_id,
    userSig: sign_password
  }

  const listeners = {
    onMsgNotify: (list) => {
      list.forEach(item => {
        const msg = {
          id: item.random,
          message: item.elems[0].content.text,
          avatar: wx.getStorageSync('salesImAccount').face_url,
          from: 'saler',
          time: formatTime(item.time * 1000)
        }

        const imContacts = getApp().globalData.imContacts
        const contact = imContacts[item.fromAccount]
        const unread = contact ? contact.unread + 1 : 1

        getApp().globalData.historyMessage = [...getApp().globalData.historyMessage, msg]
        getApp().globalData.imContacts = Object.assign({}, imContacts, { [item.fromAccount]: { unread } })
        getApp().globalData.unreadListeners.forEach((fn) => fn())
      })
    }
  }

  webimHandler.sdkLogin(loginInfo, listeners, { isLogOn: false })

  webimHandler.onLogin(() => {
    wx.setStorageSync('isImLogin', true)
    console.log('im has login')
    webim.syncMsgs((resp) => {
      const imContacts = getApp().globalData.imContacts
      const sessMap = webim.MsgStore.sessMap()
      const contacts = {}

      for (let i in sessMap) {
        const sess = sessMap[i]
        contacts[sess.id()] = { unread: sess.unread() }
      }

      getApp().globalData.imContacts = Object.assign({}, imContacts, contacts)
    })
  })

}

export default function im() {
  if (wx.getStorageSync('isImLogin')) return
  initIM()
}