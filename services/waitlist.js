const { get, post, del } = require('../utils/request')

const waitlistService = {
  /**
   * 获取候补列表
   * @param {Object} params - 查询参数
   * @param {string} params.status - 候补状态筛选
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   */
  getList(params = {}) {
    return get('/waitlists', params)
  },

  /**
   * 获取候补详情
   * @param {string} id - 候补ID
   */
  getDetail(id) {
    return get(`/waitlists/${id}`)
  },

  /**
   * 确认候补（有空位时确认报名）
   * @param {string} id - 候补ID
   */
  confirm(id) {
    return post(`/waitlists/${id}/confirm`)
  },

  /**
   * 取消候补
   * @param {string} id - 候补ID
   */
  cancel(id) {
    return del(`/waitlists/${id}`)
  }
}

module.exports = { waitlistService }
