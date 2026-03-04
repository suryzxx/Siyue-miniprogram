// 模拟数据
const MOCK_CLASSES = {
  'class-001': {
    id: 'class-001',
    name: 'K3进阶一班',
    productType: 'system',
    productTypeDisplay: '体系课（G2A）',
    classType: '小班（8人）',
    sessionsText: '15次',
    remainingText: '剩余2名',
    schedule: '2026.03.07-2026.06.20 周二、周六 12:00-14:30',
    location: '同曦校区 201教室',
    teacherPoster: 'https://web-anli01.oss-cn-hangzhou.aliyuncs.com/miniprogram/images/teacher-poster.jpg',
    syllabus: [
      { week: 1, title: '课程介绍与基础概念', time: '2026.03.07 12:00-14:30' },
      { week: 2, title: '核心知识点讲解', time: '2026.03.10 12:00-14:30' },
      { week: 3, title: '实践练习与巩固', time: '2026.03.14 12:00-14:30' },
      { week: 4, title: '进阶内容学习', time: '2026.03.17 12:00-14:30' },
      { week: 5, title: '阶段复习与测试', time: '2026.03.21 12:00-14:30' },
    ]
  },
  'class-002': {
    id: 'class-002',
    name: 'K2启蒙二班',
    productType: 'system',
    productTypeDisplay: '体系课（G1B）',
    classType: '小班（6人）',
    sessionsText: '12次',
    remainingText: '剩余3名',
    schedule: '2026.03.07-2026.06.20 周二、周六 14:50-16:50',
    location: '奥体网球中心校区 302教室',
    teacherPoster: 'https://web-anli01.oss-cn-hangzhou.aliyuncs.com/miniprogram/images/teacher-poster.jpg',
    syllabus: [
      { week: 1, title: '启蒙课程介绍', time: '2026.03.07 14:50-16:50' },
      { week: 2, title: '基础能力培养', time: '2026.03.10 14:50-16:50' },
      { week: 3, title: '趣味互动练习', time: '2026.03.14 14:50-16:50' },
    ]
  },
  'class-003': {
    id: 'class-003',
    name: '剑少一级周末班',
    productType: 'special',
    productTypeDisplay: '专项课（剑少一级）',
    classType: '中班（12人）',
    sessionsText: '15次',
    remainingText: '剩余5名',
    schedule: '2026.03.08-2026.06.21 周三、周日 10:00-12:00',
    location: '同曦校区 103教室',
    teacherPoster: 'https://web-anli01.oss-cn-hangzhou.aliyuncs.com/miniprogram/images/teacher-poster.jpg',
    syllabus: [
      { week: 1, title: '剑少考试介绍', time: '2026.03.08 10:00-12:00' },
      { week: 2, title: '词汇专项训练', time: '2026.03.12 10:00-12:00' },
    ]
  },
  'class-004': {
    id: 'class-004',
    name: 'K1基础三班',
    productType: 'system',
    productTypeDisplay: '体系课（G0A）',
    classType: '小班（6人）',
    sessionsText: '10次',
    remainingText: '剩余4名',
    schedule: '2026.03.09-2026.05.25 周一、周五 16:00-18:00',
    location: '河西万达校区 A101教室',
    teacherPoster: 'https://web-anli01.oss-cn-hangzhou.aliyuncs.com/miniprogram/images/teacher-poster.jpg',
    syllabus: []
  },
  'class-005': {
    id: 'class-005',
    name: '自然拼读强化班',
    productType: 'special',
    productTypeDisplay: '专项课（自然拼读）',
    classType: '小班（8人）',
    sessionsText: '8次',
    remainingText: '剩余1名',
    schedule: '2026.03.10-2026.04.28 周二、周四 18:30-20:00',
    location: '同曦校区 205教室',
    teacherPoster: 'https://web-anli01.oss-cn-hangzhou.aliyuncs.com/miniprogram/images/teacher-poster.jpg',
    syllabus: []
  }
}

Page({
  data: {
    navBarHeight: 0,
    loading: true,
    classId: '',
    classInfo: {}
  },

  onLoad(options) {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    this.setData({
      navBarHeight: app.globalData.navBarHeight,
      classId: options.id || ''
    })
    this.loadClassDetail(options.id)
  },

  loadClassDetail(id) {
    // 直接使用模拟数据，不调用接口
    this.setData({ loading: true })
    
    setTimeout(() => {
      const classInfo = MOCK_CLASSES[id] || MOCK_CLASSES['class-001']
      
      this.setData({
        classInfo,
        loading: false
      })
    }, 300)
  },

  onBack() {
    wx.navigateBack()
  }
})
