const { assessmentService } = require('../../services/assessment')

Page({
  data: {
    navBarHeight: 0,
    loading: false,
    list: [],
    tabs: [
      { label: '全部', value: 'all' },
      { label: '待评测', value: 'pending' },
      { label: '已完成', value: 'completed' }
    ],
    currentTab: 'all'
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
    this.loadList()
  },

  async loadList() {
    this.setData({ loading: true })
    try {
      const params = {}
      if (this.data.currentTab !== 'all') {
        params.status = this.data.currentTab
      }
      const res = await assessmentService.getList(params)
      if (res.code === 200 && res.data) {
        this.setData({ list: res.data.list || res.data || [] })
      }
    } catch (e) {
      console.error('加载预约列表失败', e)
      wx.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  onTabChange(e) {
    const { value } = e.currentTarget.dataset
    this.setData({ currentTab: value })
    this.loadList()
  },

  onItemTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/assessment/detail?id=${id}` })
  },

  onBookNew() {
    wx.navigateTo({ url: '/pages/student/book-test' })
  },

  getStatusText(status) {
    const map = {
      pending: '待评测',
      completed: '已完成',
      cancelled: '已取消'
    }
    return map[status] || status
  },

  onPullDownRefresh() {
    this.loadList().then(() => {
      wx.stopPullDownRefresh()
    })
  }
})
