const { get, post } = require('../utils/request')

const enrollmentService = {
  /**
   * 获取我的班级列表（已报名的班级）
   * @param {Object} params - 查询参数
   * @param {string} params.status - 报名状态筛选
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   */
  getMyClasses(params = {}) {
    return get('/enrollments', params)
  },

  /**
   * 获取报名详情
   * @param {string} id - 报名ID
   */
  getDetail(id) {
    return get(`/enrollments/${id}`)
  },

  /**
   * 取消报名（退课）
   * @param {string} id - 报名ID
   * @param {string} reason - 取消原因
   */
  cancel(id, reason) {
    return post(`/enrollments/${id}/cancel`, { reason })
  }
}

module.exports = { enrollmentService }
