// 主业务接口

import { request } from './wx.js'
import { HOST, IMHOST, PAY_GATEWAY } from '../environment.js'

const api = {

  // 用户登录
  customerLogin: (code, data) => request.post(`${HOST}/auth/person/${code}/person/login`, data),

  // 获取小程序码参数
  decodeAuthToken: (authToken) => request.get(`${HOST}/auth/person/mp/qrcode/${authToken}/parse`),

  // 查询用户是否设置过个人信息
  getUserInfo: (userId) => request.post(`${HOST}/auth/person/${userId}/user/info`),

  // 设置过个人信息
  setUserInfo: (userId, data) => request.post(`${HOST}/auth/person/${userId}/user/set`, data),

  // 数据解密
  decode: (userId, data) => request.post(`${HOST}/auth/person/${userId}/decrypt`, data),

  // 查询salesToken
  getSalesToken: (b_card_id) => request.post(`${HOST}/api/mp/bCard/getSalesToken`, { b_card_id }),

  // 更新最后浏览，用于名片列表排序
  updateLastView: (customer_id) => request.post(`${HOST}/api/mp/bCard/updateLastView`, { customer_id }),

  // 获得名片列表
  getCardList: (customer_id, page, row, access_token) => request.post(`${HOST}/api/mp/bCard/getCardList`, { customer_id, page, row }),

  // 查看名片详情
  getCardDetail: (customer_id) => request.post(`${HOST}/api/mp/bCard/viewCard`, { customer_id }),

  // 名片浏览、点赞、转发事件
  updateCard: (customer_id, event) => request.post(`${HOST}/api/mp/bCard/event`, { customer_id, event }),

  // 查询是否点赞过名片
  getCardSupportState: (customerId, b_card_id) => request.get(`${HOST}/api/mp/bCard/haveSupported`, { customerId, b_card_id }),

  // 根据 openid 获取 customerId
  getCustomerByOpenid: (openid) => request.get(`${HOST}/api/mp/bCard/getCustomerByOpenid?openid=${openid}`),

  // 获取销售产品列表
  getProductList: (page, row) => request.get(`${HOST}/api/mp/product/getProducts`, { page, row }),

  // 获取产品详情
  getProductDetail: (productId) => request.get(`${HOST}/api/mp/product/getDetail`, { productId }),

  // 产品浏览、点赞、转发事件
  updateProduct: (customerId, productId, event) => request.get(`${HOST}/api/mp/product/event`, { customerId, productId, event }),

  // 查询是否点赞过商品
  getProductSupportState: (customerId, productId) => request.get(`${HOST}/api/mp/product/haveSupported`, { customerId, productId }),

  // 查看官网
  getWebSite: () => request.get(`${HOST}/api/mp/website/query`),

  // 添加情报
  addInfo: (data) => request.post(`${HOST}/api/mp/information/add`, { objectType: data.objectType, objectId: data.objectId, goalsType: data.goalsType, fromType: data.fromType, fromId: data.fromId, action: data.action, actionGoals: data.actionGoals, revisitLog: data.revisitLog }),

  // 标记消息已读
  markMsgRead: (msgSeq) => request.post(`${IMHOST}/im/msg/status`, { msgSeq }),

  // 发送消息
  pushMsg: (data) => request.post(`${IMHOST}/im/msg`, data),

  // 发送模板ID
  sendFormId: (data) => request.post(`${IMHOST}/im/mp/form`, data),

  // 查询 im 信息
  getImAccount: (accountType, data) => request.post(`${IMHOST}/im/${accountType}/user/info`, data),

  // 获取余额
  getRedpacketBalance: (customerId) => request.get(`${HOST}/api/mp/redpacket/getAccount?customer_id=${customerId}`),

  // 发红包
  sendRedpacket: (data) => request.post(`${HOST}/api/mp/redpacket/send`, data),

  // 收红包
  receiveRedpacket: (data) => request.get(`${HOST}/api/mp/redpacket/receive?redpacket_order=${data.redpacket_order}&customer_id=${data.customer_id}`),

  // 查询是否收过红包
  canReceive: (data) => request.get(`${HOST}/api/mp/redpacket/canReceive?redpacket_order=${data.redpacket_order}&customer_id=${data.customer_id}`),

  // 红包记录
  redpacketRecord: (data) => request.get(`${HOST}/api/mp/redpacket/record?redpacket_order=${data.redpacket_order}&customer_id=${data.customer_id}&page=${data.page}&row=${data.row}`),

  // 提现
  withdraw: (data) => request.post(`${HOST}/api/mp/redpacket/withdraw`, data),

  // 转发红包
  forwardRedpacket: (data) => request.post(`${HOST}/api/mp/redpacket/forward`, data),

  // 红包支付网关
  redpacketGateway: (data) => request.post(PAY_GATEWAY, data),

  // 红包提现网关
  redpacketWithdrawGateway: (data) => request.post(PAY_GATEWAY, data),

  //交易记录
  getTradeRecords: (data) => request.post(`${HOST}/api/mp/redpacket/getTradeRecords`, data),
}

export default api
