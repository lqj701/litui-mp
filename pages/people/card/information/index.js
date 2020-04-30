import api from '../../../../utils/api'

Component({
  properties: {
    data: {
      type: Object,
      value: {
        customerId: 0,
        bCardId: 0,
        avatar: '',
        name: '',
        position: '',
        company: ''
      },
    },
    unread: {
      type: Number,
      value: 0,
    }
  },

  methods: {
    preview: (e) => {
      wx.previewImage({
        urls: [e.currentTarget.dataset.avatar]
      })
    },
    goto() {
      wx.navigateTo({ url: `/pages/im/index` })
    }
  }
})
