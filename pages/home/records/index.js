import api from '../../../utils/api.js';
import { formatTime } from '../../../utils/tool.js'
const customerData = wx.getStorageSync('customerData');

Page({
  data: {
    page: 1,
    row: 20,
    tradeRecordsList: [],
    isEmptyList: true,
    loading: false,
    loadingComplete: false
  },

  getRecordsInfo: function () {
    var _this = this;

    var data = {
      page: _this.data.page
    }

    var params = {
      customer_id: customerData.id,
      page: _this.data.page,
      row: _this.data.row
    }

    api.getTradeRecords(params).then((res) => {
      var _this = this;

      var result = res.data;
      if (res.code === 0) {
        if (result.tradeRecords.length > 0) {
          var lists = [];

          var recordsData = result.tradeRecords.map((data, index) => {
            return {
              amount: (data.amount / 100).toFixed(2),
              created_at: formatTime(data.created_at),
              customer_id: data.customer_id,
              id: data.id,
              traded_at: data.traded_at,
              type: data.type,
              updated_at: data.updated_at
            }
          });

          _this.data.isEmptyList ? lists = recordsData : lists = _this.data.tradeRecordsList.concat(recordsData)

          if (recordsData.length < _this.data.row) {
            _this.setData({
              tradeRecordsList: lists,
              loading: false,
              loadingComplete: true
            })
          } else {
            _this.setData({
              tradeRecordsList: lists,
              loading: true
            })
          }
        } else {
          _this.setData({
            loadingComplete: true,
            loading: false
          })
        }
      }
    })
  },

  //滚动到底部触发事件
  onReachBottom: function () {
    var _this = this;

    if (_this.data.loading && !_this.data.loadingComplete) {
      _this.setData({
        page: _this.data.page + 1,
        isEmptyList: false
      });

      _this.getRecordsInfo();
    }
  },

  onLoad: function () {
    var _this = this;

    _this.getRecordsInfo();
  }
})
