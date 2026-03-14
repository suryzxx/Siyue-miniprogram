const { studentService } = require('../../services/student')
const { commonService } = require('../../services/common')

Page({
  data: {
    navBarHeight: 0,
    currentStudent: null,
    students: [],
    maxStudents: 5,
    gradeMap: {}  // 年级映射表
  },
  onLoad() {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    this.setData({
      navBarHeight: app.globalData.navBarHeight,
    })
  },
  async onShow() {
    // 先加载年级映射表，再加载学生数据
    await this.loadGradeMap()
    await this.loadData()
  },
  async loadGradeMap() {
    const gradeMap = await commonService.getGradeMap()
    console.log('[Manage] gradeMap loaded:', gradeMap)
    this.setData({ gradeMap })
  },
  async loadData() {
    await Promise.all([
      this.loadStudents(),
      this.loadCurrentStudentDetail()
    ])
  },
  async loadStudents() {
    const app = getApp()
    try {
      const res = await studentService.getList()
      if (res.code === 200 && res.data) {
        let students = res.data.list || res.data || []
        // 添加 gradeName 字段，保留本地缓存的 grade 值（解决后端返回 others grade 为空的问题）
        const { gradeMap } = this.data
        const cachedStudents = app.globalData.students || []
        students = students.map(s => {
          // 如果 API 返回的 grade 为空，尝试使用本地缓存的值
          const cached = cachedStudents.find(c => String(c.id) === String(s.id))
          const grade = s.grade || (cached && cached.grade) || ''
          console.log(`[Manage] Student ${s.name}, API grade: ${s.grade}, cached grade: ${cached?.grade}, final grade: ${grade}`)
          return {
            ...s,
            grade,
            gradeName: gradeMap[grade] || grade || '未设置'
          }
        })
        app.globalData.students = students
        app.saveLoginState()
        this.setData({ students })
      } else {
        console.error('获取学生列表失败:', res)
        if (res.code === 600) {
          wx.showToast({ title: '用户数据不存在，请重新登录', icon: 'none', duration: 2000 })
        } else {
          wx.showToast({ title: res.msg || res.message || '获取学生列表失败', icon: 'none' })
        }
        this.setData({ students: [] })
      }
    } catch (e) {
      console.error('加载学生列表失败', e)
      this.setData({ students: app.globalData.students || [] })
    }
  },
  async loadCurrentStudentDetail() {
    const app = getApp()
    const currentStudentId = app.globalData.currentStudentId
    if (!currentStudentId) {
      this.setData({ currentStudent: null })
      return
    }
    try {
      const res = await studentService.getDetail(currentStudentId)
      const { gradeMap } = this.data
      if (res.code === 200 && res.data) {
        const student = {
          ...res.data,
          gradeName: gradeMap[res.data.grade] || res.data.grade || '未设置'
        }
        this.setData({ currentStudent: student })
      } else {
        const found = app.globalData.students.find(s => s.id === currentStudentId)
        if (found) {
          this.setData({ currentStudent: { ...found, gradeName: gradeMap[found.grade] || found.grade || '未设置' } })
        } else {
          this.setData({ currentStudent: null })
        }
      }
    } catch (e) {
      console.error('加载学生详情失败', e)
      const found = app.globalData.students.find(s => s.id === currentStudentId)
      const { gradeMap } = this.data
      if (found) {
        this.setData({ currentStudent: { ...found, gradeName: gradeMap[found.grade] || found.grade || '未设置' } })
      } else {
        this.setData({ currentStudent: null })
      }
    }
  },

  async onSwitchStudent(e) {
    const { id } = e.currentTarget.dataset
    const app = getApp()

    if (id === app.globalData.currentStudentId) return

    try {
      const res = await studentService.switchCurrent(id)
      if (res.code === 200) {
        app.globalData.currentStudentId = id
        app.saveLoginState()
        this.loadData()
        wx.showToast({ title: '已切换', icon: 'success' })
      } else {
        wx.showToast({ title: res.message || '切换失败', icon: 'none' })
      }
    } catch (err) {
      wx.showToast({ title: '网络错误', icon: 'none' })
    }
  },
  onEditStudent(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/student/edit?id=${id}` })
  },
  onDeleteStudent(e) {
    const { id, name } = e.currentTarget.dataset
    const app = getApp()
    if (app.globalData.students.length <= 1) {
      wx.showToast({ title: '至少保留一个学生', icon: 'none' })
      return
    }
    wx.showModal({
      title: '确认删除',
      content: `确定要删除学生"${name}"吗？`,
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '删除中...' })
          try {
            const result = await studentService.remove(id)
            wx.hideLoading()
            if (result.code === 200) {
              app.removeStudent(id)
              this.loadStudents()
              wx.showToast({ title: '已删除', icon: 'success' })
            } else {
              wx.showToast({ title: result.message || '删除失败', icon: 'none' })
            }
          } catch (err) {
            wx.hideLoading()
            wx.showToast({ title: '网络错误', icon: 'none' })
          }
        }
      },
    })
  },
  onBookTest(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/student/book-test?studentId=${id}` })
  },
  onAddStudent() {
    const app = getApp()
    if (app.globalData.students.length >= this.data.maxStudents) {
      wx.showToast({ title: `最多添加${this.data.maxStudents}个学生`, icon: 'none' })
      return
    }
    wx.navigateTo({ url: '/pages/student/add' })
  },
})
