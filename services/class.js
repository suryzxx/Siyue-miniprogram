const { get, post } = require('../utils/request')

const classService = {
  /**
   * 获取班级列表（开放接口，无需登录）
   * @param {Object} params - 查询参数
   */
  getOpenList(params = {}) {
    return get('/client/open/class/list', params)
  },

  /**
   * 获取班级列表（需要登录）
   * @param {Object} params - 查询参数
   */
  getList(params = {}) {
    return get('/client/api/class/list', params)
  },

  /**
   * 获取班级详情
   * @param {string} id - 班级ID
   */
  getDetail(id) {
    return get(`/client/api/class/detail?id=${id}`)
  },

  /**
   * 获取班级详情（开放接口，无需登录）
   * @param {string} id - 班级ID
   */
  getOpenDetail(id) {
    return get(`/client/open/class/detail?id=${id}`)
  },

  /**
   * 获取筛选选项（学期、校区、老师）
   */
  getFilters() {
    return get('/client/api/class/filters')
  },

  /**
   * 报名班级（创建订单）
   * @param {string} classId - 班级ID
   * @param {string} studentId - 学生ID
   */
  enroll(classId, studentId) {
    return post(`/client/api/class/enroll`, { class_id: classId, student_id: studentId })
  },

  /**
   * 加入候补
   * @param {string} classId - 班级ID
   * @param {string} studentId - 学生ID
   */
  joinWaitlist(classId, studentId) {
    return post(`/client/api/class/waitlist`, { class_id: classId, student_id: studentId })
  }
}

module.exports = { classService }
