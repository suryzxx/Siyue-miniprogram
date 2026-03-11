/**
 * 评测服务
 * 后端未提供评测相关接口，全部强制使用模拟数据
 */

const assessmentService = {
  /**
   * 获取可评测的校区列表
   * 后端未提供，强制使用模拟数据
   */
  getCampuses(params = {}) {
    // 后端未提供此接口，强制使用模拟数据
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '获取成功',
          data: {
            list: [
              { id: 'campus_001', name: '同曦校区', address: '南京市建邺区同曦大厦' },
              { id: 'campus_002', name: '奥体网球中心校区', address: '南京市建邺区奥体中心' }
            ]
          }
        })
      }, 300)
    })
  },

  /**
   * 获取可预约时段
   * 后端未提供，强制使用模拟数据
   */
  getSlots(campusId, startDate, endDate) {
    // 后端未提供此接口，强制使用模拟数据
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '获取成功',
          data: {
            slots: [
              { date: '2026-03-15', time: '09:00-10:00', available: true },
              { date: '2026-03-15', time: '10:00-11:00', available: true },
              { date: '2026-03-15', time: '14:00-15:00', available: false },
              { date: '2026-03-16', time: '09:00-10:00', available: true },
              { date: '2026-03-16', time: '10:00-11:00', available: true }
            ]
          }
        })
      }, 300)
    })
  },

  /**
   * 创建评测预约
   * 后端未提供，强制使用模拟数据
   */
  create(data) {
    // 后端未提供此接口，强制使用模拟数据
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '预约成功',
          data: {
            id: 'assessment_' + Date.now(),
            studentId: data.studentId,
            campusId: data.campusId,
            bookDate: data.bookDate,
            bookTime: data.bookTime,
            status: 'booked'
          }
        })
      }, 500)
    })
  },

  /**
   * 获取评测预约列表
   * 后端未提供，强制使用模拟数据
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
                id: 'assessment_001',
                campus: { id: 'campus_001', name: '同曦校区' },
                bookDate: '2026-03-15',
                bookTime: '09:00-10:00',
                status: 'booked',
                statusName: '已预约'
              }
            ],
            total: 1
          }
        })
      }, 300)
    })
  },

  /**
   * 获取评测预约详情
   * 后端未提供，强制使用模拟数据
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
            campus: { id: 'campus_001', name: '同曦校区', address: '南京市建邺区同曦大厦' },
            bookDate: '2026-03-15',
            bookTime: '09:00-10:00',
            status: 'booked',
            statusName: '已预约',
            createdAt: '2026-03-10 10:00:00'
          }
        })
      }, 300)
    })
  },

  /**
   * 取消评测预约
   * 后端未提供，强制使用模拟数据
   */
  cancel(id) {
    // 后端未提供此接口，强制使用模拟数据
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '已取消预约',
          data: null
        })
      }, 300)
    })
  }
}

module.exports = { assessmentService }
