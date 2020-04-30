Component({

  properties: {
    data: {
      type: Object,
      value: {
        id: 0,
        name: '',
        position: '',
        phone: '',
        company: '',
        avatar: '',
        getDate: '',
        getWay: '',
        unread: 0
      }
    },
  },

  data: {
    visible: false
  },

  attached() {
    this.setData({
      visible: !!this.data.data.id
    })
  }
})
