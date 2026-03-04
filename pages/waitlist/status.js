const { WAITLIST_STATUS } = require('../../utils/status')
const { waitlistService } = require('../../services/waitlist')

Page({
  data: {
    navBarHeight: 0,
    loading: true,
    waitlistId: '',
    waitlist: {},
    steps: [
      { label: '排队中', value: WAITLIST_STATUS.PENDING },
      { label: '已通知', value: WAITLIST_STATUS.NOTIFIED },
      { label: '已转正', value: WAITLIST_STATUS.CONFIRMED },
    ],
  },

  onLoad(options) {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    this.setData({
      navBarHeight: app.globalData.navBarHeight,
      waitlistId: options.id || '',
    })
    this.loadWaitlistDetail(options.id)
  },

  onShow() {
    if (this.data.waitlistId) {
      this.loadWaitlistDetail(this.data.waitlistId)
    }
  },

  async loadWaitlistDetail(id) {
    this.setData({ loading: true })
    try {
      const res = await waitlistService.getDetail(id)
      if (res.code === 200 && res.data) {
        this.setData({ waitlist: this.formatWaitlist(res.data), loading: false })
      } else {
        throw new Error(res.message || '加载失败')
      }
    } catch (e) {
      console.log('加载候补详情失败，使用缓存数据', e)
      // 从全局缓存获取
      const app = getApp()
      const cached = app.globalData.myWaitlists.find(w => w.id === id)
      if (cached) {
        this.setData({ waitlist: this.formatWaitlist(cached), loading: false })
      } else {
        // 使用mock数据
        this.setData({
          waitlist: {
            id: id || 'wait-1',
            className: 'K3飞跃一班',
            studentName: '张小明',
            term: '2026春季',
            level: 'G2A',
            position: 3,
            status: WAITLIST_STATUS.PENDING,
            statusLabel: '排队中',
            createTime: '2026-02-24 15:30',
          },
          loading: false,
        })
      }
    }
  },

  formatWaitlist(data) {
    const statusMap = {
      [WAITLIST_STATUS.PENDING]: '排队中',
      [WAITLIST_STATUS.NOTIFIED]: '已通知',
      [WAITLIST_STATUS.CONFIRMED]: '已转正',
      [WAITLIST_STATUS.EXPIRED]: '已过期',
      [WAITLIST_STATUS.CANCELLED]: '已取消',
    }
    return {
      ...data,
      statusLabel: statusMap[data.status] || '未知',
    }
  },

  getCurrentStep() {
    const { waitlist, steps } = this.data
    const index = steps.findIndex(s => s.value === waitlist.status)
    return index >= 0 ? index : 0
  },

  async onPay() {
    const { waitlist } = this.data
    // 跳转到订单确认页进行支付
    wx.navigateTo({
      url: `/pages/order/confirm?waitlistId=${waitlist.id}&courseId=${waitlist.classId}`,
    })
  },

  async onCancel() {
    const { waitlist } = this.data
    
    wx.showModal({
      title: '确认取消',
      content: '确定要取消候补吗？取消后需要重新排队',
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '取消中...' })
          try {
            await waitlistService.cancel(waitlist.id)
          } catch (e) {
            console.log('取消候补API失败', e)
          }
          
          // 从全局状态移除
          const app = getApp()
          app.removeWaitlist(waitlist.id)
          
          wx.hideLoading()
          wx.showToast({ title: '已取消候补', icon: 'success' })
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        }
      },
    })
  },

  goToMyWaitlists() {
    wx.navigateTo({ url: '/pages/my/waitlists/waitlists' })
  },
})
