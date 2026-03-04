const { myClassService } = require('../../../services/my-class.js')

Page({
  data: {
    navBarHeight: 0,
    loading: true,
    classId: '',
    schedule: [],
    selectedMonth: '',
    months: [], // 可选月份
    currentWeek: 0, // 当前周次
    weeks: [] // 周次列表
  },

  onLoad(options) {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    
    // 生成最近3个月的选项
    const months = this.generateMonthOptions()
    const currentMonth = this.getCurrentMonth()
    
    this.setData({
      navBarHeight: app.globalData.navBarHeight,
      classId: options.id || '',
      selectedMonth: currentMonth,
      months: months
    })
    
    this.loadSchedule(options.id, currentMonth)
  },

  generateMonthOptions() {
    const options = []
    const today = new Date()
    
    for (let i = 0; i < 3; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const monthStr = `${year}-${month.toString().padStart(2, '0')}`
      const label = `${year}年${month}月`
      
      options.push({
        label: label,
        value: monthStr
      })
    }
    
    return options
  },

  getCurrentMonth() {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    return `${year}-${month.toString().padStart(2, '0')}`
  },

  async loadSchedule(classId, month) {
    const app = getApp()
    const currentStudent = app.getCurrentStudent()
    
    this.setData({ loading: true })
    try {
      const res = await myClassService.getSchedule(classId, { 
        month,
        studentId: currentStudent?.id || app.globalData.currentStudentId
      })
      if (res.code === 200 && res.data) {
        const formattedSchedule = this.formatSchedule(res.data.schedule || [])
        const weeks = this.groupByWeek(formattedSchedule)
        
        this.setData({
          schedule: formattedSchedule,
          weeks: weeks,
          currentWeek: this.getCurrentWeekIndex(weeks),
          loading: false
        })
      } else {
        throw new Error(res.message || '加载失败')
      }
    } catch (e) {
      console.error('加载课表失败:', e)
      // 使用模拟数据
      const mockSchedule = this.getMockSchedule()
      const weeks = this.groupByWeek(mockSchedule)
      
      this.setData({
        schedule: mockSchedule,
        weeks: weeks,
        currentWeek: this.getCurrentWeekIndex(weeks),
        loading: false
      })
    }
  },

  formatSchedule(schedule) {
    return schedule.map(item => ({
      ...item,
      // 格式化日期显示
      dateText: this.formatDate(item.date),
      weekdayText: this.getWeekday(item.date),
      // 时间显示
      timeText: `${item.startTime}-${item.endTime}`,
      // 状态显示
      statusText: this.getStatusText(item.status),
      statusClass: this.getStatusClass(item.status),
      // 周次计算
      weekNumber: this.getWeekNumber(item.date)
    }))
  },

  formatDate(dateStr) {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}月${date.getDate()}日`
  },

  getWeekday(dateStr) {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const weekdays = ['日', '一', '二', '三', '四', '五', '六']
    return `周${weekdays[date.getDay()]}`
  },

  getWeekNumber(dateStr) {
    if (!dateStr) return 0
    const date = new Date(dateStr)
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    const pastDays = Math.floor((date - firstDay) / (24 * 60 * 60 * 1000))
    return Math.floor(pastDays / 7) + 1
  },

  getStatusText(status) {
    const statusMap = {
      'completed': '已完成',
      'upcoming': '即将到来',
      'cancelled': '已取消'
    }
    return statusMap[status] || status
  },

  getStatusClass(status) {
    const classMap = {
      'completed': 'completed',
      'upcoming': 'upcoming',
      'cancelled': 'cancelled'
    }
    return classMap[status] || ''
  },

  groupByWeek(schedule) {
    const weeks = []
    schedule.forEach(item => {
      const weekNum = item.weekNumber || 1
      if (!weeks[weekNum - 1]) {
        weeks[weekNum - 1] = {
          weekNumber: weekNum,
          label: `第${weekNum}周`,
          classes: []
        }
      }
      weeks[weekNum - 1].classes.push(item)
    })
    return weeks.filter(week => week && week.classes.length > 0)
  },

  getCurrentWeekIndex(weeks) {
    const today = new Date()
    const currentDateStr = today.toISOString().split('T')[0]
    
    for (let i = 0; i < weeks.length; i++) {
      const week = weeks[i]
      const hasUpcoming = week.classes.some(cls => 
        cls.status === 'upcoming' || 
        (cls.date && new Date(cls.date) >= today)
      )
      if (hasUpcoming) {
        return i
      }
    }
    return 0
  },

  getMockSchedule() {
    return this.formatSchedule([
      {
        date: '2026-03-07',
        weekday: '周二',
        session: 5,
        startTime: '12:00',
        endTime: '14:30',
        classroom: '201教室',
        teacher: 'Esther于哲敏',
        topic: '核心主题训练一',
        status: 'completed'
      },
      {
        date: '2026-03-10',
        weekday: '周六',
        session: 6,
        startTime: '12:00',
        endTime: '14:30',
        classroom: '201教室',
        teacher: 'Esther于哲敏',
        topic: '核心主题训练二',
        status: 'upcoming'
      },
      {
        date: '2026-03-14',
        weekday: '周二',
        session: 7,
        startTime: '12:00',
        endTime: '14:30',
        classroom: '201教室',
        teacher: 'Esther于哲敏',
        topic: '核心主题训练三',
        status: 'upcoming'
      },
      {
        date: '2026-03-17',
        weekday: '周六',
        session: 8,
        startTime: '12:00',
        endTime: '14:30',
        classroom: '201教室',
        teacher: 'Esther于哲敏',
        topic: '阶段复盘与反馈',
        status: 'upcoming'
      },
      {
        date: '2026-03-21',
        weekday: '周二',
        session: 9,
        startTime: '12:00',
        endTime: '14:30',
        classroom: '201教室',
        teacher: 'Esther于哲敏',
        topic: '进阶训练一',
        status: 'upcoming'
      },
      {
        date: '2026-03-24',
        weekday: '周六',
        session: 10,
        startTime: '12:00',
        endTime: '14:30',
        classroom: '201教室',
        teacher: 'Esther于哲敏',
        topic: '进阶训练二',
        status: 'upcoming'
      }
    ])
  },

  onMonthChange(e) {
    const month = e.detail.value
    this.setData({
      selectedMonth: month,
      currentWeek: 0
    })
    this.loadSchedule(this.data.classId, month)
  },

  onWeekChange(e) {
    const weekIndex = e.detail.value
    this.setData({
      currentWeek: weekIndex
    })
  },

  onClassTap(e) {
    const { index } = e.currentTarget.dataset
    const weekIndex = this.data.currentWeek
    const week = this.data.weeks[weekIndex]
    const classItem = week?.classes[index]
    
    if (classItem) {
      wx.showModal({
        title: '课程详情',
        content: `时间：${classItem.dateText} ${classItem.weekdayText} ${classItem.timeText}\n教室：${classItem.classroom}\n老师：${classItem.teacher}\n主题：${classItem.topic}\n状态：${classItem.statusText}`,
        showCancel: false,
        confirmText: '知道了'
      })
    }
  },

  onBack() {
    wx.navigateBack()
  }
})