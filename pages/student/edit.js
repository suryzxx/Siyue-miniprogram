const { studentService } = require('../../services/student')
const { commonService } = require('../../services/common')

const app = getApp()

Page({
  data: {
    navBarHeight: 0,
    loading: false,
    studentId: '',
    student: {
      name: '',
      en_name: '',
      grade: '',
      sex: 0,
      school: '',
      campus_id: '',
      birthday: ''
    },
    grades: [],
    gradeIndex: -1,
    campuses: [],
    campusIndex: -1,
    gradePickerVisible: false,
    gradePickerValue: [],
    gradePickerOptions: [],
    genderPickerVisible: false,
    genderPickerValue: [],
    genderPickerOptions: [
      { label: '男', value: '1' },
      { label: '女', value: '2' }
    ],
    campusPickerVisible: false,
    campusPickerValue: [],
    campusPickerOptions: [],
    birthdayPickerVisible: false
  },

  async onLoad(options) {
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    const studentId = options.id ? parseInt(options.id, 10) : 0
    this.setData({
      navBarHeight: app.globalData.navBarHeight,
      studentId: studentId
    })
    await Promise.all([
      this.loadGrades(),
      this.loadCampuses()
    ])
    this.loadStudent(studentId)
  },

  async loadGrades() {
    try {
      const res = await commonService.getGrades()
      if (res.code === 200 && res.data) {
        const gradePickerOptions = res.data.map(item => ({
          label: item.name,
          value: item.code
        }))
        this.setData({ 
          grades: res.data,
          gradePickerOptions 
        })
      }
    } catch (e) {
      console.error('加载年级列表失败', e)
    }
  },

  async loadCampuses() {
    try {
      const res = await commonService.getCampusList()
      if (res.code === 200 && res.data) {
        const campusPickerOptions = res.data.map(item => ({
          label: item.name,
          value: item.id
        }))
        this.setData({ 
          campuses: res.data,
          campusPickerOptions 
        })
      }
    } catch (e) {
      console.error('加载校区列表失败', e)
    }
  },

  loadStudent(id) {
    const students = app.globalData.students || []
    const current = students.find(s => String(s.id) === String(id))
    if (current) {
      const gradeIndex = this.data.grades.findIndex(g => g.code === current.grade)
      const campusIndex = this.data.campuses.findIndex(c => String(c.id) === String(current.campus_id))
      
      this.setData({
        student: {
          name: current.name || '',
          en_name: current.en_name || '',
          grade: current.grade || '',
          sex: current.sex || 0,
          school: current.school || '',
          campus_id: current.campus_id || '',
          birthday: current.birthday || ''
        },
        gradeIndex,
        campusIndex
      })
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

  onGradeCellTap() {
    this.setData({ gradePickerVisible: true })
  },

  onGenderCellTap() {
    this.setData({ genderPickerVisible: true })
  },

  onCampusCellTap() {
    this.setData({ campusPickerVisible: true })
  },

  onBirthdayCellTap() {
    this.setData({ birthdayPickerVisible: true })
  },

  onPickerConfirm(e) {
    const { value } = e.detail
    const key = e.currentTarget.dataset.key
    
    if (key === 'grade') {
      const gradeCode = value[0]
      const gradeIndex = this.data.grades.findIndex(g => g.code === gradeCode)
      this.setData({
        gradePickerVisible: false,
        gradePickerValue: value,
        gradeIndex,
 'student.grade': gradeCode
      })
    } else if (key === 'gender') {
      const genderValue = parseInt(value[0], 10)
      this.setData({
        genderPickerVisible: false,
        genderPickerValue: value,
        'student.sex': genderValue
      })
    } else if (key === 'campus') {
      const campusId = value[0]
      const campusIndex = this.data.campuses.findIndex(c => c.id === campusId)
      this.setData({
        campusPickerVisible: false,
        campusPickerValue: value,
        campusIndex,
        'student.campus_id': campusId
      })
    }
  },

  onPickerCancel(e) {
    const key = e.currentTarget.dataset.key
    if (key === 'grade') {
      this.setData({ gradePickerVisible: false })
    } else if (key === 'gender') {
      this.setData({ genderPickerVisible: false })
    } else if (key === 'campus') {
      this.setData({ campusPickerVisible: false })
    }
  },

  onBirthdayConfirm(e) {
    const { value } = e.detail
    this.setData({
      birthdayPickerVisible: false,
      'student.birthday': value
    })
  },

  onBirthdayCancel() {
    this.setData({ birthdayPickerVisible: false })
  },

  async onSubmit() {
    const { student, studentId, loading } = this.data

    if (loading) return

    if (!student.name || !student.name.trim()) {
      wx.showToast({ title: '请输入学生姓名', icon: 'none' })
      return
    }

    this.setData({ loading: true })
    wx.showLoading({ title: '保存中...' })

    try {
      const res = await studentService.update(studentId, {
        name: student.name.trim(),
        en_name: student.en_name || '',
        sex: student.sex || 0,
        birthday: student.birthday || '',
        grade: student.grade,
        school: student.school || '',
        campus_id: student.campus_id || ''
      })

      wx.hideLoading()
      this.setData({ loading: false })

      if (res.code === 200) {
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
            campus_id: student.campus_id
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
