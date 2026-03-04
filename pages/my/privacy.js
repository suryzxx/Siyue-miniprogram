Page({
  data: {
    navBarHeight: 0
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

  onBack() {
    wx.navigateBack()
  }
})
