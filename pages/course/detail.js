const { orderService } = require('../../services/order')

// 模拟数据
const MOCK_CLASSES = {
  'class-001': {
    id: 'class-001',
    name: 'K3进阶一班',
    productName: 'K3进阶体系课',
    productType: 'system',
    productTypeName: '体系课',
    level: 'G2A',
    campus: { id: 'campus-001', name: '同曦校区', address: '同曦万尚城二楼' },
    mainTeacher: { id: 'teacher-001', name: 'Esther于哲敏' },
    schedule: '2026.03.07-2026.06.20 周六12:00-14:30',
    classroom: '201教室',
    totalSessions: 15,
    remaining: 2,
    capacity: 10,
    price: 5475,
    materialPrice: 100,
    teacherPoster: 'https://web-anli01.oss-cn-hangzhou.aliyuncs.com/miniprogram/images/teacherEsther.jpg',
  },
  'class-002': {
    id: 'class-002',
    name: 'K2启蒙二班',
    productName: 'K2启蒙体系课',
    productType: 'system',
    productTypeName: '体系课',
    level: 'G1B',
    campus: { id: 'campus-002', name: '奥体网球中心校区', address: '奥体网球中心三楼' },
    mainTeacher: { id: 'teacher-002', name: 'Shirley苡爽' },
    schedule: '2026.03.07-2026.06.20 周二、周六 14:50-16:50',
    classroom: '302教室',
    totalSessions: 12,
    remaining: 3,
    capacity: 8,
    price: 4380,
    materialPrice: 80,
    teacherPoster: 'https://web-anli01.oss-cn-hangzhou.aliyuncs.com/miniprogram/images/teacherEsther.jpg',
  },
  'class-003': {
    id: 'class-003',
    name: '剑少一级周末班',
    productName: '剑少一级',
    productType: 'special',
    productTypeName: '专项课',
    level: '剑少一级',
    campus: { id: 'campus-001', name: '同曦校区', address: '同曦万尚城二楼' },
    mainTeacher: { id: 'teacher-001', name: 'Esther于哲敏' },
    schedule: '2026.03.08-2026.06.21 周三、周日 10:00-12:00',
    classroom: '103教室',
    totalSessions: 15,
    remaining: 5,
    capacity: 12,
    price: 4950,
    materialPrice: 150,
    teacherPoster: 'https://web-anli01.oss-cn-hangzhou.aliyuncs.com/miniprogram/images/teacherEsther.jpg',
  },
  'class-004': {
    id: 'class-004',
    name: 'K1基础三班',
    productName: 'K1基础体系课',
    productType: 'system',
    productTypeName: '体系课',
    level: 'G0A',
    campus: { id: 'campus-003', name: '河西万达校区', address: '河西万达广场B座三楼' },
    mainTeacher: { id: 'teacher-003', name: 'Mia米娅' },
    schedule: '2026.03.09-2026.05.25 周一、周五 16:00-18:00',
    classroom: 'A101教室',
    totalSessions: 10,
    remaining: 4,
    capacity: 8,
    price: 3650,
    materialPrice: 60,
    teacherPoster: 'https://web-anli01.oss-cn-hangzhou.aliyuncs.com/miniprogram/images/teacherEsther.jpg',
  },
  'class-005': {
    id: 'class-005',
    name: '自然拼读强化班',
    productName: '自然拼读',
    productType: 'special',
    productTypeName: '专项课',
    level: 'Phonics',
    campus: { id: 'campus-001', name: '同曦校区', address: '同曦万尚城二楼' },
    mainTeacher: { id: 'teacher-004', name: 'Lily莉莉' },
    schedule: '2026.03.10-2026.04.28 周二、周四 18:30-20:00',
    classroom: '205教室',
    totalSessions: 8,
    remaining: 1,
    capacity: 8,
    price: 2640,
    materialPrice: 50,
    teacherPoster: 'https://web-anli01.oss-cn-hangzhou.aliyuncs.com/miniprogram/images/teacherEsther.jpg',
  },
  'class-006': {
    id: 'class-006',
    name: 'K4高阶一班',
    productName: 'K4高阶体系课',
    productType: 'system',
    productTypeName: '体系课',
    level: 'G3A',
    campus: { id: 'campus-001', name: '同曦校区', address: '同曦万尚城二楼' },
    mainTeacher: { id: 'teacher-001', name: 'Esther于哲敏' },
    schedule: '2026.03.11-2026.06.24 周三、周六 09:00-11:30',
    classroom: '301教室',
    totalSessions: 15,
    remaining: 0,
    capacity: 10,
    price: 5975,
    materialPrice: 120,
    teacherPoster: 'https://web-anli01.oss-cn-hangzhou.aliyuncs.com/miniprogram/images/teacherEsther.jpg',
  },
  'class-007': {
    id: 'class-007',
    name: '阅读写作专项班',
    productName: '阅读写作',
    productType: 'special',
    productTypeName: '专项课',
    level: '读写进阶',
    campus: { id: 'campus-002', name: '奥体网球中心校区', address: '奥体网球中心三楼' },
    mainTeacher: { id: 'teacher-002', name: 'Shirley苡爽' },
    schedule: '2026.03.12-2026.05.28 周四、周日 14:00-16:00',
    classroom: '201教室',
    totalSessions: 10,
    remaining: 6,
    capacity: 10,
    price: 3980,
    materialPrice: 80,
    teacherPoster: 'https://web-anli01.oss-cn-hangzhou.aliyuncs.com/miniprogram/images/teacherEsther.jpg',
  },
  'class-008': {
    id: 'class-008',
    name: '剑少二级集训班',
    productName: '剑少二级',
    productType: 'special',
    productTypeName: '专项课',
    level: '剑少二级',
    campus: { id: 'campus-003', name: '河西万达校区', address: '河西万达广场B座三楼' },
    mainTeacher: { id: 'teacher-003', name: 'Mia米娅' },
    schedule: '2026.03.13-2026.06.05 周五、周六 18:00-20:00',
    classroom: 'B202教室',
    totalSessions: 12,
    remaining: 8,
    capacity: 15,
    price: 5280,
    materialPrice: 180,
    teacherPoster: 'https://web-anli01.oss-cn-hangzhou.aliyuncs.com/miniprogram/images/teacherEsther.jpg',
  },
}

Page({
  data: {
    navBarHeight: 0,
    isLoggedIn: false,
    loading: true,
    classId: '',
    classInfo: {},
    teacher: {},
    planItems: [
      { time: '2026.03.07 周二 12:00-14:30', title: '课程导学与能力评估' },
      { time: '2026.03.10 周六 12:00-14:30', title: '核心主题训练一' },
      { time: '2026.03.14 周二 12:00-14:30', title: '核心主题训练二' },
      { time: '2026.03.17 周六 12:00-14:30', title: '阶段复盘与反馈' },
    ],
  },

  onLoad(options) {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    this.setData({
      navBarHeight: app.globalData.navBarHeight,
      classId: options.id || '',
    })
    this.loadClassDetail(options.id)
  },

  onShow() {
    const app = getApp()
    this.setData({
      isLoggedIn: !!app.globalData.isLoggedIn,
    })
  },

  loadClassDetail(id) {
    this.setData({ loading: true })
    
    setTimeout(() => {
      const data = MOCK_CLASSES[id] || MOCK_CLASSES['class-001']
      
      const classInfo = {
        ...data,
        location: data.campus ? `${data.campus.name} ${data.classroom || ''}` : '',
        totalPrice: data.price + data.materialPrice,
      }
      
      const teacher = {
        name: data.mainTeacher?.name || '',
        poster: data.teacherPoster || 'https://web-anli01.oss-cn-hangzhou.aliyuncs.com/miniprogram/images/teacherEsther.jpg',
      }
      
      this.setData({
        classInfo,
        teacher,
        loading: false,
      })
    }, 300)
  },

  async onEnrollTap() {
    const app = getApp()
    const { classInfo } = this.data

    // 检查登录状态
    if (!app.globalData.isLoggedIn) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再进行报名',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/auth/login' })
          }
        },
      })
      return
    }

    const currentStudent = app.getCurrentStudent()

    // 检查是否有学生
    if (!currentStudent) {
      wx.showModal({
        title: '提示',
        content: '请先添加学生后再进行报名',
        confirmText: '去添加',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/student/add' })
          }
        },
      })
      return
    }

    // 体系课需要检查评测等级
    if (classInfo.productType === 'system') {
      if (!currentStudent.level || currentStudent.needTest) {
        wx.showModal({
          title: '提示',
          content: `学生"${currentStudent.name}"尚未完成等级测试，请先预约线下评测后才能报名体系课`,
          confirmText: '去预约',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              wx.navigateTo({ url: `/pages/student/book-test?studentId=${currentStudent.id}` })
            }
          },
        })
        return
      }
    }

    // 根据余位决定报名还是候补
    if (classInfo.remaining > 0) {
      // 有余位，创建订单
      wx.showLoading({ title: '创建订单中...', mask: true })
      try {
        const orderRes = await orderService.create({
          classId: classInfo.id,
          studentId: currentStudent.id
        })
        wx.hideLoading()
        if (orderRes.code === 200 && orderRes.data) {
          wx.navigateTo({
            url: `/pages/order/detail?id=${orderRes.data.id}`,
          })
        } else {
          wx.showToast({ title: orderRes.message || '创建订单失败', icon: 'none' })
        }
      } catch (e) {
        wx.hideLoading()
        console.error('创建订单失败:', e)
        wx.showToast({ title: '创建订单失败，请重试', icon: 'none' })
      }
    } else {
      // 无余位，提示候补
      wx.showModal({
        title: '提示',
        content: '该班级已满员，是否加入候补？',
        confirmText: '加入候补',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            wx.showToast({ title: '已加入候补', icon: 'success' })
          }
        },
      })
    }
  },
})
