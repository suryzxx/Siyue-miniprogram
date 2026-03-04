Page({
  data: {
    navBarHeight: 0,
    orderId: '',
  },
  onLoad(options) {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    this.setData({
      navBarHeight: app.globalData.navBarHeight,
      orderId: options.orderId || '',
    })
  },
  onGoHome() {
    wx.switchTab({ url: '/pages/index/index' })
  },
  onViewOrder() {
    const { orderId } = this.data
    wx.navigateTo({ url: `/pages/order/detail?id=${orderId || 'order-1'}` })
  },
  onViewMyClasses() {
    wx.navigateTo({ url: '/pages/my/classes/classes' })
  },
})
