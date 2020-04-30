import api from '../../../../utils/api.js'
import { formatTime } from '../../../../utils/tool.js'

Component({

  properties: {
    header: {
      type: Object,
      value: {
        amount: 0,
        count: 0,
        remain_count: 0,
        cusCount: 0,
        remark: '',
        myRedpacket: false,
        lucky: 0,
      },
    },
    list: {
      type: Array,
      value: [],
    },
    myPacket: {
      type: Object,
      value: {
        amount: 0,
        time: '',
      }
    },
    firstView: {
      type: Boolean,
      value: false
    },
    listVisible: {
      type: Boolean,
      value: false,
    }
  },

  attached() {
    let customerData = wx.getStorageSync('customerData')
    let headerLeftText = ''
    if (this.data.header.myRedpacket) {
      headerLeftText = `${this.data.header.count}个红包，共${this.data.header.amount}元。`
    } else {
      headerLeftText = `${this.data.header.count}个红包，还剩${this.data.header.remain_count}个。`
    }

    let notInList = this.data.list.every((data) => {
      return data.customer_id !== customerData.id
    })
    if (notInList && this.data.firstView) {
      let _list = this.data.list
      _list.push({
        customer_id: customerData.id,
        receive_name: customerData.nickname,
        amount: this.data.myPacket.amount,
        time: this.data.myPacket.time,
        be_new_customer: false,
        avatar: customerData.avatar_url,
      })
      this.setData({ list: _list })
    }

    let _list = this.data.list
    _list.forEach((data) => {
      data.amount = (data.amount / 100).toFixed(2)
      data.time = formatTime(data.time)
      return data
    })
    this.setData({ list: _list })

    this.setData({
      rightTextVisible: !!this.data.header.cusCount,
      headerLeftText: headerLeftText,
    })
  }

})
