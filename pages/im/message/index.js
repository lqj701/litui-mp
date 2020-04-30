Component({

  properties: {
    data: {
      type: Object,
      value: {
        id: '',
        message: '',
        avatar: '',
        from: '',
        time: '',
      }
    }
  },

  data: {
    visible: false,
    isCustomer: false,
  },

  attached() {
    this.setData({
      visible: !!this.data.data.id,
      isCustomer: this.data.data.from === 'customer' || false,
      avatarClass: this.data.data.from === 'customer' ? 'avatar pull-right' : 'avatar',
      contentClass: this.data.data.from === 'customer' ? 'content pull-right content-green' : 'content',
    })
  }
})
