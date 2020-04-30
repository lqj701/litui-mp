import api from '../../../../utils/api'
import { numberUpperFormat } from '../../../../utils/tool.js'

Component({
  properties: {
    data: {
      type: Object,
      value: {
        customerId: 0,
        bCardId: 0,
        browsed: 0,
        support: 0,
        forward: 0
      },
    }
  },

  data: {
    support: 0,
    likeActive: false,
    supportIcon: '/static/icon/like.svg',
    visible: false,
  },

  methods: {
    like() {
      this.setData({
        likeActive: !this.data.likeActive,
      })
      this.setData({
        supportIcon: this.data.likeActive ? '/static/icon/like-active.svg' : '/static/icon/like.svg',
        support: this.data.likeActive ? this.data.support + 1 : this.data.support - 1,
        supportTextColor: this.data.likeActive ? '#4a8cf2' : 'rgba(0, 0, 0, 0.45)',
      })
      api.updateCard(this.data.data.customerId, this.data.likeActive ? 'support' : 'unsupport').then((res) => {
        api.addInfo({
          fromId: this.data.data.customerId,
          objectType: 'card',
          objectId: this.data.data.bCardId,
          goalsType: 0,
          fromType: 0,
          action: this.data.likeActive ? 'click' : 'cancel',
          actionGoals: 'support',
          revisitLog: null
        })
      })
    }
  },

  attached() {
    api.getCardSupportState(Number(this.data.data.customerId), Number(this.data.data.bCardId)).then((res) => {
      const result = res.data || false
      this.setData({
        visible: !!this.data.data.bCardId,
        likeActive: result,
        support: this.data.data.support,
        supportIcon: result ? '/static/icon/like-active.svg' : '/static/icon/like.svg',
        supportTextColor: result ? '#4a8cf2' : 'rgba(0, 0, 0, 0.45)',
      })
    })
  }
})
