const { ORDER_STATUS, ORDER_STATUS_CONFIG } = require('../../utils/status')
const { orderService } = require('../../services/order')
const { config } = require('../../utils/config')

// 20条模拟订单数据，覆盖所有状态
const MOCK_ORDERS = [
  // ========== 正常报名流程 ==========
  // 1. 待支付
  {
    id: 'ORD20260301001',
    className: 'K3进阶一班',
    productType: 'system',
    level: 'G2A',
    studentName: '张小明',
    schedule: '2026.03.07-2026.06.20 周二、周六 12:00-14:30',
    location: '同曦校区 201教室',
    teacherName: 'Esther于哲敏',
    sessions: 15,
    totalPrice: 5575,
    paidAmount: 0,
    status: ORDER_STATUS.PENDING,
    createTime: '2026-03-01 10:30:00',
    expireTime: '2026-03-01 11:00:00',
  },
  // 2. 已支付（正常报名）
  {
    id: 'ORD20260228002',
    className: 'K2启蒙二班',
    productType: 'system',
    level: 'G1B',
    studentName: '张小明',
    schedule: '2026.03.07-2026.06.20 周二、周六 14:50-16:50',
    location: '奥体网球中心校区 302教室',
    teacherName: 'Shirley苡爽',
    sessions: 12,
    totalPrice: 4460,
    paidAmount: 4460,
    status: ORDER_STATUS.PAID,
    createTime: '2026-02-28 14:20:00',
    payTime: '2026-02-28 14:25:00',
  },
  // 3. 已取消（超时）
  {
    id: 'ORD20260225003',
    className: '剑少一级周末班',
    productType: 'special',
    level: '剑少一级',
    studentName: '张小明',
    schedule: '2026.03.08-2026.06.21 周三、周日 10:00-12:00',
    location: '同曦校区 103教室',
    teacherName: 'Esther于哲敏',
    sessions: 15,
    totalPrice: 5100,
    paidAmount: 0,
    status: ORDER_STATUS.CANCELLED,
    createTime: '2026-02-25 09:00:00',
    cancelTime: '2026-02-25 09:30:00',
    cancelReason: '超时未支付，订单自动取消',
  },
  // 4. 已退款
  {
    id: 'ORD20260210004',
    className: 'K1基础一班',
    productType: 'system',
    level: 'G0A',
    studentName: '张小明',
    schedule: '2026.02.15-2026.05.01 周一、周五 16:00-18:00',
    location: '河西万达校区 A101教室',
    teacherName: 'Mia米娅',
    sessions: 10,
    totalPrice: 3710,
    paidAmount: 3710,
    refundAmount: 2968,
    usedSessions: 2,
    status: ORDER_STATUS.REFUNDED,
    createTime: '2026-02-10 11:00:00',
    payTime: '2026-02-10 11:05:00',
    refundTime: '2026-02-20 15:00:00',
    refundReason: '学生转学，申请退费',
  },
  
  // ========== 预售流程 ==========
  // 5. 待付定金
  {
    id: 'ORD20260301005',
    className: '暑期K3集训班（预售）',
    productType: 'special',
    level: '暑期集训',
    studentName: '张小明',
    schedule: '2026.07.01-2026.07.31 周一至周五 09:00-11:30',
    location: '同曦校区 301教室',
    teacherName: 'Esther于哲敏',
    sessions: 20,
    totalPrice: 6000,
    depositAmount: 500,
    paidAmount: 0,
    status: ORDER_STATUS.DEPOSIT_PENDING,
    createTime: '2026-03-01 09:00:00',
    expireTime: '2026-03-01 09:30:00',
  },
  // 6. 已付定金（等待开班）
  {
    id: 'ORD20260228006',
    className: '暑期K2启蒙班（预售）',
    productType: 'system',
    level: '暑期启蒙',
    studentName: '张小明',
    schedule: '2026.07.15-2026.08.15 周一至周五 14:00-16:00',
    location: '奥体网球中心校区 201教室',
    teacherName: 'Shirley苡爽',
    sessions: 20,
    totalPrice: 5000,
    depositAmount: 500,
    paidAmount: 500,
    status: ORDER_STATUS.DEPOSIT_PAID,
    createTime: '2026-02-28 10:00:00',
    depositPayTime: '2026-02-28 10:05:00',
  },
  // 7. 待付尾款
  {
    id: 'ORD20260220007',
    className: '暑期K4高阶班（预售）',
    productType: 'system',
    level: '暑期高阶',
    studentName: '张小明',
    schedule: '2026.07.01-2026.07.31 周一至周五 09:00-11:30',
    location: '同曦校区 301教室',
    teacherName: 'Esther于哲敏',
    sessions: 20,
    totalPrice: 6500,
    depositAmount: 500,
    balanceAmount: 6000,
    paidAmount: 500,
    status: ORDER_STATUS.BALANCE_PENDING,
    createTime: '2026-02-20 14:00:00',
    depositPayTime: '2026-02-20 14:05:00',
    classOpenTime: '2026-03-01 10:00:00',
    expireTime: '2026-03-02 10:00:00',
  },
  // 8. 预售失败
  {
    id: 'ORD20260215008',
    className: '春季K5冲刺班（预售）',
    productType: 'special',
    level: '冲刺班',
    studentName: '张小明',
    schedule: '2026.03.15-2026.06.15 周六、周日 18:00-20:00',
    location: '江宁百家湖校区 C301教室',
    teacherName: 'Cathy凯西',
    sessions: 15,
    totalPrice: 5500,
    depositAmount: 500,
    paidAmount: 500,
    refundAmount: 500,
    status: ORDER_STATUS.PRESALE_FAILED,
    createTime: '2026-02-15 11:00:00',
    depositPayTime: '2026-02-15 11:05:00',
    failTime: '2026-02-25 18:00:00',
    failReason: '报名人数不足，未达到开班阈值（需5人，实际3人）',
    refundTime: '2026-02-25 18:05:00',
  },
  
  // ========== 分期流程（秋季班） ==========
  // 9. 待续费（秋上结束，待续费秋下）
  {
    id: 'ORD20250901009',
    className: '秋季K3进阶班',
    productType: 'system',
    level: 'G2A',
    studentName: '张小明',
    schedule: '2025.09.01-2026.01.15 周二、周六 12:00-14:30',
    location: '同曦校区 201教室',
    teacherName: 'Esther于哲敏',
    sessions: 15,
    totalPrice: 5575,
    firstTermAmount: 1858,  // 秋上（前3讲）
    secondTermAmount: 3717, // 秋下（后续课程）
    paidAmount: 1858,
    status: ORDER_STATUS.RENEW_PENDING,
    createTime: '2025-09-01 10:00:00',
    payTime: '2025-09-01 10:05:00',
    firstTermEndTime: '2026-03-01',
    expireTime: '2026-03-02 12:00:00',
  },
  // 10. 部分支付（秋上已付，秋下未续费）
  {
    id: 'ORD20250915010',
    className: '秋季K2启蒙班',
    productType: 'system',
    level: 'G1A',
    studentName: '张小明',
    schedule: '2025.09.15-2026.01.30 周三、周日 10:00-12:00',
    location: '奥体网球中心校区 302教室',
    teacherName: 'Shirley苡爽',
    sessions: 12,
    totalPrice: 4460,
    firstTermAmount: 1487,
    secondTermAmount: 2973,
    paidAmount: 1487,
    refundAmount: 0,
    status: ORDER_STATUS.PARTIAL_PAID,
    createTime: '2025-09-15 14:00:00',
    payTime: '2025-09-15 14:05:00',
    firstTermEndTime: '2026-02-15',
    expireTime: '2026-02-16 12:00:00',
    exitTime: '2026-02-16 12:00:00',
    exitReason: '秋下续费超时，已退出班级',
  },
  
  // ========== 更多状态的重复示例 ==========
  // 11. 待支付（续报）
  {
    id: 'ORD20260301011',
    className: '秋季K4高阶班（续报）',
    productType: 'system',
    level: 'G3A',
    studentName: '张小明',
    schedule: '2026.09.01-2027.01.15 周二、周六 09:00-11:30',
    location: '同曦校区 301教室',
    teacherName: 'Esther于哲敏',
    sessions: 15,
    totalPrice: 6095,
    paidAmount: 0,
    status: ORDER_STATUS.PENDING,
    createTime: '2026-03-01 08:00:00',
    expireTime: '2026-03-01 08:30:00',
  },
  // 12. 已支付（专项课）
  {
    id: 'ORD20260225012',
    className: '自然拼读强化班',
    productType: 'special',
    level: 'Phonics',
    studentName: '张小明',
    schedule: '2026.03.10-2026.04.28 周二、周四 18:30-20:00',
    location: '同曦校区 205教室',
    teacherName: 'Lily莉莉',
    sessions: 8,
    totalPrice: 2690,
    paidAmount: 2690,
    status: ORDER_STATUS.PAID,
    createTime: '2026-02-25 16:00:00',
    payTime: '2026-02-25 16:05:00',
  },
  // 13. 已取消（手动取消）
  {
    id: 'ORD20260220013',
    className: '阅读写作专项班',
    productType: 'special',
    level: '读写进阶',
    studentName: '张小明',
    schedule: '2026.03.12-2026.05.28 周四、周日 14:00-16:00',
    location: '奥体网球中心校区 201教室',
    teacherName: 'Shirley苡爽',
    sessions: 10,
    totalPrice: 4060,
    paidAmount: 0,
    status: ORDER_STATUS.CANCELLED,
    createTime: '2026-02-20 10:00:00',
    cancelTime: '2026-02-20 10:15:00',
    cancelReason: '用户手动取消订单',
  },
  // 14. 已退款（中途退费）
  {
    id: 'ORD20260101014',
    className: '剑少二级集训班',
    productType: 'special',
    level: '剑少二级',
    studentName: '张小明',
    schedule: '2026.01.05-2026.03.15 周五、周六 18:00-20:00',
    location: '河西万达校区 B202教室',
    teacherName: 'Mia米娅',
    sessions: 12,
    totalPrice: 5460,
    paidAmount: 5460,
    refundAmount: 3640,
    usedSessions: 4,
    status: ORDER_STATUS.REFUNDED,
    createTime: '2026-01-01 09:00:00',
    payTime: '2026-01-01 09:05:00',
    refundTime: '2026-02-10 14:00:00',
    refundReason: '时间冲突，无法继续上课',
  },
  // 15. 待付定金（另一个预售）
  {
    id: 'ORD20260301015',
    className: '寒假K3集训班（预售）',
    productType: 'special',
    level: '寒假集训',
    studentName: '张小明',
    schedule: '2027.01.15-2027.02.15 周一至周五 09:00-11:30',
    location: '同曦校区 201教室',
    teacherName: 'Esther于哲敏',
    sessions: 20,
    totalPrice: 5800,
    depositAmount: 500,
    paidAmount: 0,
    status: ORDER_STATUS.DEPOSIT_PENDING,
    createTime: '2026-03-01 11:00:00',
    expireTime: '2026-03-01 11:30:00',
  },
  // 16. 已付定金（锁单状态 - 管理员锁定）
  {
    id: 'ORD20260225016',
    className: '暑期口语强化班（预售）',
    productType: 'special',
    level: 'Speaking',
    studentName: '张小明',
    schedule: '2026.07.15-2026.08.15 周一至周五 14:00-16:00',
    location: '浦口明发校区 D102教室',
    teacherName: 'Lily莉莉',
    sessions: 20,
    totalPrice: 5200,
    depositAmount: 500,
    paidAmount: 500,
    status: ORDER_STATUS.DEPOSIT_PAID,
    isLocked: true,
    createTime: '2026-02-25 15:00:00',
    depositPayTime: '2026-02-25 15:05:00',
    lockTime: '2026-03-01 10:00:00',
    lockReason: '等待家长确认时间',
  },
  // 17. 待付尾款（锁单状态）
  {
    id: 'ORD20260215017',
    className: '暑期阅读写作班（预售）',
    productType: 'special',
    level: '读写强化',
    studentName: '张小明',
    schedule: '2026.07.01-2026.07.31 周一至周五 10:00-12:00',
    location: '同曦校区 205教室',
    teacherName: 'Shirley苡爽',
    sessions: 20,
    totalPrice: 4800,
    depositAmount: 500,
    balanceAmount: 4300,
    paidAmount: 500,
    status: ORDER_STATUS.BALANCE_PENDING,
    isLocked: true,
    createTime: '2026-02-15 10:00:00',
    depositPayTime: '2026-02-15 10:05:00',
    classOpenTime: '2026-03-01 09:00:00',
    lockTime: '2026-03-01 09:30:00',
    lockReason: '协商延期支付',
  },
  // 18. 已支付（全款预售成功）
  {
    id: 'ORD20260210018',
    className: '春季K1启蒙班（预售）',
    productType: 'system',
    level: 'G0B',
    studentName: '张小明',
    schedule: '2026.02.20-2026.06.10 周六、周日 10:00-12:00',
    location: '江宁百家湖校区 C201教室',
    teacherName: 'Cathy凯西',
    sessions: 15,
    totalPrice: 5075,
    depositAmount: 500,
    balanceAmount: 4575,
    paidAmount: 5075,
    status: ORDER_STATUS.PAID,
    createTime: '2026-02-10 09:00:00',
    depositPayTime: '2026-02-10 09:05:00',
    balancePayTime: '2026-02-18 14:00:00',
  },
  // 19. 待续费（锁单状态）
  {
    id: 'ORD20250901019',
    className: '秋季K4高阶班',
    productType: 'system',
    level: 'G3B',
    studentName: '张小明',
    schedule: '2025.09.01-2026.01.15 周三、周日 14:00-16:30',
    location: '同曦校区 301教室',
    teacherName: 'Esther于哲敏',
    sessions: 15,
    totalPrice: 6095,
    firstTermAmount: 2032,
    secondTermAmount: 4063,
    paidAmount: 2032,
    status: ORDER_STATUS.RENEW_PENDING,
    isLocked: true,
    createTime: '2025-09-01 11:00:00',
    payTime: '2025-09-01 11:05:00',
    firstTermEndTime: '2026-02-28',
    lockTime: '2026-03-01 10:00:00',
    lockReason: '等待家长决定是否续费',
  },
  // 20. 已退款（全额退费 - 开课前）
  {
    id: 'ORD20260220020',
    className: 'K5冲刺班',
    productType: 'special',
    level: '冲刺',
    studentName: '张小明',
    schedule: '2026.03.01-2026.05.30 周六 18:00-20:30',
    location: '河西万达校区 B301教室',
    teacherName: 'Mia米娅',
    sessions: 12,
    totalPrice: 5280,
    paidAmount: 5280,
    refundAmount: 5280,
    usedSessions: 0,
    status: ORDER_STATUS.REFUNDED,
    createTime: '2026-02-20 08:00:00',
    payTime: '2026-02-20 08:05:00',
    refundTime: '2026-02-28 16:00:00',
    refundReason: '班级取消，全额退款',
  },
]

Page({
  data: {
    navBarHeight: 0,
    currentTab: 'all',
    tabs: [
      { label: '全部', value: 'all' },
      { label: '待付款', value: 'pending' },
      { label: '已完成', value: 'completed' },
      { label: '已取消', value: 'closed' },
    ],
    orders: [],
    filteredOrders: [],
  },

  onLoad(options) {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    const tab = options.tab || 'all'
    this.setData(
      {
        navBarHeight: app.globalData.navBarHeight,
        currentTab: tab,
      },
      () => {
        this.loadOrders()
      }
    )
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.loadOrders()
  },

  loadOrders() {
    if (config.useLocalMock) {
      // 使用本地模拟数据
      const orders = this.formatOrders(MOCK_ORDERS)
      this.setData({ orders }, () => {
        this.updateFiltered()
      })
      return
    }

    // 使用真实接口
    wx.showLoading({ title: '加载中...' })
    orderService.getList({ page: 1, pageSize: 50 })
      .then(res => {
        wx.hideLoading()
        if (res.code === 200 && res.data && res.data.list) {
          const apiOrders = res.data.list.map(item => this.mapApiToOrder(item))
          const orders = this.formatOrders(apiOrders)
          this.setData({ orders }, () => {
            this.updateFiltered()
          })
        } else {
          wx.showToast({ title: res.message || '获取订单失败', icon: 'none' })
        }
      })
      .catch(err => {
        wx.hideLoading()
        console.error('获取订单列表失败:', err)
        wx.showToast({ title: err.message || '网络错误', icon: 'none' })
      })
  },

  // 格式化时间：2026-03-15T02:24:44+08:00 -> 2026-03-15 02:24:44
  parseFee(feeStr) {
    if (!feeStr) return 0
    if (typeof feeStr === 'number') return feeStr
    const numStr = String(feeStr).replace(/[^\d.]/g, '')
    return Number(numStr) || 0
  },

  formatDateTime(dateStr) {
    if (!dateStr) return ''
    return dateStr.replace(/T/, ' ').replace(/\+.*/, '').replace(/\..*/, '')
  },

  // 将API返回的订单数据映射为UI需要的格式
  // 用户指定的字段映射:
  // - user_name → studentName
  // - status_name → statusLabel (显示用，不用status)
  // - fee_yuan → totalPrice
  // - sum_lesson_ids.length → sessions
  // - order_no → id
  mapApiToOrder(item) {
    const classInfo = item.class || {}
    
    const sessions = Array.isArray(item.sum_lesson_ids) ? item.sum_lesson_ids.length : 0
    
    const mappedStatus = this.mapApiStatus(item.status, item.status_name)
    
    return {
      id: item.order_no || '',
      order_no: item.order_no || '',
      classId: classInfo.id || item.class_id || '',
      className: classInfo.name || '',
      productType: classInfo.product_type || 'system',
      level: classInfo.level || '',
      studentName: item.user_name || '',
      schedule: classInfo.schedule || '',
      location: classInfo.location || '',
      teacherName: classInfo.teacher_name || '',
      sessions: sessions,
      totalPrice: this.parseFee(item.total_fee_yuan) || this.parseFee(item.fee_yuan) || 0,
      price: this.parseFee(item.real_fee_yuan) || 0,
      materialPrice: this.parseFee(item.assistant_fee_yuan) || 0,
      paidAmount: Number(item.paid_amount) || 0,
      refundAmount: Number(item.refund_amount) || 0,
      status: mappedStatus,
      statusNameFromApi: item.status_name || '',
      createTime: this.formatDateTime(item.created_at) || '',
      payTime: this.formatDateTime(item.paid_at) || '',
      cancelTime: this.formatDateTime(item.cancelled_at) || '',
      cancelReason: item.cancel_reason || '',
      refundTime: this.formatDateTime(item.refund_at) || '',
      refundReason: item.refund_reason || '',
    }
  },

  mapApiStatus(apiStatus, statusName) {
    const statusMap = {
      'pending': ORDER_STATUS.PENDING,
      'unpaid': ORDER_STATUS.PENDING,
      'paid': ORDER_STATUS.PAID,
      'cancelled': ORDER_STATUS.CANCELLED,
      'refunded': ORDER_STATUS.REFUNDED,
      'deposit_pending': ORDER_STATUS.DEPOSIT_PENDING,
      'deposit_paid': ORDER_STATUS.DEPOSIT_PAID,
      'balance_pending': ORDER_STATUS.BALANCE_PENDING,
      'presale_failed': ORDER_STATUS.PRESALE_FAILED,
      'renew_pending': ORDER_STATUS.RENEW_PENDING,
      'partial_paid': ORDER_STATUS.PARTIAL_PAID,
    }
    
    if (apiStatus && statusMap[apiStatus]) {
      return statusMap[apiStatus]
    }
    
    const nameMap = {
      '未支付': ORDER_STATUS.PENDING,
      '待支付': ORDER_STATUS.PENDING,
      '已支付': ORDER_STATUS.PAID,
      '已取消': ORDER_STATUS.CANCELLED,
      '已退款': ORDER_STATUS.REFUNDED,
      '待付定金': ORDER_STATUS.DEPOSIT_PENDING,
      '已付定金': ORDER_STATUS.DEPOSIT_PAID,
      '待付尾款': ORDER_STATUS.BALANCE_PENDING,
      '预售失败': ORDER_STATUS.PRESALE_FAILED,
      '待续费': ORDER_STATUS.RENEW_PENDING,
      '部分支付': ORDER_STATUS.PARTIAL_PAID,
    }
    
    if (statusName && nameMap[statusName]) {
      return nameMap[statusName]
    }
    
    return ORDER_STATUS.PENDING
  },

  formatOrders(orders) {
    return orders.map(order => {
      const config = ORDER_STATUS_CONFIG[order.status] || {}
      return {
        ...order,
        statusLabel: order.statusNameFromApi || config.label || order.status,
        statusTip: config.tip || '',
        statusColor: config.color || '#999999',
        statusGroup: config.group || 'all',
        // 格式化金额
        totalPriceText: `¥${order.totalPrice}`,
        paidAmountText: order.paidAmount ? `¥${order.paidAmount}` : '',
        refundAmountText: order.refundAmount ? `¥${order.refundAmount}` : '',
        // 描述文本
        desc: `${order.sessions}课次 · ${order.productType === 'system' ? '体系课' : '专项课'}`,
        // 是否显示操作按钮
        showPayBtn: [ORDER_STATUS.PENDING, ORDER_STATUS.DEPOSIT_PENDING, ORDER_STATUS.BALANCE_PENDING, ORDER_STATUS.RENEW_PENDING].includes(order.status),
        payBtnText: this.getPayBtnText(order.status),
      }
    })
  },

  getPayBtnText(status) {
    const map = {
      [ORDER_STATUS.PENDING]: '去支付',
      [ORDER_STATUS.DEPOSIT_PENDING]: '付定金',
      [ORDER_STATUS.BALANCE_PENDING]: '付尾款',
      [ORDER_STATUS.RENEW_PENDING]: '续费',
    }
    return map[status] || '支付'
  },

  updateFiltered() {
    const { currentTab, orders } = this.data
    let filtered = orders
    
    if (currentTab === 'pending') {
      filtered = orders.filter(o => o.statusGroup === 'pending')
    } else if (currentTab === 'completed') {
      filtered = orders.filter(o => o.statusGroup === 'completed')
    } else if (currentTab === 'closed') {
      filtered = orders.filter(o => o.statusGroup === 'closed')
    }
    
    // 按创建时间倒序排列
    filtered.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
    
    this.setData({ filteredOrders: filtered })
  },

  onTabChange(e) {
    const value = e.currentTarget.dataset.value
    this.setData({ currentTab: value }, () => {
      this.updateFiltered()
    })
  },

  onOrderTap(e) {
    const { id } = e.currentTarget.dataset
    const order = this.data.orders.find(o => o.id === id)
    
    if (order) {
      const app = getApp()
      app.globalData.pendingClassInfo = {
        classId: order.classId,
        name: order.className,
        productType: order.productType,
        productTypeName: order.productType === 'system' ? '体系课' : '专项课',
        level: order.level,
        schedule: order.schedule,
        location: order.location,
        teacherName: order.teacherName,
        totalSessions: order.sessions,
        price: order.price,
        materialPrice: order.materialPrice,
        totalPrice: order.totalPrice
      }
    }
    
    wx.navigateTo({ url: `/pages/order/detail?id=${id}&fromList=true` })
  },

  onPayTap(e) {
    const { id } = e.currentTarget.dataset
    const order = this.data.orders.find(o => o.id === id)

    if (order) {
      const app = getApp()
      app.globalData.pendingClassInfo = {
        classId: order.classId,
        name: order.className,
        productType: order.productType,
        productTypeName: order.productType === 'system' ? '体系课' : '专项课',
        level: order.level,
        schedule: order.schedule,
        location: order.location,
        teacherName: order.teacherName,
        totalSessions: order.sessions,
        price: order.price,
        materialPrice: order.materialPrice,
        totalPrice: order.totalPrice,
      }
    }

    wx.navigateTo({ url: `/pages/order/detail?id=${id}&fromList=true&action=pay` })
  },
})
