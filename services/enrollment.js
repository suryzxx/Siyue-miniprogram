/**
 * 报名服务
 * 后端未提供报名相关接口，全部强制使用模拟数据
 */

const enrollmentService = {
  /**
   * 获取我的班级列表（已报名的班级）
   * 后端未提供，强制使用模拟数据
   * @param {Object} params - 查询参数
   * @param {string} params.status - 报名状态筛选
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   */
  getMyClasses(params = {}) {
    // 后端未提供此接口，强制使用模拟数据
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '获取成功',
          data: {
            list: [
              {
                id: 'enrollment_001',
                classId: 'class_001',
                className: 'K3进阶一班',
                campus: '同曦校区',
                schedule: '周三、周日 14:00-16:30',
                status: 'active',
                statusName: '在读',
                enrolledAt: '2026-03-01 10:00:00'
              }
            ],
            total: 1
          }
        })
      }, 300)
    })
  },

  /**
   * 获取报名详情
   * 后端未提供，强制使用模拟数据
   * @param {string} id - 报名ID
   */
  getDetail(id) {
    // 后端未提供此接口，强制使用模拟数据
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '获取成功',
          data: {
            id: id,
            classId: 'class_001',
            className: 'K3进阶一班',
            campus: { id: 'campus_001', name: '同曦校区' },
            schedule: '周三、周日 14:00-16:30',
            status: 'active',
            statusName: '在读',
            enrolledAt: '2026-03-01 10:00:00'
          }
        })
      }, 300)
    })
  },

  /**
   * 取消报名（退课）
   * 后端未提供，强制使用模拟数据
   * @param {string} id - 报名ID
   * @param {string} reason - 取消原因
   */
  cancel(id, reason) {
    // 后端未提供此接口，强制使用模拟数据
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '已取消报名',
          data: null
        })
      }, 300)
    })
  }
}

module.exports = { enrollmentService }
