// 模拟数据 - 通用服务
const { get } = require('../utils/request')

const mockGrades = [
  { code: 'kindergarten', name: '幼儿园大班' },
  { code: 'grade1', name: '一年级' },
  { code: 'grade2', name: '二年级' },
  { code: 'grade3', name: '三年级' },
  { code: 'grade4', name: '四年级' },
  { code: 'grade5', name: '五年级' },
  { code: 'grade6', name: '六年级' }
]

const mockCities = [
  { code: 'nanjing', name: '南京' },
  { code: 'beijing', name: '北京' },
  { code: 'shanghai', name: '上海' },
  { code: 'guangzhou', name: '广州' },
  { code: 'chengdu', name: '成都' },
  { code: 'hangzhou', name: '杭州' }
]

const commonService = {
  // 获取年级列表
  getGrades() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: 'success',
          data: mockGrades
        })
      }, 200)
    })
  },

  // 获取城市列表
  getCities() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: 'success',
          data: mockCities
        })
      }, 200)
    })
  },

  // 获取校区列表
  getCampusList(page = 1, pageSize = 100) {
    return get('/client/open/campus/list', { page, page_size: pageSize }).then(res => {
      if (res.code === 200 && res.data) {
        const list = (res.data.list || res.data || []).map(item => ({
          id: item.id,
          name: item.name,
          address: item.address || ''
        }))
        return {
          code: 200,
          message: 'success',
          data: list
        }
      }
      return res
    }).catch(err => {
      console.error('[commonService.getCampusList] Error:', err)
      return {
        code: 500,
        message: err.message || '获取校区列表失败',
        data: []
      }
    })
  },

  // 获取教师列表
  getTeacherList(page = 1, pageSize = 100) {
    return get('/client/open/teacher/list', { page, page_size: pageSize }).then(res => {
      if (res.code === 200 && res.data) {
        const list = (res.data.list || res.data || []).map(item => ({
          id: item.id,
          name: item.name,
          avatar: item.avatar || ''
        }))
        return {
          code: 200,
          message: 'success',
          data: list
        }
      }
      return res
    }).catch(err => {
      console.error('[commonService.getTeacherList] Error:', err)
      return {
        code: 500,
        message: err.message || '获取教师列表失败',
        data: []
      }
    })
  }
}

module.exports = { commonService }
module.exports = { commonService }
