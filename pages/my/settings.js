// pages/my/settings.js
Page({
  data: {
    navBarHeight: 0,
    userInfo: {
      name: '学习者 8829',
      id: '29384756',
      avatar: '/images/pic/avatar.png'
    }
  },

  onLoad() {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    this.setData({
      navBarHeight: app.globalData.navBarHeight,
      userInfo: {
        name: app.globalData.userInfo?.nickname || '学习者',
        id: app.globalData.userInfo?.id || '',
        avatar: app.globalData.userInfo?.avatar || '/images/pic/avatar.png'
      }
    })
  },


  onShow() {
    const app = getApp()
    // 刷新用户信息
    this.setData({
      userInfo: {
        name: app.globalData.userInfo?.nickname || '学习者',
        id: app.globalData.userInfo?.id || '',
        avatar: app.globalData.userInfo?.avatar || '/images/pic/avatar.png'
      }
    })
  },


  // Switch Account -> Navigate to Student Management
  onSwitchAccount() {
    wx.navigateTo({
      url: '/pages/student/manage'
    })
  },

  // Privacy -> Navigate to Privacy Policy
  onPrivacyTap() {
    wx.navigateTo({
      url: '/pages/my/privacy'
    })
  },

  // Logout
  onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      confirmText: '确定',
      cancelText: '取消',
      confirmColor: '#9e8ef1',
      success: (res) => {
        if (res.confirm) {
          // Clear login state
          wx.clearStorageSync()
          
          // Navigate to login page
          wx.reLaunch({
            url: '/pages/auth/login'
          })
        }
      }
    })
  }
})
