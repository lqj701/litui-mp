// 封装部分小程序 api

export function wxModal(title, content, showCancel = false) {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: title || '',
      content: content || '',
      showCancel: showCancel,
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        resolve(err)
      },
    })
  })
}

export function wxLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        resolve(err)
      }
    })
  })
}

export function wxGetSetting() {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        resolve(err)
      }
    })
  })
}

export function wxGetUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      scope: 'scope.userInfo',
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        resolve(err)
      }
    })
  })
}

export function wxPayment(data) {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      },
      complete: (res) => {
        console.log(res)
      }
    })
  })
}

export const request = {

  get(url, data) {
    const salesToken = wx.getStorageSync('salesToken')
    const customerData = wx.getStorageSync('customerData')
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        method: 'GET',
        data: data,
        header: {
          Authorization: salesToken ? `Token salesToken=${salesToken}` : ''
        },
        success: (res) => {
          if (res.statusCode === 502) {
            wxModal('糟糕', '服务器失联了。。')
            resolve()
          } else {
            switch (res.data.code) {
              case 500:
                wxModal('糟糕', `系统异常: ${JSON.stringify(res.data.message)}`)
                break
              case 502:
                wxModal('糟糕', `参数错误: ${JSON.stringify(res.data.message)}`)
                break
              case 503:
                wxModal('糟糕', `参数为空: ${JSON.stringify(res.data.message)}`)
                break
              default:
                resolve(res.data)
            }
          }

          console.group('-----------------  Request Start Get')
          console.log('          -----  user: ', { salesToken: salesToken, customerId: customerData.id })
          console.log('          -----  url: ', url)
          console.log('          -----  params: ', data)
          console.log('          -----  result: ', res.data)
          console.groupEnd()
        }
      })
    })
  },

  post(url, data) {
    const salesToken = wx.getStorageSync('salesToken')
    const customerData = wx.getStorageSync('customerData')
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        method: 'POST',
        data: data,
        header: {
          Authorization: salesToken ? `Token salesToken=${salesToken}` : ''
        },
        success: (res) => {
          if (res.statusCode === 502) {
            wxModal('糟糕', '服务器失联了。。')
            resolve()
          } else {
            switch (res.data.code) {
              case 500:
                wxModal('糟糕', `系统异常: ${JSON.stringify(res.data.message)}`)
                break
              case 502:
                wxModal('糟糕', `参数错误: ${JSON.stringify(res.data.message)}`)
                break
              case 503:
                wxModal('糟糕', `参数为空: ${JSON.stringify(res.data.message)}`)
                break
              default:
                resolve(res.data)
            }
          }

          console.group('-----------------  Request Start Post')
          console.log('          -----  user: ', { salesToken: salesToken, customerId: customerData.id })
          console.log('          -----  url: ', url)
          console.log('          -----  params: ', data)
          console.log('          -----  result: ', res.data)
          console.groupEnd()
        }
      })
    })
  },

}