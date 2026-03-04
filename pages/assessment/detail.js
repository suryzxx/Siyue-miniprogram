const { assessmentService } = require('../../services/assessment')

Page({
  data: {
    navBarHeight: 0,
    loading: false,
    assessmentId: '',
    detail: null
  },

  onLoad(options) {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    this.setData({
      navBarHeight: app.globalData.navBarHeight,
      assessmentId: options.id
    })
    this.loadDetail(options.id)
  },

  async loadDetail(id) {
    this.setData({ loading: true })
    try {
      const res = await assessmentService.getDetail(id)
      if (res.code === 200 && res.data) {
        this.setData({ detail: res.data })
      } else {
        wx.showToast({ title: '加载失败', icon: 'none' })
      }
    } catch (e) {
      console.error('加载详情失败', e)
      wx.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  onCallTeacher() {
    const phone = this.data.detail?.teacherPhone
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone,
        fail: () => wx.showToast({ title: '拨打失败', icon: 'none' })
      })
    }
  },

  onCopyPhone() {
    const phone = this.data.detail?.teacherPhone
    if (phone) {
      wx.setClipboardData({
        data: phone,
        success: () => wx.showToast({ title: '已复制', icon: 'success' })
      })
    }
  },

  async onCancel() {
    wx.showModal({
      title: '确认取消',
      content: '确定要取消此次评测预约吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const result = await assessmentService.cancel(this.data.assessmentId)
            if (result.code === 200) {
              wx.showToast({ title: '已取消', icon: 'success' })
              this.loadDetail(this.data.assessmentId)
            } else {
              wx.showToast({ title: result.message || '取消失败', icon: 'none' })
            }
          } catch (e) {
            wx.showToast({ title: '操作失败', icon: 'none' })
          }
        }
      }
    })
  },

  onGoEnroll() {
    wx.switchTab({ url: '/pages/course/course' })
  }
})
