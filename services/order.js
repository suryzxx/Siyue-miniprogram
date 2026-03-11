const { get, post } = require('../utils/request')
const { config } = require('../utils/config')

const orderService = {
  /**
   * 获取订单列表
   * 后端接口: GET /client/api/class/order/list
   * 如果想获取某个订单的话，使用参数 search[order_no]=订单号
   * @param {Object} params - 查询参数
   * @param {string} params.status - 订单状态筛选
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   */
  getList(params = {}) {
    if (config.useLocalMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            code: 200,
            message: '获取成功',
            data: {
              list: [
                {
                  id: 'order_001',
                  order_no: 'B7436052644529025024',
                  class_name: 'K3进阶一班',
                  status: 'paid',
                  status_name: '已支付',
                  amount: 5475.00,
                  created_at: '2026-03-01 10:30:00'
                }
              ],
              total: 1
            }
          })
        }, 300)
      })
    }
    // 使用后端真实接口
    const apiParams = {
      page: params.page || 1,
      page_size: params.pageSize || 10
    }
    if (params.orderNo) {
      apiParams['search[order_no]'] = params.orderNo
    }
    return get('/client/api/class/order/list', apiParams)
  },

  /**
   * 获取订单详情
   * 后端未提供单独详情接口，通过列表接口的 search[order_no] 获取
   * @param {string} id - 订单ID 或 订单号
   */
  getDetail(id) {
    if (config.useLocalMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            code: 200,
            message: '获取成功',
            data: {
              id: id,
              order_no: 'B7436052644529025024',
              class_id: 546,
              class_name: 'K3进阶一班',
              student_name: 'ccc',
              status: 'paid',
              status_name: '已支付',
              amount: 5475.00,
              created_at: '2026-03-01 10:30:00',
              paid_at: '2026-03-01 10:35:00'
            }
          })
        }, 300)
      })
    }
    // 使用列表接口通过订单号查询
    return get('/client/api/class/order/list', { 'search[order_no]': id }).then(res => {
      if (res.code === 200 && res.data && res.data.list && res.data.list.length > 0) {
        return {
          code: 200,
          message: '获取成功',
          data: res.data.list[0]
        }
      }
      return {
        code: 404,
        message: '订单不存在',
        data: null
      }
    })
  },

  /**
   * 创建订单（发起支付）
   * 后端接口: POST /client/api/class/order/create
   * @param {Object} data - 订单数据
   * @param {number} data.classId - 班级ID
   * @param {string} data.code - wx.login 返回的code
   */
  create(data) {
    if (config.useLocalMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            code: 200,
            message: '订单创建成功',
            data: {
              order_no: 'B' + Date.now(),
              pay_sign: 'mock_pay_sign',
              sign_type: 'RSA',
              time_stamp: String(Math.floor(Date.now() / 1000)),
              nonce_str: 'mock_nonce_str',
              package: 'prepay_id=mock_prepay_id',
              app_id: 'wxef277996acc166c3'
            }
          })
        }, 500)
      })
    }
    // 使用后端真实接口
    return post('/client/api/class/order/create', {
      class_id: data.classId,
      code: data.code
    })
  },

  /**
   * 支付订单（调用微信支付）
   * 后端未提供单独支付接口，支付信息在create时返回
   * @param {string} id - 订单ID
   */
  pay(id) {
    // 后端未提供此接口，强制使用模拟数据
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '支付成功',
          data: {
            order_no: id,
            status: 'paid'
          }
        })
      }, 500)
    })
  },

  /**
   * 取消订单
   * 后端未提供，强制使用模拟数据
   * @param {string} id - 订单ID
   */
  cancel(id) {
    // 后端未提供此接口，强制使用模拟数据
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '订单已取消',
          data: null
        })
      }, 300)
    })
  },

  /**
   * 申请退款
   * 后端未提供，强制使用模拟数据
   * @param {string} id - 订单ID
   * @param {string} reason - 退款原因
   */
  refund(id, reason) {
    // 后端未提供此接口，强制使用模拟数据
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '退款申请已提交',
          data: {
            refund_no: 'R' + Date.now(),
            status: 'pending'
          }
        })
      }, 500)
    })
  }
}

module.exports = { orderService }
