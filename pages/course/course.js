// 筛选项模拟数据
const MOCK_FILTERS = {
  semesters: ['春季', '暑期', '秋季', '寒假'],
  campuses: [
    { id: 'campus-001', name: '同曦校区' },
    { id: 'campus-002', name: '奥体网球中心校区' },
    { id: 'campus-003', name: '河西万达校区' },
    { id: 'campus-004', name: '江宁百家湖校区' },
    { id: 'campus-005', name: '浦口明发校区' },
  ],
  teachers: [
    { id: 'teacher-001', name: 'Esther于哲敏' },
    { id: 'teacher-002', name: 'Shirley苡爽' },
    { id: 'teacher-003', name: 'Mia米娅' },
    { id: 'teacher-004', name: 'Lily莉莉' },
    { id: 'teacher-005', name: 'Cathy凯西' },
  ],
}

// 班级模拟数据
const MOCK_CLASSES = [
  {
    id: 'class-001',
    name: 'K3进阶一班',
    productName: 'K3进阶体系课',
    productType: 'system',
    level: 'G2A',
    campus: { id: 'campus-001', name: '同曦校区', address: '同曦万尚城二楼' },
    mainTeacher: { id: 'teacher-001', name: 'Esther于哲敏', avatar: '/images/pic/avatar.png' },
    schedule: '2026.03.07-2026.06.20 周二、周六 12:00-14:30',
    classroom: '201教室',
    totalSessions: 15,
    remaining: 2,
    capacity: 10,
    price: 5475,
    materialPrice: 100,
  },
  {
    id: 'class-002',
    name: 'K2启蒙二班',
    productName: 'K2启蒙体系课',
    productType: 'system',
    level: 'G1B',
    campus: { id: 'campus-002', name: '奥体网球中心校区', address: '奥体网球中心三楼' },
    mainTeacher: { id: 'teacher-002', name: 'Shirley苡爽', avatar: '/images/pic/avatar.png' },
    schedule: '2026.03.07-2026.06.20 周二、周六 14:50-16:50',
    classroom: '302教室',
    totalSessions: 12,
    remaining: 3,
    capacity: 8,
    price: 4380,
    materialPrice: 80,
  },
  {
    id: 'class-003',
    name: '剑少一级周末班',
    productName: '剑少一级',
    productType: 'special',
    level: '剑少一级',
    campus: { id: 'campus-001', name: '同曦校区', address: '同曦万尚城二楼' },
    mainTeacher: { id: 'teacher-001', name: 'Esther于哲敏', avatar: '/images/pic/avatar.png' },
    schedule: '2026.03.08-2026.06.21 周三、周日 10:00-12:00',
    classroom: '103教室',
    totalSessions: 15,
    remaining: 5,
    capacity: 12,
    price: 4950,
    materialPrice: 150,
  },
  {
    id: 'class-004',
    name: 'K1基础三班',
    productName: 'K1基础体系课',
    productType: 'system',
    level: 'G0A',
    campus: { id: 'campus-003', name: '河西万达校区', address: '河西万达广场B座三楼' },
    mainTeacher: { id: 'teacher-003', name: 'Mia米娅', avatar: '/images/pic/avatar.png' },
    schedule: '2026.03.09-2026.05.25 周一、周五 16:00-18:00',
    classroom: 'A101教室',
    totalSessions: 10,
    remaining: 4,
    capacity: 8,
    price: 3650,
    materialPrice: 60,
  },
  {
    id: 'class-005',
    name: '自然拼读强化班',
    productName: '自然拼读',
    productType: 'special',
    level: 'Phonics',
    campus: { id: 'campus-001', name: '同曦校区', address: '同曦万尚城二楼' },
    mainTeacher: { id: 'teacher-004', name: 'Lily莉莉', avatar: '/images/pic/avatar.png' },
    schedule: '2026.03.10-2026.04.28 周二、周四 18:30-20:00',
    classroom: '205教室',
    totalSessions: 8,
    remaining: 1,
    capacity: 8,
    price: 2640,
    materialPrice: 50,
  },
  {
    id: 'class-006',
    name: 'K4高阶一班',
    productName: 'K4高阶体系课',
    productType: 'system',
    level: 'G3A',
    campus: { id: 'campus-001', name: '同曦校区', address: '同曦万尚城二楼' },
    mainTeacher: { id: 'teacher-001', name: 'Esther于哲敏', avatar: '/images/pic/avatar.png' },
    schedule: '2026.03.11-2026.06.24 周三、周六 09:00-11:30',
    classroom: '301教室',
    totalSessions: 15,
    remaining: 0,
    capacity: 10,
    price: 5975,
    materialPrice: 120,
  },
  {
    id: 'class-007',
    name: '阅读写作专项班',
    productName: '阅读写作',
    productType: 'special',
    level: '读写进阶',
    campus: { id: 'campus-002', name: '奥体网球中心校区', address: '奥体网球中心三楼' },
    mainTeacher: { id: 'teacher-002', name: 'Shirley苡爽', avatar: '/images/pic/avatar.png' },
    schedule: '2026.03.12-2026.05.28 周四、周日 14:00-16:00',
    classroom: '201教室',
    totalSessions: 10,
    remaining: 6,
    capacity: 10,
    price: 3980,
    materialPrice: 80,
  },
  {
    id: 'class-008',
    name: '剑少二级集训班',
    productName: '剑少二级',
    productType: 'special',
    level: '剑少二级',
    campus: { id: 'campus-003', name: '河西万达校区', address: '河西万达广场B座三楼' },
    mainTeacher: { id: 'teacher-003', name: 'Mia米娅', avatar: '/images/pic/avatar.png' },
    schedule: '2026.03.13-2026.06.05 周五、周六 18:00-20:00',
    classroom: 'B202教室',
    totalSessions: 12,
    remaining: 8,
    capacity: 15,
    price: 5280,
    materialPrice: 180,
  },
  {
    id: 'class-009',
    name: 'K2启蒙三班',
    productName: 'K2启蒙体系课',
    productType: 'system',
    level: 'G1A',
    campus: { id: 'campus-004', name: '江宁百家湖校区', address: '百家湖1912街区' },
    mainTeacher: { id: 'teacher-005', name: 'Cathy凯西', avatar: '/images/pic/avatar.png' },
    schedule: '2026.03.14-2026.06.27 周六、周日 10:00-12:00',
    classroom: 'C301教室',
    totalSessions: 12,
    remaining: 5,
    capacity: 8,
    price: 4380,
    materialPrice: 80,
  },
  {
    id: 'class-010',
    name: '口语强化班',
    productName: '口语强化',
    productType: 'special',
    level: 'Speaking',
    campus: { id: 'campus-005', name: '浦口明发校区', address: '明发滨江新城' },
    mainTeacher: { id: 'teacher-004', name: 'Lily莉莉', avatar: '/images/pic/avatar.png' },
    schedule: '2026.03.15-2026.05.29 周日 14:00-16:30',
    classroom: 'D102教室',
    totalSessions: 10,
    remaining: 7,
    capacity: 10,
    price: 3280,
    materialPrice: 60,
  },
]

Page({
  data: {
    navBarHeight: 0,
    loading: true,
    loadingMore: false,
    classes: [],
    hasMore: false,
    filters: MOCK_FILTERS,
    currentFilters: {
      semester: '',
      campusId: '',
      campusName: '',
      teacherId: '',
      teacherName: '',
    },
  },

  onLoad() {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    this.setData({
      navBarHeight: app.globalData.navBarHeight,
    })
    this.loadClasses()
  },

  onPullDownRefresh() {
    this.loadClasses(true).then(() => {
      wx.stopPullDownRefresh()
    })
  },

  onReachBottom() {
    // 模拟数据不需要加载更多
  },

  loadClasses(isRefresh = false) {
    return new Promise((resolve) => {
      this.setData({ loading: true })
      
      setTimeout(() => {
        let filteredClasses = [...MOCK_CLASSES]
        const { currentFilters } = this.data
        
        // 根据筛选条件过滤
        if (currentFilters.campusId) {
          filteredClasses = filteredClasses.filter(c => c.campus.id === currentFilters.campusId)
        }
        if (currentFilters.teacherId) {
          filteredClasses = filteredClasses.filter(c => c.mainTeacher.id === currentFilters.teacherId)
        }
        
        const classes = this.formatClasses(filteredClasses)
        this.setData({
          classes,
          loading: false,
          hasMore: false,
        })
        resolve()
      }, 300)
    })
  },

  formatClasses(classes) {
    return classes.map(item => ({
      ...item,
      title: item.name,
      time: item.schedule,
      location: item.campus ? `${item.campus.name}` : '',
      productTypeDisplay: this.getProductTypeDisplay(item),
      teacher: {
        ...(item.mainTeacher || {}),
        avatar: '/images/pic/avatar.png',
      },
      remainingSeats: item.remaining,
      statusText: item.remaining > 0 ? `剩余${item.remaining}名额` : '已满员，可候补',
      statusClass: item.remaining > 0 ? 'is-remaining' : 'is-full',
      price: `¥${item.price.toFixed(0)}`,
      unit: `/${item.totalSessions}课次`,
    }))
  },

  getProductTypeDisplay(item) {
    if (item.productType === 'system') {
      return `体系课（需评测）${item.level || ''}`
    } else {
      return `专项课${item.level ? ` ${item.level}` : ''}`
    }
  },

  onFilterChange(e) {
    const newFilters = e.detail
    this.setData({
      currentFilters: newFilters,
    }, () => {
      this.loadClasses()
    })
  },

  onClassTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/course/detail?id=${id}` })
  },
})
