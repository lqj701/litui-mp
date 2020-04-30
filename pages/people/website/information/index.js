Component({
  properties: {
    data: {
      type: Object,
      value: {
        image: '',
        name: '',
        introduce: ''
      }
    }
  },

  data: {
    visible: false
  },

  attached() {
    this.setData({
      visible: !!this.data.data && (!!this.data.data.name || !!this.data.data.image || !!this.data.data.introduce)
    })
  }

})
