Component({

  properties: {
    data: {
      type: String,
      value: '0.00'
    },
    sendVisible: {
      type: Boolean,
      value: false,
    },
    menuVisible: {
      type: Boolean,
      value: false,
    }
  },

  methods: {
    goto(e) {
      const page = e.currentTarget.dataset.page
      wx.navigateTo({
        url: `/pages/home/${page}/index`,
      })
    }
  },

  attached(){
    console.log(this.data)
  }

})
