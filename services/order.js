const { get, post } = require('../utils/request')

const orderService = {
  /**
   * 获取订单列表
   * @param {Object} params - 查询参数
   * @param {string} params.status - 订单状态筛选
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   */
  getList(params = {}) {
    return get('/orders', params)
  },

  /**
   * 获取订单详情
   * @param {string} id - 订单ID
   */
  getDetail(id) {
    return get(`/orders/${id}`)
  },

  /**
   * 创建订单
   * @param {Object} data - 订单数据
   * @param {string} data.classId - 班级ID
   * @param {string} data.studentId - 学生ID
   */
  create(data) {
    return post('/orders', data)
  },

  /**
   * 支付订单
   * @param {string} id - 订单ID
   */
  pay(id) {
    return post(`/orders/${id}/pay`)
  },

  /**
   * 取消订单
   * @param {string} id - 订单ID
   */
  cancel(id) {
    return post(`/orders/${id}/cancel`)
  },

  /**
   * 申请退款
   * @param {string} id - 订单ID
   * @param {string} reason - 退款原因
   */
  refund(id, reason) {
    return post(`/orders/${id}/refund`, { reason })
  }
}

module.exports = { orderService }
