import api from './api.js'

export class customer {

  constructor(isLogin, params) {
    this.data = {}
    this.params = params
    this.isLogin = isLogin
  }

  static getWxCode() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => { resolve(res.code) }
      })
    })
  }

  static fetch(params) {
    this.getWxCode().then((code) => {
      api.customerLogin(code, params).then((res) => {
        resolve(res.data)
      })
    })
  }

  get customer() {
    if (this.isLogin) return
    const params = this.params
    return customer.fetch(params)
  }

  set customer(promise) {
    this.data = promise
  }

}