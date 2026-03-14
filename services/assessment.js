/**
 * 评测服务
 */

const { get, post } = require('../utils/request')
const { config } = require('../utils/config')

const assessmentService = {
  /**
   * 获取可评测的校区列表
   * 后端接口: GET /client/open/campus/list
   */
  getCampuses(params = {}) {
    if (config.useLocalMock) {
      return Promise.resolve({
        code: 200,
        message: '获取成功',
        data: {
          list: [
            { id: 'campus_001', name: '同曦校区', address: '南京市建邺区同曦大厦' },
            { id: 'campus_002', name: '奥体网球中心校区', address: '南京市建邺区奥体中心' }
          ]
        }
      })
    }
    return get('/client/open/campus/list', { page: 1, page_size: 100 }).then(res => {
      if (res.code === 200 && res.data) {
        const list = (res.data.list || res.data || []).map(item => ({
          id: item.id,
          name: item.name,
          address: item.address || ''
        }))
        return {
          code: 200,
          message: '获取成功',
          data: { list }
        }
      }
      return res
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
   * 后端接口: POST /client/api/subscribe/review/create
   */
  create(data) {
    if (config.useLocalMock) {
      return Promise.resolve({
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
    }
    // 转换参数格式：campus_id 和 time_at
const requestData = {
campus_id: data.campusId,
      time_at: data.bookDate + ' ' + data.bookTime + ':00'
}
    return post('/client/api/subscribe/review/create', requestData)
  },

  /**
   * 获取评测预约列表
   * 后端接口: GET /client/api/subscribe/review/list
   */
  getList(params = {}) {
    return get('/client/api/subscribe/review/list').then(res => {
      console.log('[assessmentService] getList response:', res)
      if (res.code === 200 && res.data) {
        const rawData = res.data.list || res.data || []
        const list = (Array.isArray(rawData) ? rawData : []).map(item => {
          console.log('[assessmentService] item:', item)
          // 解析时间字段（多种可能的字段名）
          const timeAt = item.time_at || item.timeAt || item.TimeAt || item.Time_at || item.time || item.Time || ''
          // 格式化时间: 2026-03-13T10:30:00+08:00 -> 2026-03-13 10:30
          let formattedTime = timeAt
          if (timeAt) {
            // 处理 ISO 8601 格式：把T替换为空格，只保留日期和时间(到分钟)
            formattedTime = timeAt.replace('T', ' ').substring(0, 16)
          }
          // 解析状态名称（多种可能的字段名）
          const statusName = item.status_name || item.statusName || item.StatusName || item.Status_name || item.statusText || item.statusText || item.status || ''
          return {
            id: item.id,
            campusName: item.campus_name || item.campusName || item.CampusName || '',
            addressDetail: item.address_detail || item.addressDetail || '',
            campusAddress: item.campus_address || item.campusAddress || item.CampusAddress || '',
            timeAt: timeAt,
            formattedTime: formattedTime,
            status: item.status || 'pending',
            statusName: statusName,
            resultLevel: item.result_level || item.resultLevel || item.ResultLevel || '',
            createdAt: item.created_at || item.createdAt || item.CreatedAt || ''
          }
        })
        console.log('[assessmentService] processed list:', list)
        return {
          code: 200,
          message: '获取成功',
          data: { list }
        }
      }
      return res
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
   * 后端接口: POST /client/api/subscribe/review/cancel
   */
  cancel(id) {
    if (config.useLocalMock) {
      return Promise.resolve({
        code: 200,
        message: '已取消预约',
        data: null
      })
    }
    return post('/client/api/subscribe/review/cancel', { id })
  }
}

module.exports = { assessmentService }
