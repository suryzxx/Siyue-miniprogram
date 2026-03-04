const { get, post } = require('../utils/request')
const { config } = require('../utils/config')
const { getClassesByStudentId, getAttendanceScheduleByClassId, getRefundInfoByClassId } = require('../utils/mock-data')

const myClassService = {
  /**
   * 获取我的班级列表
   */
  getMyClasses(params = {}) {
    if (config.useLocalMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const classes = getClassesByStudentId(params.studentId)
          resolve({
            code: 200,
            message: '获取成功',
            data: {
              list: classes,
              total: classes.length
            }
          })
        }, 300)
      })
    }
    return get('/myclasses', params)
  },

  /**
   * 获取班级详情
   */
  getClassDetail(classId, params = {}) {
    if (config.useLocalMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const classes = getClassesByStudentId(params.studentId)
          const classInfo = classes.find(c => c.id === classId)
          
          if (classInfo) {
            resolve({
              code: 200,
              message: '获取成功',
              data: {
                classInfo,
                studentProgress: {
                  totalSessions: classInfo.totalSessions,
                  attendedSessions: classInfo.currentSession - 1,
                  currentSession: classInfo.currentSession,
                  attendanceRate: classInfo.attendanceRate,
                  lastAttendance: '2026-03-07'
                },
                recentAttendance: []
              }
            })
          } else {
            resolve({
              code: 404,
              message: '班级不存在',
              data: null
            })
          }
        }, 300)
      })
    }
    return get(`/myclasses/${classId}`, params)
  },

  /**
   * 获取可转班列表
   */
  getTransferOptions(classId, params = {}) {
    if (config.useLocalMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            code: 200,
            message: '获取成功',
            data: {
              options: [
                {
                  id: 'class_transfer_001',
                  name: 'K3进阶二班',
                  campus: { id: 'campus_001', name: '同曦校区' },
                  mainTeacher: { id: 'teacher_002', name: 'Shirley苡爽' },
                  schedule: '周三、周日 14:00-16:30',
                  availableSeats: 3
                },
                {
                  id: 'class_transfer_002',
                  name: 'K3进阶三班',
                  campus: { id: 'campus_002', name: '奥体网球中心校区' },
                  mainTeacher: { id: 'teacher_001', name: 'Esther于哲敏' },
                  schedule: '周四、周六 09:00-11:30',
                  availableSeats: 5
                }
              ]
            }
          })
        }, 300)
      })
    }
    return get(`/myclasses/${classId}/transfer-option`, params)
  },

  /**
   * 申请转班
   */
  applyTransfer(classId, data) {
    if (config.useLocalMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            code: 200,
            message: '转班申请已提交',
            data: {
              applicationId: 'transfer_' + Date.now(),
              status: 'pending'
            }
          })
        }, 500)
      })
    }
    return post(`/myclasses/${classId}/transfer`, data)
  },

  /**
   * 获取可调课列表
   */
  getAdjustOptions(classId, params = {}) {
    if (config.useLocalMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            code: 200,
            message: '获取成功',
            data: {
              options: [
                {
                  id: 'adjust_001',
                  date: '2026-03-15',
                  time: '14:00-16:30',
                  className: 'K3进阶二班',
                  campus: '同曦校区',
                  availableSeats: 2
                },
                {
                  id: 'adjust_002',
                  date: '2026-03-16',
                  time: '09:00-11:30',
                  className: 'K3进阶三班',
                  campus: '奥体网球中心校区',
                  availableSeats: 4
                }
              ]
            }
          })
        }, 300)
      })
    }
    return get(`/myclasses/${classId}/adjust-option`, params)
  },

  /**
   * 申请调课
   */
  applyAdjust(classId, data) {
    if (config.useLocalMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            code: 200,
            message: '调课申请已提交',
            data: {
              applicationId: 'adjust_' + Date.now(),
              status: 'pending'
            }
          })
        }, 500)
      })
    }
    return post(`/myclasses/${classId}/adjust`, data)
  },

  /**
   * 获取退班信息
   */
  getRefundInfo(classId, params = {}) {
    if (config.useLocalMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const refundInfo = getRefundInfoByClassId(classId)
          if (refundInfo) {
            resolve({
              code: 200,
              message: '获取成功',
              data: refundInfo
            })
          } else {
            // 返回默认退班信息
            const classes = getClassesByStudentId(params.studentId)
            const classInfo = classes.find(c => c.id === classId)
            resolve({
              code: 200,
              message: '获取成功',
              data: {
                classInfo: classInfo || {},
                paymentInfo: {
                  totalSessions: 15,
                  attendedSessions: 5,
                  remainingSessions: 10,
                  totalPrice: 5475.00,
                  pricePerSession: 365.00,
                  refundableAmount: 3650.00,
                  refundFee: 365.00,
                  finalRefundAmount: 3285.00
                }
              }
            })
          }
        }, 300)
      })
    }
    return get(`/myclasses/${classId}/refund-info`, params)
  },

  /**
   * 申请退班
   */
  applyRefund(classId, data) {
    if (config.useLocalMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            code: 200,
            message: '退班申请已提交',
            data: {
              applicationId: 'refund_' + Date.now(),
              status: 'pending',
              estimatedRefundDate: '2026-03-20'
            }
          })
        }, 500)
      })
    }
    return post(`/myclasses/${classId}/refund`, data)
  },

  /**
   * 撤销退班申请
   */
  cancelRefund(classId, data) {
    if (config.useLocalMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            code: 200,
            message: '已撤销退班申请',
            data: null
          })
        }, 300)
      })
    }
    return post(`/myclasses/${classId}/cancel-refund`, data)
  },

  /**
   * 获取考勤记录
   */
  getAttendance(classId, params = {}) {
    if (config.useLocalMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const data = getAttendanceScheduleByClassId(classId)
          resolve({
            code: 200,
            message: '获取成功',
            data: {
              statistics: data.statistics,
              attendance: data.attendanceSchedule.filter(item => 
                item.attendanceInfo && item.attendanceInfo.attendanceStatus
              )
            }
          })
        }, 300)
      })
    }
    return get(`/myclasses/${classId}/attendance`, params)
  },

  /**
   * 获取课表
   */
  getSchedule(classId, params = {}) {
    if (config.useLocalMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const data = getAttendanceScheduleByClassId(classId)
          resolve({
            code: 200,
            message: '获取成功',
            data: {
              schedule: data.attendanceSchedule.map(item => ({
                date: item.date,
                session: item.session,
                startTime: item.scheduleInfo.startTime,
                endTime: item.scheduleInfo.endTime,
                topic: item.scheduleInfo.topic,
                status: item.scheduleInfo.scheduleStatus
              }))
            }
          })
        }, 300)
      })
    }
    return get(`/myclasses/${classId}/schedule`, params)
  },

  /**
   * 获取当前学生的当前班级（用于个人中心展示）
   */
  getCurrentClasses(params = {}) {
    if (config.useLocalMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const classes = getClassesByStudentId(params.studentId)
          resolve({
            code: 200,
            message: '获取成功',
            data: {
              list: classes,
              total: classes.length
            }
          })
        }, 300)
      })
    }
    return get('/myclasses/current', params)
  },

  /**
   * 获取考勤课表合并数据
   */
  getAttendanceSchedule(classId, params = {}) {
    if (config.useLocalMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const data = getAttendanceScheduleByClassId(classId)
          resolve({
            code: 200,
            message: '获取成功',
            data: data
          })
        }, 300)
      })
    }
    return get(`/myclasses/${classId}/attendance-schedule`, params)
  }
}

module.exports = { myClassService }
