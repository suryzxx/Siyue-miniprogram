/**
 * 候补服务
 * 后端未提供候补相关接口，全部强制使用模拟数据
 */

const waitlistService = {
  /**
   * 获取候补列表
   * 后端未提供，强制使用模拟数据
   * @param {Object} params - 查询参数
   * @param {string} params.status - 候补状态筛选
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   */
  getList(params = {}) {
    // 后端未提供此接口，强制使用模拟数据
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '获取成功',
          data: {
            list: [
              {
                id: 'waitlist_001',
                className: 'K3进阶一班',
                campus: '同曦校区',
                schedule: '周三、周日 14:00-16:30',
                position: 3,
                status: 'waiting',
                statusName: '排队中',
                createdAt: '2026-03-01 10:00:00'
              }
            ],
            total: 1
          }
        })
      }, 300)
    })
  },

  /**
   * 获取候补详情
   * 后端未提供，强制使用模拟数据
   * @param {string} id - 候补ID
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
            className: 'K3进阶一班',
            campus: { id: 'campus_001', name: '同曦校区' },
            schedule: '周三、周日 14:00-16:30',
            position: 3,
            status: 'waiting',
            statusName: '排队中',
            createdAt: '2026-03-01 10:00:00'
          }
        })
      }, 300)
    })
  },

  /**
   * 确认候补（有空位时确认报名）
   * 后端未提供，强制使用模拟数据
   * @param {string} id - 候补ID
   */
  confirm(id) {
    // 后端未提供此接口，强制使用模拟数据
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '已确认报名',
          data: {
            id: id,
            status: 'confirmed'
          }
        })
      }, 500)
    })
  },

  /**
   * 取消候补
   * 后端未提供，强制使用模拟数据
   * @param {string} id - 候补ID
   */
  cancel(id) {
    // 后端未提供此接口，强制使用模拟数据
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '已取消候补',
          data: null
        })
      }, 300)
    })
  }
}

module.exports = { waitlistService }
