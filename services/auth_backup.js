const { post, get, setToken, removeToken } = require('../utils/request')
const { config } = require('../utils/config')
const { getUserByPhone, hasStudents } = require('../utils/mock-data')

const authService = {
  /**
   * 微信手机号登录
   */
  wxPhoneLogin(code) {
    if (config.useLocalMock) {
      // Mock response for mini-program login
      return Promise.resolve({
        code: 200,
        message: '登录成功',
        data: {
          token: 'mock_temp_token_' + Date.now(),
          is_temp_token: true
        }
      })
    }
    // 小程序登录需要固定Authorization头
    return post('/client/open/user/miniapp/login', { code }, {
      header: {
        'Authorization': '2bd733551dfd415b9e70644c9cf19ddf'
      }
    }).then(res => {
      if (res.data && res.data.token) {
        setToken(res.data.token)
      }
      return res
    })
  },

  /**
   * 手机号登录
   * 手机号1: 17788889999 - 有3个学生，直接进入个人中心
   * 手机号2: 12233334444 - 无学生，引导创建学生档案
   */
  login(phone) {
    if (config.useLocalMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const user = getUserByPhone(phone)
          
          if (!user) {
            // 手机号不存在
            resolve({
              code: 404,
              message: '该手机号未注册',
              data: null
            })
            return
          }

          // 设置模拟token
          setToken(user.token)

          // 返回用户数据
          resolve({
            code: 200,
            message: '登录成功',
            data: {
              token: user.token,
              user: {
                id: user.id,
                phone: user.phone
              },
              students: user.students,
              hasStudents: user.students.length > 0
            }
          })
        }, 500) // 模拟网络延迟
      })
    }

    return post('/auth/login', { phone }).then(res => {
      if (res.data && res.data.token) {
        setToken(res.data.token)
      }
      return res
    })
  },

  /**
   * 退出登录
   */
  logout() {
    if (config.useLocalMock) {
      removeToken()
      return Promise.resolve({
        code: 200,
        message: '退出成功',
        data: null
      })
    }
    return post('/auth/logout').then(res => {
      removeToken()
      return res
    })
  },

  /**
   * 获取当前用户信息
   */
  getMe() {
    if (config.useLocalMock) {
      // 从本地存储获取当前登录的手机号
      return Promise.resolve({
        code: 200,
        message: '获取成功',
        data: {
          user: { id: 'user_001', phone: '17788889999' },
          students: []
        }
      })
    }
    return get('/auth/me')
  },

  /**
   * 刷新token
   */
  refresh() {
    if (config.useLocalMock) {
      return Promise.resolve({
        code: 200,
        message: '刷新成功',
        data: { token: 'mock_refreshed_token' }
      })
    }
    return post('/auth/refresh').then(res => {
      if (res.data && res.data.token) {
        setToken(res.data.token)
      }
      return res
    })
  },

  /**
   * 发送验证码（模拟）
   */
  sendCode(phone) {
    if (config.useLocalMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(`[Mock] 向 ${phone} 发送验证码: 123456`)
          resolve({
            code: 200,
            message: '验证码已发送',
            data: { expires: 60 }
          })
        }, 300)
      })
    }
    return post('/auth/send-code', { phone })
  },

  /**
   * 验证验证码（模拟，任意6位数字都通过）
   */
  verifyCode(phone, code) {
    if (config.useLocalMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (code && code.length === 6) {
            resolve({
              code: 200,
              message: '验证成功',
              data: { verified: true }
            })
          } else {
            resolve({
              code: 400,
              message: '验证码错误',
              data: { verified: false }
            })
          }
        }, 300)
      })
    }
    return post('/auth/verify-code', { phone, code })
  },

  /**
   * 临时token创建学生
   */
  createStudentWithTempToken(studentData) {
    if (config.useLocalMock) {
      // Mock response for student creation
      return Promise.resolve({
        code: 200,
        message: '学生创建成功',
        data: {
          token: 'mock_normal_token_' + Date.now(),
          is_temp_token: false
        }
      })
    }
    // 使用临时token创建学生需要固定Authorization头
    return post('/client/open/user/create', studentData, {
      header: {
        'Authorization': '2bd733551dfd415b9e70644c9cf19ddf'
      }
    }).then(res => {
      if (res.data && res.data.token) {
        setToken(res.data.token)
      }
      return res
    })
  },

  /**
   * 获取用户信息（包含学生列表）
   */
  getUserInfoWithToken() {
    if (config.useLocalMock) {
      // Mock response for user info
      return Promise.resolve({
        code: 200,
        message: '获取成功',
        data: {
          id: 1,
          code: 'XB12680',
          name: 'ccc',
          sex: 0,
          sex_name: '未知',
          en_name: 'aa',
          birthday: '2000-12-12',
          school: '测试',
          city: '南京市',
          others: [
            {
              id: 5021,
              code: 'XB12681',
              name: 'ccc2',
              sex: 0,
              sex_name: '未知',
              en_name: 'aa',
              birthday: '2000-12-12',
              school: '测试',
              city: '南京市'
            }
          ]
        }
      })
    }
    return get('/client/api/user/info')
  },

  /**
   * 切换学生
   */
  switchStudent(switchToUid) {
    if (config.useLocalMock) {
      // Mock response for student switching
      return Promise.resolve({
        code: 200,
        message: '切换成功',
        data: {
          token: 'mock_switched_token_' + Date.now(),
          is_temp_token: false
        }
      })
    }
    return post('/client/api/user/switch', { switch_to_uid: switchToUid }).then(res => {
      if (res.data && res.data.token) {
        setToken(res.data.token)
      }
      return res
    })
  }
}

module.exports = { authService }
