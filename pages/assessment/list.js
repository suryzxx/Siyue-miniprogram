const { assessmentService } = require('../../services/assessment')
const { subscribeService } = require('../../services/subscribe')

Page({
  data: {
    navBarHeight: 0,
    loading: false,
    list: [],
    currentStudentName: ''
  },

  onLoad() {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    this.setData({
      navBarHeight: app.globalData.navBarHeight
    })
  },

  onShow() {
    const app = getApp()
    const currentStudent = app.globalData.currentStudent
    this.setData({
      currentStudentName: currentStudent ? currentStudent.name : ''
    })
    this.loadList()
  },

  async loadList() {
    this.setData({ loading: true })
    try {
      const res = await assessmentService.getList()
      if (res.code === 200 && res.data) {
        this.setData({ list: res.data.list || [] })
      }
    } catch (e) {
      console.error('加载预约列表失败', e)
      wx.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  onGoCalendar() {
    wx.navigateTo({ url: '/pages/assessment/calendar' })
  },

  onCancelTap(e) {
    const { id, index } = e.currentTarget.dataset
    wx.showModal({
      title: '确认取消',
      content: '确定要取消此次评测预约吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            wx.showLoading({ title: '取消中...', mask: true })
            const result = await subscribeService.cancelReview(id)
            wx.hideLoading()
            
            const isSuccess = result.code === 200 || result.msg === 'ok'
            if (isSuccess) {
              wx.showToast({ title: '已取消', icon: 'success' })
              this.loadList()
            } else {
              wx.showToast({ title: result.message || result.msg || '取消失败', icon: 'none' })
            }
          } catch (e) {
            wx.hideLoading()
            wx.showToast({ title: '操作失败', icon: 'none' })
          }
        }
      }
    })
  },

  onPullDownRefresh() {
    this.loadList().then(() => {
      wx.stopPullDownRefresh()
    })
  }
})
