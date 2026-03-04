const { studentService } = require('../../services/student')
Page({
  data: {
    navBarHeight: 0,
    currentStudent: null,
    students: [],
    maxStudents: 5,
    navBarHeight: 0,
    currentStudent: null,
    students: [],
    maxStudents: 5,
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
  onShow() {
    this.loadData()
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
        const students = res.data.list || res.data || []
        app.globalData.students = students
        app.saveLoginState()
        this.setData({ students })
      }
    } catch (e) {
      console.error('加载学生列表失败', e)
      this.setData({ students: app.globalData.students })
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
      if (res.code === 200 && res.data) {
        this.setData({ currentStudent: res.data })
      } else {
        this.setData({ currentStudent: app.globalData.students.find(s => s.id === currentStudentId) || null })
      }
    } catch (e) {
      console.error('加载学生详情失败', e)
      this.setData({ currentStudent: app.globalData.students.find(s => s.id === currentStudentId) || null })
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
