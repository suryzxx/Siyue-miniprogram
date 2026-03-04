// 模拟数据 - 学生服务
const { mockUsers } = require('../utils/mock-data')

// 本地存储的学生数据（模拟）
let localStudents = null
let currentStudentId = null

// 初始化学生数据
const initStudents = () => {
  if (localStudents) return
  try {
    const stored = wx.getStorageSync('mock_students')
    const storedCurrentId = wx.getStorageSync('mock_current_student_id')
    if (stored) {
      localStudents = stored
      currentStudentId = storedCurrentId
    } else {
      // 从模拟用户数据初始化
      const user = mockUsers['17788889999']
      if (user && user.students) {
        localStudents = [...user.students]
        currentStudentId = localStudents[0]?.id || null
        wx.setStorageSync('mock_students', localStudents)
        if (currentStudentId) {
          wx.setStorageSync('mock_current_student_id', currentStudentId)
        }
      } else {
        localStudents = []
        currentStudentId = null
      }
    }
  } catch (e) {
    localStudents = []
    currentStudentId = null
  }
}

// 生成唯一ID
const generateId = () => `stu_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

const studentService = {
  // 获取学生列表
  getList() {
    return new Promise((resolve) => {
      initStudents()
      setTimeout(() => {
        resolve({
          code: 200,
          message: 'success',
          data: {
            list: localStudents,
            total: localStudents.length
          }
        })
      }, 300)
    })
  },

  // 获取学生详情
  getDetail(id) {
    return new Promise((resolve) => {
      initStudents()
      const student = localStudents.find(s => s.id === id)
      setTimeout(() => {
        resolve({
          code: student ? 200 : 404,
          message: student ? 'success' : '学生不存在',
          data: student || null
        })
      }, 200)
    })
  },

  // 创建学生
  create(data) {
    return new Promise((resolve) => {
      initStudents()
      const newStudent = {
        id: generateId(),
        name: data.name,
        englishName: data.englishName || '',
        gender: data.gender || '',
        birthDate: '',
        grade: data.grade,
        school: data.school || '',
        city: data.cityCode || '',
        avatar: '/images/pic/avatar.png',
        level: null,
        needTest: true
      }
      localStudents.push(newStudent)
      wx.setStorageSync('mock_students', localStudents)
      
      if (!currentStudentId) {
        currentStudentId = newStudent.id
        wx.setStorageSync('mock_current_student_id', currentStudentId)
      }

      setTimeout(() => {
        resolve({
          code: 200,
          message: '创建成功',
          data: newStudent
        })
      }, 400)
    })
  },

  // 更新学生
  update(id, data) {
    return new Promise((resolve) => {
      initStudents()
      const index = localStudents.findIndex(s => s.id === id)
      if (index >= 0) {
        localStudents[index] = { ...localStudents[index], ...data }
        wx.setStorageSync('mock_students', localStudents)
        setTimeout(() => {
          resolve({
            code: 200,
            message: '更新成功',
            data: localStudents[index]
          })
        }, 300)
      } else {
        setTimeout(() => {
          resolve({
            code: 404,
            message: '学生不存在'
          })
        }, 200)
      }
    })
  },

  // 删除学生
  remove(id) {
    return new Promise((resolve) => {
      initStudents()
      const index = localStudents.findIndex(s => s.id === id)
      if (index >= 0) {
        localStudents.splice(index, 1)
        wx.setStorageSync('mock_students', localStudents)
        
        // 如果删除的是当前学生，切换到第一个
        if (currentStudentId === id) {
          currentStudentId = localStudents[0]?.id || null
          if (currentStudentId) {
            wx.setStorageSync('mock_current_student_id', currentStudentId)
          } else {
            wx.removeStorageSync('mock_current_student_id')
          }
        }
        
        setTimeout(() => {
          resolve({
            code: 200,
            message: '删除成功'
          })
        }, 300)
      } else {
        setTimeout(() => {
          resolve({
            code: 404,
            message: '学生不存在'
          })
        }, 200)
      }
    })
  },

  // 切换当前学生
  switchCurrent(id) {
    return new Promise((resolve) => {
      initStudents()
      const student = localStudents.find(s => s.id === id)
      if (student) {
        currentStudentId = id
        wx.setStorageSync('mock_current_student_id', currentStudentId)
        setTimeout(() => {
          resolve({
            code: 200,
            message: '切换成功',
            data: student
          })
        }, 200)
      } else {
        setTimeout(() => {
          resolve({
            code: 404,
            message: '学生不存在'
          })
        }, 200)
      }
    })
  },

  // 获取当前学生ID
  getCurrentStudentId() {
    initStudents()
    return currentStudentId
  }
}

module.exports = { studentService }
