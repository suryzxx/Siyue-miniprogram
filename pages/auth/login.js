const { authService } = require('../../services/auth')
const { setToken } = require('../../utils/request')

Page({
  data: {
    navBarHeight: 0,
    agreed: false,
    loading: false
  },
  onLoad() {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    this.setData({
      navBarHeight: app.globalData.navBarHeight
    })
  },

  // 关闭登录页 - 返回个人中心
  onCloseTap() {
    wx.switchTab({
      url: '/pages/my/my'
    })
  },

  // 协议勾选
  onAgreementToggle() {
    this.setData({ agreed: !this.data.agreed })
  },

  // 用户协议
  onUserAgreementTap() {
    wx.navigateTo({ url: '/pages/my/agreement' })
  },

  // 隐私协议
  onPrivacyAgreementTap() {
    wx.navigateTo({ url: '/pages/my/privacy' })
  },
  // 微信手机号授权回调
  async onGetPhoneNumber(e) {
    console.log('[Login] getPhoneNumber callback:', e)
    
    if (!this.data.agreed) {
      wx.showToast({ title: '请先同意用户协议和隐私协议', icon: 'none' })
      return
    }

    if (this.data.loading) return

    // 用户拒绝授权
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      wx.showToast({ title: '需要授权手机号才能登录', icon: 'none' })
      return
    }

    // 获取微信登录 code
    const code = e.detail.code
    if (!code) {
      wx.showToast({ title: '获取授权失败，请重试', icon: 'none' })
      return
    }

    this.setData({ loading: true })
    wx.showLoading({ title: '登录中...' })

    try {
      const res = await authService.wxPhoneLogin(code)
      console.log('[Login] wxPhoneLogin response:', res)
      
      wx.hideLoading()

      if (res.code === 200 && res.data) {
        // 保存 token
        if (res.data.token) {
          setToken(res.data.token)
        }

        const app = getApp()
        
        // 判断是否为临时 token（新用户）
        const isTempToken = res.data.is_temp_token

        if (isTempToken) {
          // 新用户，跳转到添加学生页面
          wx.showToast({ title: '请创建学生档案', icon: 'success' })
          setTimeout(() => {
            wx.redirectTo({ url: '/pages/student/add?from=login' })
          }, 1000)
        } else {
          // 老用户，获取用户信息后跳转
          await this.fetchUserInfo()
          wx.showToast({ title: '登录成功', icon: 'success' })
          setTimeout(() => {
            wx.switchTab({ url: '/pages/my/my' })
          }, 1000)
        }
      } else {
        this.setData({ loading: false })
        wx.showToast({ title: res.message || '登录失败', icon: 'none' })
      }
    } catch (err) {
      wx.hideLoading()
      this.setData({ loading: false })
      console.error('[Login] Error:', err)
      wx.showToast({ title: err.message || '网络错误', icon: 'none' })
    }
  },

  // 获取用户信息（包含学生列表）
  async fetchUserInfo() {
    try {
      const res = await authService.getUserInfoWithToken()
      console.log('[Login] getUserInfo response:', res)
      
      if (res.code === 200 && res.data) {
        const app = getApp()
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
          school: data.school,
          city: data.city,
          campus_id: data.campus_id
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
          school: s.school,
          city: s.city,
          campus_id: s.campus_id
        }))
        
        // 所有学生
        const allStudents = [currentStudent, ...otherStudents]
        
        app.globalData.isLoggedIn = true
        app.globalData.students = allStudents
        app.globalData.currentStudentId = currentStudent.id
        app.globalData.parent = { phone: '' }
        
        app.saveLoginState()
      } else {
        // API 返回错误，提示用户重新登录
        console.error('[Login] getUserInfo failed:', res)
        wx.showToast({ 
          title: res.msg || res.message || '获取用户信息失败', 
          icon: 'none',
          duration: 2000
        })
      }
    } catch (err) {
      console.error('[Login] fetchUserInfo error:', err)
      wx.showToast({ title: '网络错误，请重试', icon: 'none' })
    }
  }
})
