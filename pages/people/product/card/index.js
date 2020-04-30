Component({

  properties: {
    data: {
      type: Object,
      value: {
        id: '',
        name: '',
        price: '',
        introduce: '',
        support: '',
        image: ''
      }
    }
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
