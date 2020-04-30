import watch from '../../../utils/watch.js'

Component({

  properties: {
    data: {
      type: Object,
      value: {
        support: 0,
        forward: 0,
        customerId: 0,
        supportState: false
      }
    },
    supportState: {
      type: Boolean,
      value: false
    }
  },

  data: {
    visible: false,
    likeIcon: '/static/icon/like.svg',
    supportTextColor: 'rgba(0, 0, 0, 0.45)',
  },

  methods: {
    support() {
      this.triggerEvent('support')
      this.setData({
        likeIcon: this.data.supportState ? '/static/icon/like-active.svg' : '/static/icon/like.svg',
        supportTextColor: this.data.supportState ? '#4a8cf2' : 'rgba(0, 0, 0, 0.45)'
      })
    }
  },

  created() {
    watch(this.data, this, {
      supportState: function (newVal, oldVal) {
        this.setData({
          likeIcon: newVal ? '/static/icon/like-active.svg' : '/static/icon/like.svg',
          supportTextColor: newVal ? '#4a8cf2' : 'rgba(0, 0, 0, 0.45)'
        })
      }
    })
  },

  attached() {
    this.setData({
      visible: !!this.data.data.customerId,
    })
  }
})
