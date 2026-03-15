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

    const currentStudentId = app.globalData.currentStudentId
    const students = app.globalData.students || []
    const currentStudent = students.find(s => s.id === currentStudentId) || students[0] || null

    this.setData({
      isLoggedIn: true,
      currentStudent
    })

    if (currentStudent) {
      this.loadCurrentClasses()
    }
  },

  async loadCurrentClasses() {
    this.setData({ loadingClasses: true })
    try {
      const res = await myClassService.getMyClasses({ page: 1, page_size: 5 })
      if (res.code === 200 && res.data) {
        const list = res.data.list || res.data || []
        if (!Array.isArray(list)) {
          this.setData({ loadingClasses: false })
          return
        }
        const formattedClasses = list.map(c => {
          const timeParts = []
          
          if (c.lesson_time) {
            timeParts.push(c.lesson_time)
          }
          
          if (c.class_days) {
            const weekDayMap = {
              'Mon': '周一', 'Tue': '周二', 'Wed': '周三',
              'Thu': '周四', 'Fri': '周五', 'Sat': '周六', 'Sun': '周日'
            }
            let daysArray = c.class_days
            if (typeof daysArray === 'string') {
              try {
                const parsed = JSON.parse(daysArray)
                if (Array.isArray(parsed)) daysArray = parsed
              } catch (e) {
                daysArray = daysArray.split(',')
              }
            }
            if (Array.isArray(daysArray)) {
              const daysStr = daysArray
                .filter(d => d)
                .map(d => weekDayMap[d.trim ? d.trim() : d] || d)
                .join('、')
              if (daysStr) timeParts.push(daysStr)
            }
          }
          
          return {
            ...c,
            displayName: c.name,
            displayCampus: c.campus_name || '',
            displayTeacher: c.teacher_name || '',
            displaySchedule: timeParts.join(' '),
            progressText: `第${c.current_lesson_num || 1}讲`,
          }
        })
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
    wx.showToast({ title: '开发中', icon: 'none' })
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
      wx.showToast({ title: '开发中', icon: 'none' })
    } else if (id === 'assessment') {
      wx.navigateTo({ url: '/pages/assessment/list' })
    }
  },

  onSettingsTap() {
    wx.navigateTo({ url: '/pages/my/settings' })
  },
})
