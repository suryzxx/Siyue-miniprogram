const { waitlistService } = require('../../../services/waitlist')

Page({
  data: {
    navBarHeight: 0,
    loading: true,
    waitlists: [],
    // 备用mock数据
    mockWaitlists: [
      {
        id: 'wait-1',
        classId: 'class-3',
        className: 'K1启蒙专项班',
        productType: 'special',
        productTypeName: '专项课',
        level: 'K1',
        schedule: '2026.03.07-2026.06.20 周二、周六 12:00-14:30',
        campus: { name: '同曦校区', address: '江宁区同曦万尚城二楼' },
        studentName: '张小明',
        status: 'pending',
        statusLabel: '排队中',
        position: 3,
        createTime: '2026-02-22 15:30',
      },
      {
        id: 'wait-2',
        classId: 'class-4',
        className: 'K2进阶三班',
        productType: 'system',
        productTypeName: '体系课',
        level: 'G1A',
        schedule: '2026.03.10-2026.06.25 周三、周日 10:00-12:00',
        campus: { name: '河西万达校区', address: '河西万达广场3楼' },
        studentName: '张小红',
        status: 'notified',
        statusLabel: '已通知',
        position: 1,
        createTime: '2026-02-20 09:15',
        notifyTime: '2026-02-24 14:00',
      },
    ],
  },

  onLoad() {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    this.setData({
      navBarHeight: app.globalData.navBarHeight,
    })
    this.loadWaitlists()
  },

  onShow() {
    this.loadWaitlists()
  },

  onPullDownRefresh() {
    this.loadWaitlists().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  async loadWaitlists() {
    this.setData({ loading: true })
    try {
      const res = await waitlistService.getList()
      if (res.code === 200 && res.data) {
        const waitlists = this.formatWaitlists(res.data.items || res.data)
        this.setData({ waitlists, loading: false })
      } else {
        throw new Error(res.message || '加载失败')
      }
    } catch (e) {
      console.log('加载候补列表失败，使用mock数据', e)
      const app = getApp()
      const waitlists = app.globalData.myWaitlists.length > 0 
        ? app.globalData.myWaitlists 
        : this.data.mockWaitlists
      this.setData({ waitlists: this.formatWaitlists(waitlists), loading: false })
    }
  },

  formatWaitlists(waitlists) {
    return waitlists.map(item => ({
      ...item,
      location: item.campus ? `${item.campus.name}-${item.campus.address || ''}` : '',
    }))
  },

  onCancelWaitlist(e) {
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '确认取消',
      content: '确定要取消候补吗？取消后需要重新排队',
      success: async (res) => {
        if (res.confirm) {
          try {
            await waitlistService.cancel(id)
            wx.showToast({ title: '已取消候补', icon: 'success' })
            // 从全局状态移除
            const app = getApp()
            app.removeWaitlist(id)
            this.loadWaitlists()
          } catch (e) {
            console.log('取消候补失败', e)
            // Mock模式下直接更新UI
            const waitlists = this.data.waitlists.filter(w => w.id !== id)
            this.setData({ waitlists })
            wx.showToast({ title: '已取消候补', icon: 'success' })
          }
        }
      },
    })
  },

  onConfirmWaitlist(e) {
    const { id, classid } = e.currentTarget.dataset
    // 跳转到订单确认页进行支付
    wx.navigateTo({
      url: `/pages/order/confirm?waitlistId=${id}&courseId=${classid}`,
    })
  },

  onViewClass(e) {
    const { classid } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/course/detail?id=${classid}` })
  },

  goToSelect() {
    wx.switchTab({ url: '/pages/course/course' })
  },
})
