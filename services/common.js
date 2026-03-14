// 通用服务 - 使用 /constants API
const { get } = require('../utils/request')

// 缓存常量数据
let constantsCache = null

const commonService = {
  // 获取常量数据（带缓存）
  async getConstants() {
    if (constantsCache) {
      return constantsCache
    }
    try {
      const res = await get('/constants')
      if (res.code === 200 && res.data) {
        constantsCache = res.data
        return constantsCache
      }
      return null
    } catch (e) {
      console.error('获取常量数据失败', e)
      return null
    }
  },

  // 获取年级列表 - 使用 offline_grade
  async getGrades() {
    try {
      const constants = await this.getConstants()
      if (constants && constants.offline_grade) {
        // 转换为 { code, name } 格式，code 对应 value
        const grades = constants.offline_grade.map(item => ({
          code: item.value,
          name: item.label
        }))
        return {
          code: 200,
          message: 'success',
          data: grades
        }
      }
      return { code: 500, message: '获取年级列表失败', data: [] }
    } catch (e) {
      console.error('加载年级列表失败', e)
      return { code: 500, message: e.message || '获取年级列表失败', data: [] }
    }
  },

  // 获取城市列表 - 使用 address（展平为省市列表）
  async getCities() {
    try {
      const constants = await this.getConstants()
      if (constants && constants.address) {
        // 展平为省/直辖市 + 地级市列表
        const cities = []
        constants.address.forEach(province => {
          // 添加省/直辖市
          cities.push({
            code: province.value,
            name: province.label
          })
          // 添加地级市
          if (province.children) {
            province.children.forEach(city => {
              if (city.label !== '市辖区') {
                cities.push({
                  code: city.value,
                  name: city.label
                })
              }
            })
          }
        })
        return {
          code: 200,
          message: 'success',
          data: cities
        }
      }
      return { code: 500, message: '获取城市列表失败', data: [] }
    } catch (e) {
      console.error('加载城市列表失败', e)
      return { code: 500, message: e.message || '获取城市列表失败', data: [] }
    }
  },

  // 根据年级代码获取年级名称
  async getGradeName(gradeCode) {
    if (!gradeCode) return ''
    try {
      const constants = await this.getConstants()
      if (constants && constants.offline_grade) {
        const grade = constants.offline_grade.find(g => g.value === gradeCode)
        return grade ? grade.label : gradeCode
      }
      return gradeCode
    } catch (e) {
      return gradeCode
    }
  },

  async getGradeMap() {
    try {
      const constants = await this.getConstants()
      console.log('[Common] constants:', constants)
      console.log('[Common] offline_grade:', constants?.offline_grade)
      if (constants && constants.offline_grade) {
        const map = {}
        constants.offline_grade.forEach(g => {
          map[g.value] = g.label
        })
        console.log('[Common] gradeMap result:', map)
        return map
      }
      console.log('[Common] No offline_grade found')
      return {}
    } catch (e) {
      console.error('[Common] getGradeMap error:', e)
      return {}
    }
  },

  // 获取校区列表
  getCampusList(page = 1, pageSize = 100) {
    return get('/client/open/campus/list', { page, page_size: pageSize }).then(res => {
      if (res.code === 200 && res.data) {
        const list = (res.data.list || res.data || []).map(item => ({
          id: item.id,
          name: item.name,
          address: item.address || '',
          province: item.province || '',
          city: item.city || '',
          area: item.area || ''
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
  },

  // 获取教室列表
  getClassroomList(page = 1, pageSize = 100) {
    return get('/client/open/class_room/list', { page, page_size: pageSize }).then(res => {
      if (res.code === 200 && res.data) {
        const list = (res.data.list || res.data || []).map(item => ({
          id: item.id,
          name: item.name,
          campus_id: item.campus_id,
          campus_name: item.campus_name || ''
        }))
        return {
          code: 200,
          message: 'success',
          data: list
        }
      }
      return res
    }).catch(err => {
      console.error('[commonService.getClassroomList] Error:', err)
      return {
        code: 500,
        message: err.message || '获取教室列表失败',
        data: []
      }
    })
  },

  // 获取用户信息（包含课程顾问二维码）
  getUserInfo() {
    return get('/client/api/user/info').then(res => {
      if (res.code === 200 && res.data) {
        return {
          code: 200,
          message: 'success',
          data: {
            guwenPoster: res.data.guwen?.poster || ''
          }
        }
      }
      return res
    }).catch(err => {
      console.error('[commonService.getUserInfo] Error:', err)
      return {
        code: 500,
        message: err.message || '获取用户信息失败',
        data: null
      }
    })
  }
}

module.exports = { commonService }
