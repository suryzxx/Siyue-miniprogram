const { myClassService } = require('../../services/my-class')

Page({
  data: {
    mockData: {
      services: [
        {
          id: 'assessment',
          label: '预约评测',
          icon: '/images/icons/assessment.svg',
        },
        {
          id: 'myOrders',
          label: '我的订单',
          icon: '/images/icons/order.svg',
        },
        {
          id: 'myWaitlists',
          label: '我的候补',
          icon: '/images/icons/waitlist.svg',
        },
        {
          id: 'myClasses',
          label: '我的班级',
          icon: '/images/icons/class.svg',
        },
      ],
    },
    statusBarHeight: 44,
    isLoggedIn: false,
    parent: null,
    currentStudent: null,
    currentClasses: [],
    loadingClasses: false,
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight || 44
    })
  },

  onShow() {
    this.syncUser()
  },

  syncUser() {
    const app = getApp()
    const isLoggedIn = app.globalData.isLoggedIn
    
    if (!isLoggedIn) {
      this.setData({
        isLoggedIn: false,
        currentStudent: null,
        currentClasses: []
      })
      return
    }

    // 已登录：获取当前学生信息
    const currentStudentId = app.globalData.currentStudentId
    const students = app.globalData.students || []
    const currentStudent = students.find(s => s.id === currentStudentId) || students[0] || null

    this.setData({
      isLoggedIn: true,
      currentStudent
    })

    // 加载班级信息
    if (currentStudent) {
      this.loadCurrentClasses(currentStudent.id)
    }
  },

  async loadCurrentClasses(studentId) {
    this.setData({ loadingClasses: true })
    try {
      const res = await myClassService.getCurrentClasses({ studentId })
      if (res.code === 200 && res.data) {
        const classes = res.data.list || []
        // 格式化班级数据用于显示
        const formattedClasses = classes.map(c => ({
          ...c,
          displayName: c.name,
          displayCampus: c.campus?.name || '',
          displayTeacher: c.mainTeacher?.name || '',
          displaySchedule: c.schedule || '',
          progressText: `第${c.currentSession || 0}讲`
        }))
        this.setData({
          currentClasses: formattedClasses,
          loadingClasses: false
        })
      } else {
        this.setData({ loadingClasses: false })
      }
    } catch (e) {
      console.error('加载班级失败', e)
      this.setData({ loadingClasses: false })
    }
  },

  onMyClassesTap() {
    const { isLoggedIn } = this.data
    if (!isLoggedIn) {
      wx.navigateTo({ url: '/pages/auth/login' })
      return
    }
    wx.navigateTo({ url: '/pages/my/classes/classes' })
  },

  onClassScheduleTap() {
    const { isLoggedIn } = this.data
    if (!isLoggedIn) {
      wx.navigateTo({ url: '/pages/auth/login' })
      return
    }
    wx.navigateTo({ url: '/pages/my/classes/attendance' })
  },

  onUserCardTap() {
    const { isLoggedIn } = this.data
    if (!isLoggedIn) {
      wx.navigateTo({ url: '/pages/auth/login' })
    } else {
      wx.navigateTo({ url: '/pages/student/manage' })
    }
  },

  onLoginTap() {
    wx.navigateTo({ url: '/pages/auth/login' })
  },

  onServiceTap(e) {
    if (!this.data.isLoggedIn) {
      wx.navigateTo({ url: '/pages/auth/login' })
      return
    }

    const { id } = e.currentTarget.dataset
    if (id === 'myOrders') {
      wx.navigateTo({ url: '/pages/order/list?tab=all' })
    } else if (id === 'myClasses') {
      wx.navigateTo({ url: '/pages/my/classes/classes' })
    } else if (id === 'myWaitlists') {
      wx.navigateTo({ url: '/pages/my/waitlists/waitlists' })
    } else if (id === 'assessment') {
      wx.navigateTo({ url: '/pages/assessment/list' })
    }
  },

  onSettingsTap() {
    wx.navigateTo({ url: '/pages/my/settings' })
  },
})
