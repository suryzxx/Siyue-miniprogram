// 模拟数据 - 通用服务

// 模拟年级数据
const mockGrades = [
  { code: 'kindergarten', name: '幼儿园' },
  { code: 'k1', name: '幼儿园小班' },
  { code: 'k2', name: '幼儿园中班' },
  { code: 'k3', name: '幼儿园大班' },
  { code: 'grade1', name: '一年级' },
  { code: 'grade2', name: '二年级' },
  { code: 'grade3', name: '三年级' },
  { code: 'grade4', name: '四年级' },
  { code: 'grade5', name: '五年级' },
  { code: 'grade6', name: '六年级' }
]

// 模拟城市数据
const mockCities = [
  { code: 'nanjing', name: '南京' },
  { code: 'beijing', name: '北京' },
  { code: 'shanghai', name: '上海' },
  { code: 'guangzhou', name: '广州' },
  { code: 'shenzhen', name: '深圳' },
  { code: 'hangzhou', name: '杭州' },
  { code: 'suzhou', name: '苏州' },
  { code: 'chengdu', name: '成都' }
]

const commonService = {
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
  }
}

module.exports = { commonService }
