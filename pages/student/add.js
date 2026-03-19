const { authService } = require('../../services/auth')
const { commonService } = require('../../services/common')
const { setToken } = require('../../utils/request')

const app = getApp()

Page({
  data: {
    navBarHeight: 0,
    fromLogin: false,
    loading: false,
    student: {
      name: '',
      grade: '',
      sex: 0,
      en_name: '',
      birthday: '',
      school: '',
      campus_id: '',
      discover_channel: 0
    },
    grades: [],
    gradeIndex: -1,
    campuses: [],
    campusIndex: -1,
    genderPickerOptions: [
      { label: '男', value: '1' },
      { label: '女', value: '2' }
    ],
    genderPickerVisible: false,
    genderPickerValue: [],
    sourceOptions: [
      { label: '朋友/熟人推荐', value: 1 },
      { label: '小红书', value: 2 },
      { label: '思悦社群', value: 3 },
      { label: '公众号/视频号', value: 4 }
    ],
    sourceIndex: -1,
    gradePickerVisible: false,
    gradePickerValue: [],
    gradePickerOptions: [],
    campusPickerVisible: false,
    campusPickerValue: [],
    campusPickerOptions: [],
    sourcePickerVisible: false,
    sourcePickerValue: [],
    sourcePickerOptions: [],
    birthdayPickerVisible: false
  },

  onLoad(options) {
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    this.setData({
      navBarHeight: app.globalData.navBarHeight,
      fromLogin: options.from === 'login'
    })
    this.loadGrades()
    this.loadCampuses()
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

  onSourceCellTap() {
    const sourcePickerOptions = this.data.sourceOptions.map(item => ({
      label: item.label,
      value: String(item.value)
    }))
    this.setData({ 
      sourcePickerVisible: true,
      sourcePickerOptions
    })
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
      const sexValue = parseInt(value[0], 10)
      this.setData({
        genderPickerVisible: false,
        genderPickerValue: value,
        'student.sex': sexValue
      })
    } else if (key === 'campus') {
      const campusId = value[0]
      const campusIndex = this.data.campuses.findIndex(c => c.id === campusId)
      this.setData({
        campusPickerVisible: false,
        campusPickerValue: value,
        campusIndex: campusIndex >= 0 ? campusIndex : -1,
        'student.campus_id': campusId
      })
    } else if (key === 'source') {
      const sourceValue = parseInt(value[0], 10)
      const sourceIndex = this.data.sourceOptions.findIndex(s => s.value === sourceValue)
      this.setData({
        sourcePickerVisible: false,
        sourcePickerValue: value,
        sourceIndex: sourceIndex >= 0 ? sourceIndex : -1,
        'student.discover_channel': sourceValue
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
    } else if (key === 'source') {
      this.setData({ sourcePickerVisible: false })
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
    if (!student.campus_id) {
      wx.showToast({ title: '请选择校区', icon: 'none' })
      return
    }
    if (!student.discover_channel) {
      wx.showToast({ title: '请选择您了解我们的渠道', icon: 'none' })
      return
    }
    this.setData({ loading: true })
    wx.showLoading({ title: '提交中...' })

    let res
    try {
      const studentInfo = {
        name: student.name.trim(),
        en_name: student.en_name || '',
        sex: student.sex || 0,
        birthday: student.birthday,
        grade: student.grade,
        school: student.school.trim(),
        campus_id: student.campus_id || '',
        discover_channel: student.discover_channel,
        regist_channel: 2
      }
      if (fromLogin) {
        const tempToken = wx.getStorageSync('token') || ''
        const requestData = {
          ...studentInfo,
          temp_token: tempToken
        }
        console.log('[Student Add] New user registration, Request data:', requestData)
        res = await authService.createStudentWithTempToken(requestData)
      } else {
        console.log('[Student Add] Existing user adding student, Request data:', studentInfo)
        res = await authService.addStudent(studentInfo)
      }
      
      console.log('[Student Add] Response:', res)

      wx.hideLoading()
      this.setData({ loading: false })
      if (res.code === 200) {
        if (res.data && res.data.token) {
          setToken(res.data.token)
        }
        const app = getApp()
        app.globalData.isLoggedIn = true
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

  async fetchAndUpdateStudents() {
    try {
      const res = await authService.getUserInfoWithToken()
      console.log('[Student Add] getUserInfo response:', res)
      if (res.code === 200 && res.data) {
        const app = getApp()
        const data = res.data
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
