Page({
  data: {
    mockData: {
      title: '思悦',
      teachers: [
        {
          id: 'amanda',
          name: 'Amanda',
          tag: '英语',
          desc: '思悦体系主创成员，10年以上教学经验',
          avatar: '/images/pic/avatar.png',
        },
        {
          id: 'lucy',
          name: 'Lucy',
          tag: '语文',
          desc: '名校背景，擅长启发式教学',
          avatar: '/images/pic/avatar.png',
        },
      ],
      campusImages: [
        {
          id: 'campus-1',
          url: 'https://web-anli01.oss-cn-hangzhou.aliyuncs.com/miniprogram/images/pic1.jpg',
        },
        {
          id: 'campus-2',
          url: 'https://web-anli01.oss-cn-hangzhou.aliyuncs.com/miniprogram/images/pic2.jpg',
        },
        {
          id: 'campus-3',
          url: 'https://web-anli01.oss-cn-hangzhou.aliyuncs.com/miniprogram/images/pic3.jpg',
        },
      ],
      brandIntro:
        '思悦成立于2019年，总部位于南京，主要从事3-14岁孩子的素养教育，致力于打造沉浸式学习体验。',
    },
    navBarHeight: 0,
    teacherIndex: 0,
  },
  onLoad() {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    this.setData({
      navBarHeight: app.globalData.navBarHeight,
    })
  },
  onTeacherChange(e) {
    this.setData({
      teacherIndex: e.detail.current,
    })
  },
  onTeacherTap(e) {
    const { id } = e.currentTarget.dataset
    console.log('点击：名师风采', { id })
  },
  onCampusTap(e) {
    const { id } = e.currentTarget.dataset
    console.log('点击：校区环境', { id })
  },
  onBrandTap() {
    console.log('点击：品牌介绍')
  },
  onAssessmentTap() {
    const app = getApp()
    if (!app.globalData.isLoggedIn) {
      wx.navigateTo({ url: '/pages/auth/login' })
      return
    }
    wx.navigateTo({ url: '/pages/assessment/list' })
  },
  onConsultantTap() {
    wx.showToast({ title: '开发中...', icon: 'none' })
  }
})
