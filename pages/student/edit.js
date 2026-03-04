const { studentService } = require('../../services/student')
const { commonService } = require('../../services/common')

Page({
  data: {
    navBarHeight: 0,
    loading: false,
    studentId: '',
    student: {
      name: '',
      englishName: '',
      grade: '',
      gender: '',
      school: '',
      cityCode: '',
      avatar: '',
      assessmentLevel: ''
    },
    grades: [
      { code: 'grade1', name: '小学一年级' },
      { code: 'grade2', name: '小学二年级' },
      { code: 'grade3', name: '小学三年级' },
      { code: 'grade4', name: '小学四年级' },
      { code: 'grade5', name: '小学五年级' },
      { code: 'grade6', name: '小学六年级' },
      { code: 'junior1', name: '初中一年级' },
      { code: 'junior2', name: '初中二年级' },
      { code: 'junior3', name: '初中三年级' }
    ],
    gradeIndex: -1,
    cities: [],
    cityIndex: -1
  },

  onLoad(options) {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    this.setData({
      navBarHeight: app.globalData.navBarHeight,
      studentId: options.id
    })
    this.loadCities()
    this.loadStudent(options.id)
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
    const current = app.globalData.students.find(s => s.id === id)
    if (current) {
      this.setData({
        student: {
          name: current.name || '',
          englishName: current.englishName || '',
          grade: current.grade || '',
          gender: current.gender || '',
          school: current.school || '',
          cityCode: current.cityCode || '',
          avatar: current.avatar || '',
          assessmentLevel: current.assessmentLevel || ''
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
    if (cities.length && student.cityCode) {
      const idx = cities.findIndex(c => c.code === student.cityCode)
      if (idx >= 0) this.setData({ cityIndex: idx })
    }
  },

  onNameInput(e) {
    this.setData({ 'student.name': e.detail.value })
  },

  onEnglishNameInput(e) {
    this.setData({ 'student.englishName': e.detail.value })
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
      'student.cityCode': city?.code || ''
    })
  },

  onGenderSelect(e) {
    const { value } = e.currentTarget.dataset
    this.setData({ 'student.gender': value })
  },

  onChooseAvatar() {
    const that = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success(res) {
        const tempFilePath = res.tempFiles[0].tempFilePath
        // 上传头像
        that.uploadAvatar(tempFilePath)
      }
    })
  },

  uploadAvatar(filePath) {
    const that = this
    wx.showLoading({ title: '上传中...' })
    
    wx.uploadFile({
      url: getApp().globalData.baseUrl + '/api/file/upload',
      filePath: filePath,
      name: 'file',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success(res) {
        wx.hideLoading()
        try {
          const data = JSON.parse(res.data)
          if (data.code === 200 && data.data?.url) {
            that.setData({ 'student.avatar': data.data.url })
            wx.showToast({ title: '上传成功', icon: 'success' })
          } else {
            wx.showToast({ title: data.message || '上传失败', icon: 'none' })
          }
        } catch (e) {
          wx.showToast({ title: '上传失败', icon: 'none' })
        }
      },
      fail(err) {
        wx.hideLoading()
        wx.showToast({ title: '上传失败', icon: 'none' })
      }
    })
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
      const res = await studentService.update(studentId, {
        name: student.name.trim(),
        grade: student.grade,
        gender: student.gender || undefined,
        englishName: student.englishName || undefined,
        school: student.school || undefined,
        cityCode: student.cityCode || undefined,
        avatar: student.avatar || undefined
      })

      wx.hideLoading()
      this.setData({ loading: false })

      if (res.code === 200) {
        const app = getApp()
        const idx = app.globalData.students.findIndex(s => s.id === studentId)
        if (idx >= 0) {
          app.globalData.students[idx] = { ...app.globalData.students[idx], ...student }
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
