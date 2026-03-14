// 学生服务 - 使用真实 API
const { authService } = require('./auth')
const { get, post } = require('../utils/request')

const studentService = {
  /**
   * 获取学生列表
   * 调用 /client/api/user/info 获取用户信息，包含主学生和其他学生
   */
  getList() {
    return authService.getUserInfoWithToken().then(res => {
      if (res.code === 200 && res.data) {
        const data = res.data
        
        // 当前学生（主学生）
        const currentStudent = {
          id: data.id,
          code: data.code,
          name: data.name,
          sex: data.sex,
          sex_name: data.sex_name,
          en_name: data.en_name,
          birthday: data.birthday,
          grade: data.grade,
          school: data.school,
          city: data.city
        }
        
        // 其他学生
        const otherStudents = (data.others || []).map(s => ({
          id: s.id,
          code: s.code,
          name: s.name,
          sex: s.sex,
          sex_name: s.sex_name,
          en_name: s.en_name,
          birthday: s.birthday,
          grade: s.grade,
          school: s.school,
          city: s.city
        }))
        
        // 所有学生
        const allStudents = [currentStudent, ...otherStudents]
        
        return {
          code: 200,
          message: 'success',
          data: {
            list: allStudents,
            total: allStudents.length
          }
        }
      }
      return res
    }).catch(err => {
      console.error('[studentService.getList] Error:', err)
      return {
        code: 500,
        message: err.message || '获取学生列表失败',
        data: { list: [], total: 0 }
      }
    })
  },

  /**
   * 获取学生详情
   * 从全局数据中查找，因为 API 没有单独的详情接口
   */
  getDetail(id) {
    return new Promise((resolve) => {
      const app = getApp()
      const students = app.globalData.students || []
      const student = students.find(s => s.id === id)
      
      if (student) {
        resolve({
          code: 200,
          message: 'success',
          data: student
        })
      } else {
        // 如果全局数据中没有，尝试从 API 重新获取
        this.getList().then(res => {
          if (res.code === 200 && res.data && res.data.list) {
            const found = res.data.list.find(s => s.id === id)
            if (found) {
              resolve({
                code: 200,
                message: 'success',
                data: found
              })
            } else {
              resolve({
                code: 404,
                message: '学生不存在'
              })
            }
          } else {
            resolve({
              code: 404,
              message: '学生不存在'
            })
          }
        })
      }
    })
  },

  /**
   * 切换当前学生
   * 调用 /client/api/user/switch 切换学生，返回新 token
   */
  switchCurrent(id) {
    return authService.switchStudent(id)
  },

  /**
   * 获取当前学生ID
   */
  getCurrentStudentId() {
    const app = getApp()
    return app.globalData.currentStudentId || null
  },

  /**
   * 创建学生 - 已在 authService.createStudentWithTempToken 中实现
   * 此方法保留用于后续添加新学生的场景
   */
  create(data) {
    // TODO: 实现添加新学生的 API 调用
    return Promise.resolve({
      code: 500,
      message: '暂不支持添加新学生'
    })
  },

  /**
   * 更新学生
   */
  update(id, data) {
    // 后端接口: POST /client/api/user/update
    // id: 0或不传更改当前学生信息，否则更改对应学生的信息
    const requestData = {
      id: parseInt(id, 10) || 0,  // 确保 id 是整数
      ...data
    }
    return post('/client/api/user/update', requestData)
  },

  /**
   * 删除学生
   */
  remove(id) {
    // 后端接口: POST /client/api/user/delete
    return post('/client/api/user/delete', { id: parseInt(id, 10) })  // 确保 id 是整数
  }
}

module.exports = { studentService }
