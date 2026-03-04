const { orderService } = require('../../services/order')
const { classService } = require('../../services/class')

Page({
  data: {
    navBarHeight: 0,
    loading: true,
    courseId: '',
    studentId: '',
    waitlistId: '',
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
      waitlistId: options.waitlistId || '',
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
      priceNum: typeof data.price === 'number' ? data.price : parseFloat(data.price) || 0,
      sessions: data.sessions || 15,
    }
  },

  async onPay() {
    const { course, student, waitlistId } = this.data
    
    if (!course.id || !student.id) {
      wx.showToast({ title: '信息不完整', icon: 'none' })
      return
    }

    wx.showLoading({ title: '创建订单中...' })

    try {
      // 创建订单
      const orderData = {
        classId: course.id,
        studentId: student.id,
        waitlistId: waitlistId || undefined,
      }
      
      let orderId = ''
      try {
        const res = await orderService.create(orderData)
        if (res.code === 200 && res.data) {
          orderId = res.data.id || res.data.orderId
        }
      } catch (e) {
        console.log('创建订单API失败，使用模拟订单', e)
        orderId = 'order_' + Date.now()
      }

      wx.hideLoading()

      // 模拟微信支付
      this.simulateWechatPay(orderId)
    } catch (e) {
      wx.hideLoading()
      wx.showToast({ title: '创建订单失败', icon: 'none' })
    }
  },

  simulateWechatPay(orderId) {
    const { course, student } = this.data
    
    wx.showModal({
      title: '微信支付',
      content: `确认支付 ${course.price}？`,
      confirmText: '确认支付',
      cancelText: '取消',
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '支付中...' })
          
          // 模拟支付延迟
          setTimeout(async () => {
            try {
              // 调用支付API
              await orderService.pay(orderId)
            } catch (e) {
              console.log('支付API调用失败，模拟成功', e)
            }

            // 添加到我的班级
            const app = getApp()
            app.addMyClass({
              id: 'enroll_' + Date.now(),
              classId: course.id,
              className: course.title || course.name,
              productType: course.productType,
              productTypeName: course.productTypeName,
              level: course.level,
              schedule: course.time || course.schedule,
              campus: course.campus,
              teacher: course.teacher || course.mainTeacher,
              studentName: student.name,
              status: 'confirmed',
              statusLabel: '已报名',
              enrollTime: new Date().toLocaleString(),
              totalSessions: course.sessions || 15,
              completedSessions: 0,
            })

            wx.hideLoading()
            
            // 跳转到支付成功页
            wx.redirectTo({
              url: `/pages/order/pay-success?orderId=${orderId}`,
            })
          }, 1500)
        }
      },
    })
  },
})
