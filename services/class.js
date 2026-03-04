const { get, post } = require('../utils/request')

const classService = {
  /**
   * 获取班级列表（支持游标分页，用于无限滚动）
   * @param {Object} params - 查询参数
   * @param {string} params.semester - 学期筛选
   * @param {string} params.campusId - 校区筛选
   * @param {string} params.teacherId - 主教老师筛选
   * @param {string} params.cursor - 游标，用于加载更多
   */
  getList(params = {}) {
    return get('/classes', params)
  },

  /**
   * 获取班级详情
   * @param {string} id - 班级ID
   */
  getDetail(id) {
    return get(`/classes/${id}`)
  },

  /**
   * 获取筛选选项（学期、校区、老师）
   */
  getFilters() {
    return get('/classes/filters')
  },

  /**
   * 报名班级（创建订单）
   * @param {string} classId - 班级ID
   * @param {string} studentId - 学生ID
   */
  enroll(classId, studentId) {
    return post(`/classes/${classId}/enroll`, { studentId })
  },

  /**
   * 加入候补
   * @param {string} classId - 班级ID
   * @param {string} studentId - 学生ID
   */
  joinWaitlist(classId, studentId) {
    return post(`/classes/${classId}/waitlist`, { studentId })
  }
}

module.exports = { classService }
