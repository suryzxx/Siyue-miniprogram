const { classService } = require('../../services/class')
const { waitlistService } = require('../../services/waitlist')

Page({
  data: {
    navBarHeight: 0,
    loading: true,
    courseId: '',
    studentId: '',
    course: {},
    student: {},
  },

  onLoad(options) {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    this.setData({
      navBarHeight: app.globalData.navBarHeight,
      courseId: options.courseId || '',
      studentId: options.studentId || '',
    })
    this.loadData(options)
  },

  async loadData(options) {
    this.setData({ loading: true })
    const app = getApp()
    
    // 获取学生信息
    const studentId = options.studentId || app.globalData.currentStudentId
    const student = app.globalData.students.find(s => s.id === studentId) || app.globalData.students[0] || {}
    
    // 获取班级信息
    let course = {}
    const courseId = options.courseId
    
    // 先从缓存获取
    course = app.globalData.courses?.find(c => c.id === courseId) || {}
    
    // 如果缓存没有，尝试从API获取
    if (!course.id && courseId) {
      try {
        const res = await classService.getDetail(courseId)
        if (res.code === 200 && res.data) {
          course = this.formatCourse(res.data)
        }
      } catch (e) {
        console.log('获取班级详情失败', e)
      }
    }

    // 格式化课程数据
    if (course.id) {
      course = this.formatCourse(course)
    }

    this.setData({
      course,
      student,
      loading: false,
    })
  },

  formatCourse(data) {
    return {
      ...data,
      id: data.id,
      title: data.name || data.title,
      time: data.schedule || data.time,
      location: data.location || (data.campus ? `${data.campus.name}-${data.campus.address || ''}` : ''),
      price: typeof data.price === 'string' ? data.price : `¥${(data.price || 0).toFixed(2)}`,
      sessions: data.sessions || 15,
    }
  },

  async onConfirm() {
    const { course, student } = this.data
    
    if (!course.id || !student.id) {
      wx.showToast({ title: '信息不完整', icon: 'none' })
      return
    }

    wx.showLoading({ title: '提交中...' })

    try {
      // 调用候补API
      let waitlistId = ''
      try {
        const res = await classService.joinWaitlist(course.id, student.id)
        if (res.code === 200 && res.data) {
          waitlistId = res.data.id || res.data.waitlistId
        }
      } catch (e) {
        console.log('候补API失败，使用模拟数据', e)
        waitlistId = 'wait_' + Date.now()
      }

      // 添加到全局候补列表
      const app = getApp()
      app.addWaitlist({
        id: waitlistId,
        classId: course.id,
        className: course.title || course.name,
        productType: course.productType,
        productTypeName: course.productTypeName,
        level: course.level,
        schedule: course.time || course.schedule,
        campus: course.campus,
        studentName: student.name,
        status: 'pending',
        statusLabel: '排队中',
        position: Math.floor(Math.random() * 5) + 1, // 模拟排队位置
        createTime: new Date().toLocaleString(),
      })

      wx.hideLoading()
      
      // 跳转到候补状态页
      wx.redirectTo({
        url: `/pages/waitlist/status?id=${waitlistId}`,
      })
    } catch (e) {
      wx.hideLoading()
      wx.showToast({ title: '提交失败', icon: 'none' })
    }
  },
})
