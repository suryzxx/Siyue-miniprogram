const { post, get, setToken, removeToken } = require('../utils/request')
const { config } = require('../utils/config')
const { getUserByPhone, hasStudents } = require('../utils/mock-data')

const authService = {
  // 性别常量
  SEX_UNKNOWN: 0,
  SEX_MALE: 1,
  SEX_FEMALE: 2,
  
  SexMap: {
    0: '未知',
    1: '男',
    2: '女'
  },
  
  // 学生状态常量
  STATUS_UNKNOWN: 0,
  STATUS_STUDYING: 1,
  STATUS_POTENTIAL: 2,
  STATUS_SLEEPING: 3,
  STATUS_HISTORICAL: 4,
  STATUS_WAITING_LIST: 5,
  STATUS_PRESALE: 6,
  
  StatusMap: {
    0: '未知/未分类',
    1: '在读学生',
    2: '潜在学生',
    3: '沉睡学生',
    4: '历史学生',
    5: '候补学生',
    6: '预售学生'
  },
  
  // 注册渠道常量
  REGIST_CHANNEL_BACKEND: 1,
  REGIST_CHANNEL_MINIPROGRAM: 2,
  
  RegistChannelMap: {
    1: '后台注册',
    2: '小程序注册'
  },
  
  // 发现渠道常量
  DISCOVER_CHANNEL_FRIEND: 1,
  DISCOVER_CHANNEL_XIAOHONGSHU: 2,
  DISCOVER_CHANNEL_SIYUE_COMMUNITY: 3,
  DISCOVER_CHANNEL_SIYUE_OFFICIAL: 4,
  
  DiscoverChannelMap: {
    1: '朋友/熟人推荐',
    2: '小红书',
    3: '思悦社群',
    4: '思悦公众号/视频号'
  },

  /**
   * 微信手机号登录
   * 后端接口: POST /client/open/user/miniapp/login
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
   * 手机号登录（验证码登录）
   * 后端未提供，强制使用模拟数据
   * 手机号1: 17788889999 - 有3个学生，直接进入个人中心
   * 手机号2: 12233334444 - 无学生，引导创建学生档案
   */
  login(phone) {
    // 后端未提供此接口，强制使用模拟数据
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
  },

  /**
   * 退出登录
   * 后端未提供，强制使用模拟数据
   */
  logout() {
    // 后端未提供此接口，强制使用模拟数据
    removeToken()
    return Promise.resolve({
      code: 200,
      message: '退出成功',
      data: null
    })
  },

  /**
   * 获取当前用户信息
   * 后端未提供 /auth/me，强制使用模拟数据
   */
  getMe() {
    // 后端未提供此接口，强制使用模拟数据
    return Promise.resolve({
      code: 200,
      message: '获取成功',
      data: {
        user: { id: 'user_001', phone: '17788889999' },
        students: []
      }
    })
  },

  /**
   * 刷新token
   * 后端未提供，强制使用模拟数据
   */
  refresh() {
    // 后端未提供此接口，强制使用模拟数据
    return Promise.resolve({
      code: 200,
      message: '刷新成功',
      data: { token: 'mock_refreshed_token' }
    })
  },

  /**
   * 发送验证码（模拟）
   * 后端未提供，强制使用模拟数据
   */
  sendCode(phone) {
    // 后端未提供此接口，强制使用模拟数据
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
  },

  /**
   * 验证验证码（模拟，任意6位数字都通过）
   * 后端未提供，强制使用模拟数据
   */
  verifyCode(phone, code) {
    // 后端未提供此接口，强制使用模拟数据
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
  },

  /**
   * 临时token创建学生（新用户首次注册）
   * 后端接口: POST /client/open/user/create
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
   * 老用户新增学生（登录态创建学生）
   * 后端接口: POST /client/api/user/create
   */
  addStudent(studentData) {
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
    return post('/client/api/user/create', studentData).then(res => {
      if (res.data && res.data.token) {
        setToken(res.data.token)
      }
      return res
    })
  },

  /**
   * 获取用户信息（包含学生列表）
   * 后端接口: GET /client/api/user/info
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
   * 获取学生列表（用于 600 错误修复）
   * 后端接口: GET /client/api/user/student/list
   */
  getStudentList() {
    if (config.useLocalMock) {
      return Promise.resolve({
        code: 200,
        message: '获取成功',
        data: {
          list: [
            { uid: 5023, name: '测试学生1' },
            { uid: 5024, name: '测试学生2' }
          ]
        }
      })
    }
    return get('/client/api/user/student/list')
  },

  /**
   * 获取用户信息（带 600 错误自动修复）
   * 修复逻辑：
   * 1. 如果 getUserInfo 返回 600 错误
   * 2. 调用 getStudentList 获取学生列表
   * 3. 取第一个学生的 uid，调用 switchStudent 切换
   * 4. 用新 token 重新调用 getUserInfo
   */
  async getUserInfoWithFix() {
    // 第一次尝试获取用户信息
    let res = await this.getUserInfoWithToken()
    
    // 如果成功，直接返回
    if (res.code === 200) {
      return res
    }
    
    // 如果是 600 错误，尝试修复
    if (res.code === 600) {
      console.log('[Auth] getUserInfo 返回 600，尝试修复...')
      
      try {
        // 1. 获取学生列表
        const listRes = await this.getStudentList()
        console.log('[Auth] getStudentList response:', listRes)
        
        if (listRes.code === 200 && listRes.data && listRes.data.list && listRes.data.list.length > 0) {
          // 2. 取第一个学生的 uid
          const firstStudent = listRes.data.list[0]
          const uid = firstStudent.uid || firstStudent.id
          
          if (!uid) {
            console.error('[Auth] 学生列表中没有有效的 uid')
            return res // 返回原始错误
          }
          
          console.log('[Auth] 找到学生，uid:', uid, '，尝试切换...')
          
          // 3. 切换到这个学生
          const switchRes = await this.switchStudent(uid)
          console.log('[Auth] switchStudent response:', switchRes)
          
          if (switchRes.code === 200 && switchRes.data && switchRes.data.token) {
            // 4. 新 token 已在 switchStudent 中自动保存
            console.log('[Auth] 切换成功，使用新 token 重新获取用户信息...')
            
            // 5. 用新 token 重新获取用户信息
            res = await this.getUserInfoWithToken()
            console.log('[Auth] 修复后 getUserInfo response:', res)
            
            return res
          } else {
            console.error('[Auth] 切换学生失败:', switchRes)
          }
        } else {
          console.error('[Auth] 学生列表为空或获取失败')
        }
      } catch (err) {
        console.error('[Auth] 修复过程中出错:', err)
      }
    }
    
    // 修复失败，返回原始错误
    return res
  },

  /**
   * 切换学生
   * 后端接口: POST /client/api/user/switch
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
