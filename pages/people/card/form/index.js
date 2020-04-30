import api from '../../../../utils/api'

Component({
  properties: {
    data: {
      type: Object,
      value: {
        customerId: 0,
        bCardId: 0,
        name: '',
        phone1: '',
        phone2: '',
        email: '',
        weixinid: '',
        company: '',
        address: ''
      },
    },
    formVisible:{
      type: Boolean,
      value: false,
    }
  },

  methods: {
    makePhoneCall(e) {
      const phoneNumber = e.currentTarget.dataset.value
      wx.makePhoneCall({
        phoneNumber: phoneNumber,
        complete: (res) => {
          api.addInfo({
            fromId: this.data.data.customerId,
            objectType: 'card',
            objectId: this.data.data.bCardId,
            goalsType: 0,
            fromType: 0,
            action: 'call',
            actionGoals: 'tel',
            revisitLog: null
          })
        }
      })
    },
    goto(e) {
      api.addInfo({
        fromId: this.data.data.customerId,
        objectType: 'card',
        objectId: this.data.data.bCardId,
        goalsType: 0,
        fromType: 0,
        action: 'read',
        actionGoals: 'address',
        revisitLog: null
      })
      wx.navigateTo({ url: `/pages/map/index?company=${this.data.data.company}&address=${this.data.data.address}` })
    },
    copy(e) {
      const { type, value } = e.currentTarget.dataset
      wx.setClipboardData({
        data: value,
        success: () => {
          wx.showToast({ title: '复制成功' })
        },
        complete: () =>{
          api.addInfo({
            fromId: this.data.data.customerId,
            objectType: 'card',
            objectId: this.data.data.bCardId,
            goalsType: 0,
            fromType: 0,
            action: 'copy',
            actionGoals: type,
            revisitLog: null
          })
        }
      })
    },
    addPhoneContact() {
      wx.addPhoneContact({
        firstName: this.data.data.name,
        mobilePhoneNumber: this.data.data.phone1,
        workPhoneNumber: this.data.data.phone2,
        email: this.data.data.email,
        weChatNumber: this.data.data.weixinid,
        complete: (res) => {
          api.addInfo({
            fromId: this.data.data.customerId,
            objectType: 'card',
            objectId: this.data.data.bCardId,
            goalsType: 0,
            fromType: 0,
            action: 'save',
            actionGoals: 'bcard',
            revisitLog: null
          })
        }
      })
    }
  },

})
