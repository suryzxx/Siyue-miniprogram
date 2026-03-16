const { commonService } = require('../../services/common')

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
          url: 'https://sy-student.oss-cn-shanghai.aliyuncs.com/%E6%A0%A1%E5%8C%BA%E7%8E%AF%E5%A2%83/2b1c592fe4d44ccb52768a10dc570d30.png',
        },
        {
          id: 'campus-2',
          url: 'https://sy-student.oss-cn-shanghai.aliyuncs.com/%E6%A0%A1%E5%8C%BA%E7%8E%AF%E5%A2%83/05c7a4ac598061b6ff367565a41f1cf9.png',
        },
        {
          id: 'campus-3',
          url: 'https://sy-student.oss-cn-shanghai.aliyuncs.com/%E6%A0%A1%E5%8C%BA%E7%8E%AF%E5%A2%83/7a94dd4944b62109b1541e864436923a.png',
        },
        {
          id: 'campus-4',
          url: 'https://sy-student.oss-cn-shanghai.aliyuncs.com/%E6%A0%A1%E5%8C%BA%E7%8E%AF%E5%A2%83/29292672eae3bf9340135e53cbfa7fbe.png',
        },
        {
          id: 'campus-5',
          url: 'https://sy-student.oss-cn-shanghai.aliyuncs.com/%E6%A0%A1%E5%8C%BA%E7%8E%AF%E5%A2%83/42323467d8917cbe9d36f3b07ec763fb.png',
        },
        {
          id: 'campus-6',
          url: 'https://sy-student.oss-cn-shanghai.aliyuncs.com/%E6%A0%A1%E5%8C%BA%E7%8E%AF%E5%A2%83/a6ac2c55f05710b256086681a0983737.png',
        },
        {
          id: 'campus-7',
          url: 'https://sy-student.oss-cn-shanghai.aliyuncs.com/%E6%A0%A1%E5%8C%BA%E7%8E%AF%E5%A2%83/b9cbfaff3c3b529081e95dc7a7a38b00.png',
        },
        {
          id: 'campus-8',
          url: 'https://sy-student.oss-cn-shanghai.aliyuncs.com/%E6%A0%A1%E5%8C%BA%E7%8E%AF%E5%A2%83/ed2619e77f566b4e203156c2076f12b0.png',
        },
      ],
      brandIntro:
        '思悦成立于2019年，总部位于南京，主要从事3-14岁孩子的素养教育，致力于打造沉浸式学习体验。',
    },
    navBarHeight: 0,
    teacherIndex: 0,
    showConsultantPopup: false,
    consultantPoster: ''
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
    // 如果已经有图片URL，直接显示弹窗
    if (this.data.consultantPoster) {
      this.setData({ showConsultantPopup: true })
      return
    }
    
    wx.showLoading({ title: '加载中...' })
    commonService.getUserInfo().then(res => {
      wx.hideLoading()
      if (res.code === 200 && res.data && res.data.guwenPoster) {
        this.setData({
          consultantPoster: res.data.guwenPoster,
          showConsultantPopup: true
        })
      } else {
        wx.showToast({ title: '暂无课程顾问信息', icon: 'none' })
      }
    }).catch(() => {
      wx.hideLoading()
      wx.showToast({ title: '获取信息失败', icon: 'none' })
    })
  },
  onCloseConsultantPopup() {
    this.setData({ showConsultantPopup: false })
  },
  onConsultantMaskTap() {
    this.setData({ showConsultantPopup: false })
  },
  stopPropagation() {
    // 阻止事件冒泡
  }
})
