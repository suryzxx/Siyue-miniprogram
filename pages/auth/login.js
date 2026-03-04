const { authService } = require('../../services/auth')

Page({
  data: {
    navBarHeight: 0,
    phone: '',
    code: '',
    agreed: false,
    loading: false,
    sendText: '获取验证码',
    countdown: 0,
    canSend: true,
    timer: null
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

  onShow() {
    // 清空表单
    this.setData({
      phone: '',
      code: ''
    })
  },

  onUnload() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
    }
  },

  // 关闭登录页 - 返回个人中心
  onCloseTap() {
    wx.switchTab({
      url: '/pages/my/my'
    })
  },

  // 手机号输入
  onPhoneInput(e) {
    this.setData({ phone: e.detail.value })
  },

  // 验证码输入
  onCodeInput(e) {
    this.setData({ code: e.detail.value })
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

  // 发送验证码
  async onSendCode() {
    const { phone, canSend } = this.data
    if (!canSend) return

    if (!phone || phone.length !== 11) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }

    try {
      const res = await authService.sendCode(phone)
      if (res.code === 200) {
        wx.showToast({ title: '验证码已发送', icon: 'success' })
        this.startCountdown()
      } else {
        wx.showToast({ title: res.message || '发送失败', icon: 'none' })
      }
    } catch (err) {
      wx.showToast({ title: '发送失败', icon: 'none' })
    }
  },

  // 倒计时
  startCountdown() {
    this.setData({ canSend: false, countdown: 60, sendText: '60s后重发' })
    
    const timer = setInterval(() => {
      const { countdown } = this.data
      if (countdown <= 1) {
        clearInterval(timer)
        this.setData({ canSend: true, countdown: 0, sendText: '获取验证码' })
      } else {
        this.setData({ countdown: countdown - 1, sendText: `${countdown - 1}s后重发` })
      }
    }, 1000)
    
    this.setData({ timer })
  },

  // 登录
  async onLogin() {
    const { phone, code, agreed, loading } = this.data

    if (!agreed) {
      wx.showToast({ title: '请先同意用户协议和隐私协议', icon: 'none' })
      return
    }

    if (loading) return

    if (!phone || phone.length !== 11) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }

    if (!code || code.length !== 6) {
      wx.showToast({ title: '请输入6位验证码', icon: 'none' })
      return
    }

    this.setData({ loading: true })
    wx.showLoading({ title: '登录中...' })

    try {
      // 先验证验证码
      const verifyRes = await authService.verifyCode(phone, code)
      if (verifyRes.code !== 200) {
        wx.hideLoading()
        this.setData({ loading: false })
        wx.showToast({ title: verifyRes.message || '验证码错误', icon: 'none' })
        return
      }

      // 登录
      const loginRes = await authService.login(phone)
      wx.hideLoading()

      if (loginRes.code === 200 && loginRes.data) {
        const app = getApp()
        
        // 保存登录状态
        app.globalData.isLoggedIn = true
        app.globalData.parent = loginRes.data.user
        app.globalData.students = loginRes.data.students || []
        
        // 如果有学生，设置当前学生
        if (loginRes.data.students && loginRes.data.students.length > 0) {
          app.globalData.currentStudentId = loginRes.data.students[0].id
        }
        
        app.saveLoginState()

        wx.showToast({ title: '登录成功', icon: 'success' })

        // 延迟跳转
        setTimeout(() => {
          if (loginRes.data.hasStudents) {
            // 有学生 -> 个人中心
            wx.switchTab({ url: '/pages/my/my' })
          } else {
            // 无学生 -> 添加学生页
            wx.redirectTo({ url: '/pages/student/add?from=login' })
          }
        }, 1000)
      } else {
        this.setData({ loading: false })
        wx.showToast({ title: loginRes.message || '登录失败', icon: 'none' })
      }
    } catch (err) {
      wx.hideLoading()
      this.setData({ loading: false })
      wx.showToast({ title: err.message || '网络错误', icon: 'none' })
    }
  }
})
