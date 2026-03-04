const { myClassService } = require('../../../services/my-class.js')

Page({
  data: {
    navBarHeight: 0,
    loading: true,
    classId: '',
    currentClass: {},
    adjustOptions: [],
    selectedOption: null,
    reason: '',
    selectedDate: '',
    selectedDateIndex: 0,
    selectedDateLabel: '',
    submitting: false,
    dates: [] // 可选调课日期
  },

  onLoad(options) {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    
    // 生成未来7天的日期选项
    const dates = this.generateDateOptions()
    const firstDate = dates[0]
    
    this.setData({
      navBarHeight: app.globalData.navBarHeight,
      classId: options.id || '',
      selectedDate: firstDate?.value || '',
      selectedDateIndex: 0,
      selectedDateLabel: firstDate?.label || '',
      dates: dates
    })
    
    this.loadAdjustOptions(options.id, firstDate?.value)
  },

  generateDateOptions() {
    const options = []
    const today = new Date()
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      // 只显示工作日（周一至周五）
      const weekday = date.getDay()
      if (weekday >= 1 && weekday <= 5) {
        const dateStr = date.toISOString().split('T')[0]
        const weekdays = ['日', '一', '二', '三', '四', '五', '六']
        options.push({
          label: `${date.getMonth() + 1}月${date.getDate()}日 周${weekdays[weekday]}`,
          value: dateStr
        })
      }
    }
    
    return options
  },

  async loadAdjustOptions(classId, date) {
    const app = getApp()
    const currentStudent = app.getCurrentStudent()
    
    this.setData({ loading: true })
    try {
      const res = await myClassService.getAdjustOptions(classId, { 
        date,
        studentId: currentStudent?.id || app.globalData.currentStudentId
      })
      if (res.code === 200 && res.data) {
        // API返回 options，不是 adjustOptions
        const options = res.data.options || res.data.adjustOptions || []
        this.setData({
          currentClass: this.formatClassInfo(res.data.currentClass),
          adjustOptions: this.formatAdjustOptions(options),
          loading: false
        })
      } else {
        throw new Error(res.message || '加载失败')
      }
    } catch (e) {
      console.error('加载调课选项失败:', e)
      // 使用模拟数据
      this.setData({
        currentClass: this.getMockCurrentClass(),
        adjustOptions: this.getMockAdjustOptions(),
        loading: false
      })
    }
  },

  formatClassInfo(classInfo) {
    return {
      ...classInfo,
      displayName: classInfo.name,
      displayCampus: classInfo.campus?.name || '',
      displayTeacher: classInfo.mainTeacher?.name || '',
      displaySchedule: classInfo.schedule || '',
      progressText: classInfo.currentSession ? `第${classInfo.currentSession}讲` : '未开始'
    }
  },

  formatAdjustOptions(options) {
    return options.map(item => ({
      ...item,
      displayName: item.name,
      displayCampus: item.campus?.name || '',
      displayTeacher: item.mainTeacher?.name || '',
      displaySchedule: item.schedule || '',
      progressText: item.session ? `第${item.session}讲` : '未开始',
      dateText: item.date ? this.formatDate(item.date) : '',
      seatsText: item.availableSeats ? `剩余${item.availableSeats}名额` : '已满员',
      feeText: item.adjustFee > 0 ? `调课费: ¥${item.adjustFee.toFixed(2)}` : '免费调课'
    }))
  },

  formatDate(dateStr) {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const weekdays = ['日', '一', '二', '三', '四', '五', '六']
    return `${date.getMonth() + 1}月${date.getDate()}日 周${weekdays[date.getDay()]}`
  },

  getMockCurrentClass() {
    return this.formatClassInfo({
      id: 'class-001',
      name: 'K3进阶一班',
      campus: { id: 'campus-001', name: '同曦校区' },
      mainTeacher: { id: 'teacher-001', name: 'Esther于哲敏' },
      schedule: '2026.03.07-2026.06.20 周二、周六 12:00-14:30',
      currentSession: 6,
      totalSessions: 15
    })
  },

  getMockAdjustOptions() {
    return this.formatAdjustOptions([
      {
        id: 'class-004',
        name: 'K3进阶三班',
        campus: { id: 'campus-001', name: '同曦校区' },
        mainTeacher: { id: 'teacher-002', name: 'Shirley苡爽' },
        schedule: '2026.03.10-2026.06.25 周三、周日 10:00-12:00',
        date: '2026-03-14',
        session: 6,
        availableSeats: 2,
        adjustFee: 50,
        canAdjust: true
      },
      {
        id: 'class-005',
        name: 'K3进阶四班',
        campus: { id: 'campus-001', name: '同曦校区' },
        mainTeacher: { id: 'teacher-003', name: 'Tom王明' },
        schedule: '2026.03.07-2026.06.20 周一、周四 16:00-18:00',
        date: '2026-03-14',
        session: 6,
        availableSeats: 1,
        adjustFee: 30,
        canAdjust: true
      },
      {
        id: 'class-006',
        name: 'K3进阶五班',
        campus: { id: 'campus-002', name: '奥体网球中心校区' },
        mainTeacher: { id: 'teacher-001', name: 'Esther于哲敏' },
        schedule: '2026.03.07-2026.06.20 周二、周六 14:50-16:50',
        date: '2026-03-14',
        session: 6,
        availableSeats: 0,
        adjustFee: 0,
        canAdjust: false
      }
    ])
  },

  onDateChange(e) {
    const index = e.detail.value
    const date = this.data.dates[index]
    this.setData({
      selectedDateIndex: index,
      selectedDate: date.value,
      selectedDateLabel: date.label,
      selectedOption: null,
      adjustOptions: []
    })
    this.loadAdjustOptions(this.data.classId, date.value)
  },

  onOptionSelect(e) {
    const { index } = e.currentTarget.dataset
    const option = this.data.adjustOptions[index]
    
    if (!option.canAdjust) {
      wx.showToast({
        title: '该班级已满员，无法调课',
        icon: 'none'
      })
      return
    }

    this.setData({
      selectedOption: option
    })
  },

  onReasonInput(e) {
    this.setData({
      reason: e.detail.value
    })
  },

  async onSubmit() {
    const { classId, selectedOption, reason, selectedDate, submitting } = this.data
    
    if (!selectedOption) {
      wx.showToast({
        title: '请选择要调课的班级',
        icon: 'none'
      })
      return
    }

    if (!reason.trim()) {
      wx.showToast({
        title: '请输入调课原因',
        icon: 'none'
      })
      return
    }

    if (submitting) return

    // 显示确认对话框
    wx.showModal({
      title: '确认调课',
      content: `确定要在${selectedOption.dateText}临时调到【${selectedOption.displayName}】上课吗？${selectedOption.adjustFee > 0 ? `\n需要支付调课费：¥${selectedOption.adjustFee.toFixed(2)}` : ''}`,
      confirmText: '确认调课',
      cancelText: '再想想',
      success: async (res) => {
        if (res.confirm) {
          this.setData({ submitting: true })
          wx.showLoading({ title: '提交中...', mask: true })

          try {
            const app = getApp()
            const currentStudent = app.getCurrentStudent()
            
            const adjustRes = await myClassService.applyAdjust(classId, {
              studentId: currentStudent.id,
              targetClassId: selectedOption.id,
              date: selectedDate,
              reason: reason
            })

            wx.hideLoading()

            if (adjustRes.code === 200) {
              wx.showToast({
                title: '调课申请已提交',
                icon: 'success'
              })

              // 返回上一页
              setTimeout(() => {
                wx.navigateBack()
              }, 1500)
            } else {
              wx.showToast({
                title: adjustRes.message || '调课申请失败',
                icon: 'none'
              })
              this.setData({ submitting: false })
            }
          } catch (e) {
            wx.hideLoading()
            console.error('提交调课申请失败:', e)
            wx.showToast({
              title: '提交失败，请重试',
              icon: 'none'
            })
            this.setData({ submitting: false })
          }
        }
      }
    })
  },

  onBack() {
    wx.navigateBack()
  }
})