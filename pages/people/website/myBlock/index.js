import api from '../../../../utils/api'

Component({
  properties: {
    data: {
      type: Array,
      value: []
    },
    info: {
      type: Object,
      value: {
        websiteId: null,
        company: '',
      }
    }
  },

  data: {
    visible: false
  },

  methods: {
    makePhoneCall(e) {
      const phoneNumber = e.currentTarget.dataset.value
      wx.makePhoneCall({
        phoneNumber: phoneNumber,
        complete: (res) => {
          api.addInfo({
            fromId: wx.getStorageSync('customerData').id,
            objectType: 'web',
            objectId: this.data.info.websiteId,
            goalsType: 0,
            fromType: 0,
            action: 'call',
            actionGoals: 'tel',
            revisitLog: null
          })
        }
      })
    },
    copy(e) {
      console.log(e)
      const { type, value } = e.currentTarget.dataset
      wx.setClipboardData({
        data: value,
        success: () => {
          wx.showToast({
            title: '复制成功'
          })
        },
        complete: () => {
          api.addInfo({
            fromId: wx.getStorageSync('customerData').id,
            objectType: 'web',
            objectId: this.data.info.websiteId,
            goalsType: 0,
            fromType: 0,
            action: 'copy',
            actionGoals: type,
            revisitLog: null
          })
        }
      })
    },
    goto(e) {
      const { address } = e.currentTarget.dataset
      api.addInfo({
        fromId: wx.getStorageSync('customerData').id,
        objectType: 'web',
        objectId: this.data.info.websiteId,
        goalsType: 0,
        fromType: 0,
        action: 'read',
        actionGoals: 'address',
        revisitLog: null
      })
      console.log(e)
      wx.navigateTo({ url: `/pages/map/index?company=${this.data.info.company}&address=${address}` })
    },
  },

  data: {
    visible: false
  },

  attached() {
    this.setData({
      visible: !!this.data.data[0]
    })
  }
})
