const { studentService } = require('../../services/student')
const { commonService } = require('../../services/common')

Page({
  data: {
    navBarHeight: 0,
    loading: false,
    studentId: '',
    student: {
      name: '',
      en_name: '',
      grade: '',
      sex: 0,  // 0=未知, 1=男, 2=女
      school: '',
      city: '',
      birthday: ''
    },
    grades: [],
    gradeIndex: -1,
    cities: [],
    cityIndex: -1
  },

  onLoad(options) {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    // 将 id 转为整数
    const studentId = options.id ? parseInt(options.id, 10) : 0
    this.setData({
      navBarHeight: app.globalData.navBarHeight,
      studentId: studentId
    })
    this.loadGrades()
    this.loadCities()
    this.loadStudent(studentId)
  },

  async loadGrades() {
    try {
      const res = await commonService.getGrades()
      if (res.code === 200 && res.data) {
        this.setData({ grades: res.data })
        this.updateGradeIndex()
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
        this.updateCityIndex()
      }
    } catch (e) {
      console.error('加载城市列表失败', e)
    }
  },

  loadStudent(id) {
    const app = getApp()
    const students = app.globalData.students || []
    const current = students.find(s => String(s.id) === String(id))
    if (current) {
      console.log('[Edit] Loading student data:', current)
      this.setData({
        student: {
          name: current.name || '',
          en_name: current.en_name || '',
          grade: current.grade || '',
          sex: current.sex || 0,
          school: current.school || '',
          city: current.city || '',
          birthday: current.birthday || ''
        }
      })
      this.updateGradeIndex()
      this.updateCityIndex()
    }
  },

  updateGradeIndex() {
    const { grades, student } = this.data
    if (grades.length && student.grade) {
      const idx = grades.findIndex(g => g.code === student.grade)
      if (idx >= 0) this.setData({ gradeIndex: idx })
    }
  },

  updateCityIndex() {
    const { cities, student } = this.data
    if (cities.length && student.city) {
      const idx = cities.findIndex(c => c.code === student.city || c.name === student.city)
      if (idx >= 0) this.setData({ cityIndex: idx })
    }
  },

  onNameInput(e) {
    this.setData({ 'student.name': e.detail.value })
  },

  onEnglishNameInput(e) {
    this.setData({ 'student.en_name': e.detail.value })
  },

  onSchoolInput(e) {
    this.setData({ 'student.school': e.detail.value })
  },

  onGradeChange(e) {
    const index = e.detail.value
    const grade = this.data.grades[index]
    this.setData({
      gradeIndex: index,
      'student.grade': grade?.code || ''
    })
  },

  onCityChange(e) {
    const index = e.detail.value
    const city = this.data.cities[index]
    this.setData({
      cityIndex: index,
      'student.city': city?.code || city?.name || ''
    })
  },

  onGenderSelect(e) {
    const { value } = e.currentTarget.dataset
    // value 是 1 或 2 (数字)
    this.setData({ 'student.sex': Number(value) })
  },

  onBirthdayChange(e) {
    this.setData({ 'student.birthday': e.detail.value })
  },

  async onSave() {
    const { student, studentId, loading } = this.data

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
    wx.showLoading({ title: '保存中...' })

    try {
      // 转换为 API 期望的格式
      const res = await studentService.update(studentId, {
        name: student.name.trim(),
        en_name: student.en_name || '',
        sex: student.sex || 0,
        birthday: student.birthday || '',
        grade: student.grade,
        school: student.school || '',
        city: student.city || ''
      })

      wx.hideLoading()
      this.setData({ loading: false })

      if (res.code === 200) {
        // 更新全局数据
        const app = getApp()
        const idx = app.globalData.students.findIndex(s => String(s.id) === String(studentId))
        if (idx >= 0) {
          app.globalData.students[idx] = {
            ...app.globalData.students[idx],
            name: student.name.trim(),
            en_name: student.en_name,
            sex: student.sex,
            birthday: student.birthday,
            grade: student.grade,
            school: student.school,
            city: student.city
          }
          app.saveLoginState()
        }

        wx.showToast({ title: '保存成功', icon: 'success' })
        setTimeout(() => wx.navigateBack(), 1000)
      } else {
        wx.showToast({ title: res.message || '保存失败', icon: 'none' })
      }
    } catch (err) {
      wx.hideLoading()
      this.setData({ loading: false })
      wx.showToast({ title: err.message || '网络错误', icon: 'none' })
    }
  }
})
