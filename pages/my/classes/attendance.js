const { myClassService } = require('../../../services/my-class.js')

Page({
  data: {
    navBarHeight: 0,
    loading: true,
    classId: '',
    activeTab: 'attendance', // 'attendance' | 'schedule'
    // 考勤数据
    attendanceRecords: [],
    statistics: {},
    // 课表数据
    scheduleRecords: [],
    // 原始合并数据
    attendanceScheduleData: []
  },

  onLoad(options) {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    
    this.setData({
      navBarHeight: app.globalData.navBarHeight,
      classId: options.id || ''
    })
    
    this.loadAttendanceSchedule(options.id)
  },

  async loadAttendanceSchedule(classId) {
    const app = getApp()
    const currentStudent = app.getCurrentStudent()
    
    this.setData({ loading: true })
    try {
      const res = await myClassService.getAttendanceSchedule(classId, { 
        studentId: currentStudent?.id || app.globalData.currentStudentId
      })
      if (res.code === 200 && res.data) {
        const rawData = res.data.attendanceSchedule || []
        this.setData({
          attendanceScheduleData: rawData,
          statistics: res.data.statistics || {},
          attendanceRecords: this.formatAttendanceRecords(rawData),
          scheduleRecords: this.formatScheduleRecords(rawData),
          loading: false
        })
      } else {
        throw new Error(res.message || '加载失败')
      }
    } catch (e) {
      console.error('加载考勤课表失败:', e)
      // 使用模拟数据
      const mockData = this.getMockData()
      this.setData({
        attendanceScheduleData: mockData.attendanceSchedule,
        statistics: mockData.statistics,
        attendanceRecords: this.formatAttendanceRecords(mockData.attendanceSchedule),
        scheduleRecords: this.formatScheduleRecords(mockData.attendanceSchedule),
        loading: false
      })
    }
  },

  formatAttendanceRecords(data) {
    // 只显示有考勤记录的（已完成的课程）
    return data
      .filter(item => item.attendanceInfo && item.attendanceInfo.attendanceStatus)
      .map(item => ({
        date: item.date,
        session: item.session,
        dateText: this.formatDate(item.date),
        weekdayText: this.getWeekday(item.date),
        sessionText: item.session ? `第${item.session}讲` : '',
        status: item.attendanceInfo.attendanceStatus,
        statusText: this.getAttendanceStatusText(item.attendanceInfo.attendanceStatus),
        statusClass: this.getAttendanceStatusClass(item.attendanceInfo.attendanceStatus),
        checkInTime: item.attendanceInfo.checkInTime,
        checkOutTime: item.attendanceInfo.checkOutTime
      }))
  },

  formatScheduleRecords(data) {
    return data.map(item => ({
      date: item.date,
      session: item.session,
      dateText: this.formatDate(item.date),
      weekdayText: this.getWeekday(item.date),
      sessionText: item.session ? `第${item.session}讲` : '',
      topic: item.scheduleInfo?.topic || '',
      timeText: item.scheduleInfo ? `${item.scheduleInfo.startTime}-${item.scheduleInfo.endTime}` : '',
      scheduleStatus: item.scheduleInfo?.scheduleStatus || '',
      scheduleStatusText: this.getScheduleStatusText(item.scheduleInfo?.scheduleStatus),
      scheduleStatusClass: this.getScheduleStatusClass(item.scheduleInfo?.scheduleStatus)
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

  getAttendanceStatusText(status) {
    const statusMap = {
      'present': '出勤',
      'absent': '缺勤',
      'late': '迟到',
      'leave': '请假'
    }
    return statusMap[status] || status || ''
  },

  getAttendanceStatusClass(status) {
    const classMap = {
      'present': 'present',
      'absent': 'absent',
      'late': 'late',
      'leave': 'leave'
    }
    return classMap[status] || ''
  },

  getScheduleStatusText(status) {
    const statusMap = {
      'completed': '已完成',
      'upcoming': '即将到来',
      'cancelled': '已取消'
    }
    return statusMap[status] || status || ''
  },

  getScheduleStatusClass(status) {
    const classMap = {
      'completed': 'completed',
      'upcoming': 'upcoming',
      'cancelled': 'cancelled'
    }
    return classMap[status] || ''
  },

  getMockData() {
    return {
      statistics: {
        presentCount: 2,
        absentCount: 1,
        lateCount: 1,
        leaveCount: 0
      },
      attendanceSchedule: [
        {
          date: '2026-03-07',
          session: 5,
          scheduleInfo: {
            startTime: '10:00',
            endTime: '11:40',
            topic: '核心主题训练一',
            scheduleStatus: 'completed'
          },
          attendanceInfo: {
            attendanceStatus: 'present',
            checkInTime: '10:05',
            checkOutTime: '11:45'
          }
        },
        {
          date: '2026-03-10',
          session: 6,
          scheduleInfo: {
            startTime: '12:00',
            endTime: '14:30',
            topic: '核心主题训练二',
            scheduleStatus: 'completed'
          },
          attendanceInfo: {
            attendanceStatus: 'late',
            checkInTime: '12:15',
            checkOutTime: '14:30'
          }
        },
        {
          date: '2026-03-15',
          session: 7,
          scheduleInfo: {
            startTime: '09:00',
            endTime: '10:30',
            topic: '拓展训练',
            scheduleStatus: 'completed'
          },
          attendanceInfo: {
            attendanceStatus: 'absent',
            checkInTime: '',
            checkOutTime: ''
          }
        },
        {
          date: '2026-03-20',
          session: 8,
          scheduleInfo: {
            startTime: '14:00',
            endTime: '15:30',
            topic: '综合测评',
            scheduleStatus: 'upcoming'
          },
          attendanceInfo: {
            attendanceStatus: '',
            checkInTime: '',
            checkOutTime: ''
          }
        }
      ]
    }
  },

  onTabChange(e) {
    const { tab } = e.currentTarget.dataset
    this.setData({ activeTab: tab })
  },

  onRecordTap(e) {
    const { index } = e.currentTarget.dataset
    const record = this.data.attendanceRecords[index]
    
    if (record && (record.status === 'absent' || record.status === 'leave')) {
      wx.showModal({
        title: '缺勤/请假详情',
        content: record.reason || '无具体原因',
        showCancel: false,
        confirmText: '知道了'
      })
    }
  },

  onBack() {
    wx.navigateBack()
  }
})
