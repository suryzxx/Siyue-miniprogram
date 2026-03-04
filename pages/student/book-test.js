const { assessmentService } = require('../../services/assessment')

Page({
  data: {
    navBarHeight: 0,
    studentId: '',
    student: null,
    step: 1,
    loading: false,
    campusData: null,
    provinces: [],
    currentCities: [],
    currentCampuses: [],
    selectedProvince: '',
    selectedCity: '',
    selectedCampus: null,
    provinceIndex: -1,
    cityIndex: -1,
    campusIndex: -1,
    availableSlots: [],
    selectedDate: '',
    selectedSlot: null,
    dateIndex: -1,
    slotIndex: -1,
    bookingResult: null
  },

  onLoad(options) {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }

    let studentId = options.studentId || app.globalData.currentStudentId
    let student = app.globalData.students.find(s => s.id === studentId)

    this.setData({
      navBarHeight: app.globalData.navBarHeight,
      studentId,
      student
    })

    this.loadCampuses()
  },

  async loadCampuses() {
    try {
      const res = await assessmentService.getCampuses()
      if (res.code === 200 && res.data) {
        this.setData({
          campusData: res.data,
          provinces: res.data.provinces || []
        })
      }
    } catch (e) {
      console.error('加载校区数据失败', e)
      wx.showToast({ title: '加载校区失败', icon: 'none' })
    }
  },

  onProvinceChange(e) {
    const index = e.detail.value
    const province = this.data.provinces[index]
    const cities = this.data.campusData?.cities?.[province] || []
    this.setData({
      provinceIndex: index,
      selectedProvince: province,
      currentCities: cities,
      cityIndex: -1,
      selectedCity: '',
      currentCampuses: [],
      campusIndex: -1,
      selectedCampus: null,
      availableSlots: [],
      dateIndex: -1,
      selectedDate: '',
      slotIndex: -1,
      selectedSlot: null
    })
  },

  onCityChange(e) {
    const index = e.detail.value
    const city = this.data.currentCities[index]
    const campuses = (this.data.campusData?.campuses || []).filter(
      c => c.province === this.data.selectedProvince && c.city === city
    )
    this.setData({
      cityIndex: index,
      selectedCity: city,
      currentCampuses: campuses,
      campusIndex: -1,
      selectedCampus: null,
      availableSlots: [],
      dateIndex: -1,
      selectedDate: '',
      slotIndex: -1,
      selectedSlot: null
    })
  },

  async onCampusChange(e) {
    const index = e.detail.value
    const campus = this.data.currentCampuses[index]
    this.setData({
      campusIndex: index,
      selectedCampus: campus,
      availableSlots: [],
      dateIndex: -1,
      selectedDate: '',
      slotIndex: -1,
      selectedSlot: null
    })

    if (campus) {
      await this.loadSlots(campus.id)
    }
  },

  async loadSlots(campusId) {
    try {
      const today = new Date()
      const startDate = this.formatDate(today)
      const endDate = this.formatDate(new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000))

      const res = await assessmentService.getSlots(campusId, startDate, endDate)
      if (res.code === 200 && res.data) {
        this.setData({ availableSlots: res.data })
      }
    } catch (e) {
      console.error('加载时间段失败', e)
    }
  },

  formatDate(date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  },

  onDateChange(e) {
    const index = e.detail.value
    const dateItem = this.data.availableSlots[index]
    this.setData({
      dateIndex: index,
      selectedDate: dateItem?.date || '',
      slotIndex: -1,
      selectedSlot: null
    })
  },

  onSlotChange(e) {
    const index = e.detail.value
    const dateItem = this.data.availableSlots[this.data.dateIndex]
    const availableTimeSlots = (dateItem?.slots || []).filter(s => s.available)
    const slot = availableTimeSlots[index]
    this.setData({
      slotIndex: index,
      selectedSlot: slot
    })
  },

  async onSubmit() {
    const { selectedCampus, selectedDate, selectedSlot, studentId, loading } = this.data

    if (loading) return

    if (!selectedCampus) {
      wx.showToast({ title: '请选择校区', icon: 'none' })
      return
    }
    if (!selectedDate) {
      wx.showToast({ title: '请选择日期', icon: 'none' })
      return
    }
    if (!selectedSlot) {
      wx.showToast({ title: '请选择时间段', icon: 'none' })
      return
    }

    this.setData({ loading: true })
    wx.showLoading({ title: '提交中...' })

    try {
      const res = await assessmentService.create({
        studentId,
        campusId: selectedCampus.id,
        bookDate: selectedDate,
        bookTime: selectedSlot.time
      })

      wx.hideLoading()
      this.setData({ loading: false })

      if (res.code === 200 && res.data) {
        this.setData({
          step: 2,
          bookingResult: res.data
        })
      } else {
        wx.showToast({ title: res.message || '预约失败', icon: 'none' })
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
