Component({
  properties: {
    data: {
      type: Object,
      default: {
        customerId: 0,
        bCardId: 0,
        id: 0,
        image: '',
        name: '',
        price: 0,
        introduce: ''
      },
    },
    productVisible: {
      type: Boolean,
      value: false,
    }
  },

  methods: {
    goto() {
      wx.navigateTo({ url: `/pages/people/productDetail/index?productId=${this.data.data.id}` })
    }
  },

})
