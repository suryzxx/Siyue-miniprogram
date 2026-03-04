const { studentService } = require('../../services/student')
const { commonService } = require('../../services/common')

Page({
  data: {
    navBarHeight: 0,
    fromLogin: false,
    loading: false,
    student: {
      name: '',
      grade: '',
      gender: '',
      englishName: '',
      school: '',
      cityCode: '',
      customerSource: ''
    },
    grades: [],
    gradeIndex: -1,
    cities: [],
    cityIndex: -1,
    genderOptions: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' }
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
    this.setData({ 'student.gender': value })
  },

  onEnglishNameInput(e) {
    this.setData({ 'student.englishName': e.detail.value })
  },

  onSchoolInput(e) {
    this.setData({ 'student.school': e.detail.value })
  },

  onCityChange(e) {
    const index = e.detail.value
    const city = this.data.cities[index]
    this.setData({
      cityIndex: index,
      'student.cityCode': city?.code || ''
    })
  },

  onSourceChange(e) {
    const index = e.detail.value
    const source = this.data.sourceOptions[index]
    this.setData({
      sourceIndex: index,
      'student.customerSource': source?.value || ''
    })
  },

  async onSubmit() {
    const { student, loading, fromLogin } = this.data

    if (loading) return

    if (!student.name || !student.name.trim()) {
      wx.showToast({ title: '请输入学生姓名', icon: 'none' })
      return
    }

    if (!student.grade) {
      wx.showToast({ title: '请选择在读年级', icon: 'none' })
      return
    }

    this.setData({ loading: true })
    wx.showLoading({ title: '提交中...' })

    try {
      const res = await studentService.create({
        name: student.name.trim(),
        grade: student.grade,
        gender: student.gender || undefined,
        englishName: student.englishName || undefined,
        school: student.school || undefined,
        cityCode: student.cityCode || undefined,
        customerSource: student.customerSource || undefined
      })

      wx.hideLoading()
      this.setData({ loading: false })

      if (res.code === 200 && res.data) {
        const app = getApp()
        app.globalData.students.push(res.data)
        if (!app.globalData.currentStudentId) {
          app.globalData.currentStudentId = res.data.id
        }
        app.saveLoginState()

        wx.showToast({ title: '添加成功', icon: 'success' })
        setTimeout(() => {
          if (fromLogin) {
            wx.switchTab({ url: '/pages/my/my' })
          } else {
            wx.navigateBack()
          }
        }, 1000)
      } else {
        wx.showToast({ title: res.message || '添加失败', icon: 'none' })
      }
    } catch (err) {
      wx.hideLoading()
      this.setData({ loading: false })
      wx.showToast({ title: err.message || '网络错误', icon: 'none' })
    }
  }
})
