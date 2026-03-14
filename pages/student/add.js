const { authService } = require('../../services/auth')
const { commonService } = require('../../services/common')
const { setToken } = require('../../utils/request')

Page({
  data: {
    navBarHeight: 0,
    fromLogin: false,
    loading: false,
    student: {
      name: '',
      grade: '',
      sex: 0,  // 0=未知, 1=男, 2=女
      en_name: '',
      birthday: '',
      school: '',
      city: '',
      discover_channel: 0
    },
    grades: [],
    gradeIndex: -1,
    cities: [],
    cityIndex: -1,
    genderOptions: [
      { label: '男', value: 1 },
      { label: '女', value: 2 }
    ],
    sourceOptions: [
      { label: '朋友/熟人推荐', value: 1 },
      { label: '小红书', value: 2 },
      { label: '思悦社群', value: 3 },
      { label: '公众号/视频号', value: 4 }
    ],
    sourceIndex: -1
  },

  onLoad(options) {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    this.setData({
      navBarHeight: app.globalData.navBarHeight,
      fromLogin: options.from === 'login'
    })
    this.loadGrades()
    this.loadCities()
  },

  async loadGrades() {
    try {
      const res = await commonService.getGrades()
      if (res.code === 200 && res.data) {
        this.setData({ grades: res.data })
      }
    } catch (e) {
      console.error('加载年级列表失败', e)
    }
  },

  async loadCities() {
    try {
      const res = await commonService.getCities()
      if (res.code === 200 && res.data) {
        this.setData({ cities: res.data })
      }
    } catch (e) {
      console.error('加载城市列表失败', e)
    }
  },

  onNameInput(e) {
    this.setData({ 'student.name': e.detail.value })
  },

  onGradeChange(e) {
    const index = e.detail.value
    const grade = this.data.grades[index]
    this.setData({
      gradeIndex: index,
      'student.grade': grade?.code || ''
    })
  },

  onGenderSelect(e) {
    const { value } = e.currentTarget.dataset
    this.setData({ 'student.sex': value })
  },

  onEnglishNameInput(e) {
    this.setData({ 'student.en_name': e.detail.value })
  },

  onBirthdayChange(e) {
    this.setData({ 'student.birthday': e.detail.value })
  },

  onSchoolInput(e) {
    this.setData({ 'student.school': e.detail.value })
  },

  onCityChange(e) {
    const index = e.detail.value
    const city = this.data.cities[index]
    this.setData({
      cityIndex: index,
      'student.city': city?.code || city?.name || ''
    })
  },

  onSourceChange(e) {
    const index = e.detail.value
    const source = this.data.sourceOptions[index]
    this.setData({
      sourceIndex: index,
      'student.discover_channel': source?.value || 0
    })
  },

  async onSubmit() {
    const { student, loading, fromLogin } = this.data

    if (loading) return

    // 必填验证
    if (!student.name || !student.name.trim()) {
      wx.showToast({ title: '请输入学生姓名', icon: 'none' })
      return
    }

    if (!student.grade) {
      wx.showToast({ title: '请选择在读年级', icon: 'none' })
      return
    }

    if (!student.birthday) {
      wx.showToast({ title: '请选择出生日期', icon: 'none' })
      return
    }

    if (!student.en_name || !student.en_name.trim()) {
      wx.showToast({ title: '请输入学生英文名', icon: 'none' })
      return
    }

    if (!student.school || !student.school.trim()) {
      wx.showToast({ title: '请输入学生在读学校', icon: 'none' })
      return
    }

    if (!student.city) {
      wx.showToast({ title: '请选择学生就读城市', icon: 'none' })
      return
    }

    if (!student.discover_channel) {
      wx.showToast({ title: '请选择您了解我们的渠道', icon: 'none' })
      return
    }

    this.setData({ loading: true })
    wx.showLoading({ title: '提交中...' })

    try {
      const { fromLogin } = this.data
      let res
      
      // 构建学生信息参数
      const studentInfo = {
        name: student.name.trim(),
        en_name: student.en_name || '',
        sex: student.sex || 0,
        birthday: student.birthday,
        grade: student.grade,
        school: student.school.trim(),
        city: student.city || '',
        discover_channel: student.discover_channel,
        regist_channel: 2
      }

      if (fromLogin) {
        // 新用户首次注册：使用 temp_token
        const tempToken = wx.getStorageSync('token') || ''
        const requestData = {
          ...studentInfo,
          temp_token: tempToken
        }
        console.log('[Student Add] New user registration, Request data:', requestData)
        res = await authService.createStudentWithTempToken(requestData)
      } else {
        // 老用户新增学生：使用正式 token
        console.log('[Student Add] Existing user adding student, Request data:', studentInfo)
        res = await authService.addStudent(studentInfo)
      }
      
      console.log('[Student Add] Response:', res)

      wx.hideLoading()
      this.setData({ loading: false })

      if (res.code === 200) {
        // 保存新 token（仅新用户注册时返回）
        if (res.data && res.data.token) {
          setToken(res.data.token)
        }

        // 更新全局状态
        const app = getApp()
        app.globalData.isLoggedIn = true
        
        // 获取用户信息更新学生列表
        await this.fetchAndUpdateStudents()

        wx.showToast({ title: '创建成功', icon: 'success' })
        setTimeout(() => {
          if (fromLogin) {
            wx.switchTab({ url: '/pages/my/my' })
          } else {
            wx.navigateBack()
          }
        }, 1000)
      } else {
        wx.showToast({ title: res.msg || res.message || '创建失败', icon: 'none' })
      }
    } catch (err) {
      wx.hideLoading()
      this.setData({ loading: false })
      console.error('[Student Add] Error:', err)
      wx.showToast({ title: err.message || err.msg || '网络错误', icon: 'none' })
    }
  },

  // 获取并更新学生列表
  async fetchAndUpdateStudents() {
    try {
      const res = await authService.getUserInfoWithToken()
      console.log('[Student Add] getUserInfo response:', res)
      
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
          school: s.school,
          city: s.city
        }))
        
        // 所有学生
        const allStudents = [currentStudent, ...otherStudents]
        
        app.globalData.students = allStudents
        app.globalData.currentStudentId = currentStudent.id
        
        app.saveLoginState()
      }
    } catch (err) {
      console.error('[Student Add] fetchAndUpdateStudents error:', err)
    }
  }
})
