const { post, get, setToken, removeToken } = require('../utils/request')
const { config } = require('../utils/config')
const { getUserByPhone, hasStudents } = require('../utils/mock-data')

const authService = {
  /**
   * 微信手机号登录
   */
  wxPhoneLogin(code, phoneCode) {
    if (config.useLocalMock) {
      return Promise.resolve({
        code: 200,
        message: '请使用手机号登录',
        data: null
      })
    }
    return post('/auth/wx-phone-login', { code, phoneCode }).then(res => {
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
  }
}

module.exports = { authService }
