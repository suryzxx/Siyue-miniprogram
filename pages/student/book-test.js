const { assessmentService } = require('../../services/assessment')

Page({
data: {
navBarHeight: 0,
loading: false,
campuses: [],
campusIndex: -1,
    selectedCampus: null,
    selectedDate: '',
    selectedTime: '',
    minDate: '',
step: 1,
bookingResult: null
},

onLoad(options) {
const app = getApp()
if (!app.globalData.navBarHeight) {
app.calculateNavBarHeight()
    }
    // 设置最小日期为今天
    const today = new Date()
    const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
this.setData({
      navBarHeight: app.globalData.navBarHeight,
      minDate
})
this.loadCampuses()
},

  async loadCampuses() {
    try {
      const res = await assessmentService.getCampuses()
      if (res.code === 200 && res.data && res.data.list) {
        this.setData({ campuses: res.data.list })
      }
    } catch (e) {
      console.error('加载校区数据失败', e)
      wx.showToast({ title: '加载校区失败', icon: 'none' })
    }
  },

  onCampusChange(e) {
    const index = e.detail.value
    const campus = this.data.campuses[index]
    this.setData({
      campusIndex: index,
      selectedCampus: campus
    })
  },

  onDateChange(e) {
    this.setData({
      selectedDate: e.detail.value
    })
  },

  onTimePickerChange(e) {
    this.setData({
      selectedTime: e.detail.value
    })
  },

  async onSubmit() {
    const { selectedCampus, selectedDate, selectedTime, loading } = this.data

    if (loading) return

    if (!selectedCampus) {
      wx.showToast({ title: '请选择校区', icon: 'none' })
      return
    }
    if (!selectedDate) {
      wx.showToast({ title: '请选择日期', icon: 'none' })
      return
    }
    if (!selectedTime) {
      wx.showToast({ title: '请选择时间', icon: 'none' })
      return
    }

    this.setData({ loading: true })
    wx.showLoading({ title: '提交中...' })

    try {
      const res = await assessmentService.create({
        campusId: selectedCampus.id,
        bookDate: selectedDate,
        bookTime: selectedTime
      })

      wx.hideLoading()
      this.setData({ loading: false })

      if (res.code === 200) {
        wx.showToast({ title: '预约成功', icon: 'success' })
        setTimeout(() => {
          wx.redirectTo({ url: '/pages/assessment/list' })
        }, 1500)
      } else {
        wx.showToast({ title: res.message || res.msg || '预约失败', icon: 'none' })
      }
    } catch (err) {
      wx.hideLoading()
      this.setData({ loading: false })
      wx.showToast({ title: err.message || '网络错误', icon: 'none' })
    }
  },

  onCallTeacher() {
    const phone = this.data.bookingResult?.teacherPhone || this.data.selectedCampus?.phone
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone,
        fail: () => wx.showToast({ title: '拨打失败', icon: 'none' })
      })
    }
  },

  onCopyPhone() {
    const phone = this.data.bookingResult?.teacherPhone || this.data.selectedCampus?.phone
    if (phone) {
      wx.setClipboardData({
        data: phone,
        success: () => wx.showToast({ title: '已复制', icon: 'success' })
      })
    }
  },

  onViewHistory() {
    wx.navigateTo({ url: '/pages/assessment/list' })
  },

  onBack() {
    wx.navigateBack()
  }
})
