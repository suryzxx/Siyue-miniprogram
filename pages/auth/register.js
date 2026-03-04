Page({
  data: {
    navBarHeight: 0,
    step: 1,
    parent: {
      phone: '',
      code: '',
    },
    student: {
      studentName: '',
      gender: '女',
      grade: '',
      englishName: '',
      school: '',
      city: '',
      customerSource: '',
    },
    sendText: '发送验证码',
    countdown: 0,
    canSend: true,
    loading: false,
    gradeOptions: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '初一', '初二', '初三'],
    gradeIndex: 0,
    sourceOptions: ['小红书', '朋友推荐', '抖音', '微信公众号', '线下活动', '其他'],
    sourceIndex: 0,
  },

  onLoad(options) {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }

    const updates = {
      navBarHeight: app.globalData.navBarHeight,
      'student.grade': this.data.gradeOptions[0],
      'student.customerSource': this.data.sourceOptions[0],
    }

    if (options.phone) {
      updates['parent.phone'] = options.phone
      updates.step = 2
    }

    this.setData(updates)
  },

  onParentPhone(e) {
    this.setData({ 'parent.phone': e.detail.value })
  },

  onParentCode(e) {
    this.setData({ 'parent.code': e.detail.value })
  },

  onSendCode() {
    const { phone } = this.data.parent
    const { canSend } = this.data
    if (!canSend) return

    if (!phone || phone.length !== 11) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }

    wx.showToast({ title: '验证码已发送', icon: 'success' })
    this.setData({ canSend: false, countdown: 60, sendText: '60s' })
    this.startCountdown()
  },

  startCountdown() {
    this.timer = setInterval(() => {
      const { countdown } = this.data
      if (countdown <= 1) {
        clearInterval(this.timer)
        this.setData({ canSend: true, countdown: 0, sendText: '发送验证码' })
      } else {
        this.setData({ countdown: countdown - 1, sendText: `${countdown - 1}s` })
      }
    }, 1000)
  },

  onVerifyCode() {
    const { phone, code } = this.data.parent

    if (!phone || phone.length !== 11) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }

    if (!code) {
      wx.showToast({ title: '请输入验证码', icon: 'none' })
      return
    }

    if (code !== '123456') {
      wx.showToast({ title: '验证码错误', icon: 'none' })
      return
    }

    this.setData({ step: 2 })
  },

  onStudentName(e) {
    this.setData({ 'student.studentName': e.detail.value })
  },

  onEnglishName(e) {
    this.setData({ 'student.englishName': e.detail.value })
  },

  onSchool(e) {
    this.setData({ 'student.school': e.detail.value })
  },

  onCity(e) {
    this.setData({ 'student.city': e.detail.value })
  },

  onGenderSelect(e) {
    this.setData({ 'student.gender': e.currentTarget.dataset.value })
  },

  onGradeChange(e) {
    const index = e.detail.value
    this.setData({
      gradeIndex: index,
      'student.grade': this.data.gradeOptions[index],
    })
  },

  onSourceChange(e) {
    const index = e.detail.value
    this.setData({
      sourceIndex: index,
      'student.customerSource': this.data.sourceOptions[index],
    })
  },

  async onRegister() {
    const { student, parent, loading } = this.data

    if (loading) return

    if (!student.studentName || !student.studentName.trim()) {
      wx.showToast({ title: '请输入学生姓名', icon: 'none' })
      return
    }

    if (!student.grade) {
      wx.showToast({ title: '请选择年级', icon: 'none' })
      return
    }

    this.setData({ loading: true })
    wx.showLoading({ title: '注册中...' })

    const app = getApp()
    const registerData = {
      studentName: student.studentName.trim(),
      phone: parent.phone,
      grade: student.grade,
      gender: student.gender,
      englishName: student.englishName || '',
      school: student.school || '',
      city: student.city || '',
      customerSource: student.customerSource || '',
    }

    const result = await app.register(registerData)

    wx.hideLoading()
    this.setData({ loading: false })

    if (result.success) {
      wx.showToast({ title: '注册成功', icon: 'success' })
      setTimeout(() => {
        wx.switchTab({ url: '/pages/my/my' })
      }, 1000)
    } else {
      wx.showToast({ title: result.message || '注册失败', icon: 'none' })
    }
  },

  onUnload() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
})
