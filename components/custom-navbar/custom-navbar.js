Component({
  properties: {
    centerText: {
      type: String,
      value: '',
    },
    showBack: {
      type: Boolean,
      value: false,
    },
    leftText: {
      type: String,
      value: '',
    },
    rightText: {
      type: String,
      value: '',
    },
    leftIcon: {
      type: String,
      value: '',
    },
    rightIcon: {
      type: String,
      value: '',
    },
    showLeft: {
      type: Boolean,
      value: true,
    },
    showRight: {
      type: Boolean,
      value: true,
    },
  },
  data: {
    statusBarHeight: 0,
    navBarHeight: 0,
  },
  lifetimes: {
    attached() {
      const systemInfo = wx.getSystemInfoSync()
      const statusBarHeight = systemInfo.statusBarHeight || 0
      const navBarHeight = statusBarHeight + 60 * (systemInfo.windowWidth / 750)
      this.setData({
        statusBarHeight,
        navBarHeight,
      })
    },
  },
  methods: {
    onLeftTap() {
      if (this.properties.showBack) {
        wx.navigateBack({ delta: 1 })
      }
      this.triggerEvent('lefttap')
    },
    onRightTap() {
      this.triggerEvent('righttap')
    },
  },
})
