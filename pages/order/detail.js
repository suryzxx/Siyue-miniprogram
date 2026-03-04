const { ORDER_STATUS, ORDER_STATUS_CONFIG } = require('../../utils/status')

// 模拟订单数据
const MOCK_ORDERS_DATA = {
  'ORD20260301001': {
    id: 'ORD20260301001',
    className: 'K3进阶一班',
    productType: 'system',
    productTypeName: '体系课',
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
  'ORD20260228002': {
    id: 'ORD20260228002',
    className: 'K2启蒙二班',
    productType: 'system',
    productTypeName: '体系课',
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
  'ORD20260225003': {
    id: 'ORD20260225003',
    className: '剑少一级周末班',
    productType: 'special',
    productTypeName: '专项课',
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
  'ORD20260210004': {
    id: 'ORD20260210004',
    className: 'K1基础一班',
    productType: 'system',
    productTypeName: '体系课',
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
  'ORD20260301005': {
    id: 'ORD20260301005',
    className: '暑期K3集训班（预售）',
    productType: 'special',
    productTypeName: '专项课',
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
  'ORD20260228006': {
    id: 'ORD20260228006',
    className: '暑期K2启蒙班（预售）',
    productType: 'system',
    productTypeName: '体系课',
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
  'ORD20260220007': {
    id: 'ORD20260220007',
    className: '暑期K4高阶班（预售）',
    productType: 'system',
    productTypeName: '体系课',
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
  'ORD20260215008': {
    id: 'ORD20260215008',
    className: '春季K5冲刺班（预售）',
    productType: 'special',
    productTypeName: '专项课',
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
  'ORD20250901009': {
    id: 'ORD20250901009',
    className: '秋季K3进阶班',
    productType: 'system',
    productTypeName: '体系课',
    level: 'G2A',
    studentName: '张小明',
    schedule: '2025.09.01-2026.01.15 周二、周六 12:00-14:30',
    location: '同曦校区 201教室',
    teacherName: 'Esther于哲敏',
    sessions: 15,
    totalPrice: 5575,
    firstTermAmount: 1858,
    secondTermAmount: 3717,
    paidAmount: 1858,
    status: ORDER_STATUS.RENEW_PENDING,
    createTime: '2025-09-01 10:00:00',
    payTime: '2025-09-01 10:05:00',
    firstTermEndTime: '2026-03-01',
    expireTime: '2026-03-02 12:00:00',
  },
  'ORD20250915010': {
    id: 'ORD20250915010',
    className: '秋季K2启蒙班',
    productType: 'system',
    productTypeName: '体系课',
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
    status: ORDER_STATUS.PARTIAL_PAID,
    createTime: '2025-09-15 14:00:00',
    payTime: '2025-09-15 14:05:00',
    firstTermEndTime: '2026-02-15',
    exitTime: '2026-02-16 12:00:00',
    exitReason: '秋下续费超时，已退出班级',
  },
}

Page({
  data: {
    navBarHeight: 0,
    loading: true,
    orderId: '',
    order: {},
    action: '',
  },

  onLoad(options) {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    this.setData({
      navBarHeight: app.globalData.navBarHeight,
      orderId: options.id || '',
      action: options.action || '',
    })
    this.loadOrderDetail(options.id)
  },

  loadOrderDetail(id) {
    this.setData({ loading: true })
    
    setTimeout(() => {
      const data = MOCK_ORDERS_DATA[id] || Object.values(MOCK_ORDERS_DATA)[0]
      const order = this.formatOrder(data)
      
      this.setData({
        order,
        loading: false,
      })
    }, 300)
  },

  formatOrder(data) {
    const config = ORDER_STATUS_CONFIG[data.status] || {}
    
    let pendingAmount = 0
    let payBtnText = '立即支付'
    
    if (data.status === ORDER_STATUS.PENDING) {
      pendingAmount = data.totalPrice - (data.paidAmount || 0)
      payBtnText = '立即支付'
    } else if (data.status === ORDER_STATUS.DEPOSIT_PENDING) {
      pendingAmount = data.depositAmount
      payBtnText = '支付定金'
    } else if (data.status === ORDER_STATUS.BALANCE_PENDING) {
      pendingAmount = data.balanceAmount
      payBtnText = '支付尾款'
    } else if (data.status === ORDER_STATUS.RENEW_PENDING) {
      pendingAmount = data.secondTermAmount
      payBtnText = '续费'
    }
    
    return {
      ...data,
      statusLabel: config.label || data.status,
      statusTip: config.tip || '',
      statusColor: config.color || '#999999',
      totalPriceText: `¥${data.totalPrice}`,
      paidAmountText: data.paidAmount ? `¥${data.paidAmount}` : '-',
      pendingAmount,
      pendingAmountText: pendingAmount ? `¥${pendingAmount}` : '',
      refundAmountText: data.refundAmount ? `¥${data.refundAmount}` : '',
      depositAmountText: data.depositAmount ? `¥${data.depositAmount}` : '',
      balanceAmountText: data.balanceAmount ? `¥${data.balanceAmount}` : '',
      firstTermAmountText: data.firstTermAmount ? `¥${data.firstTermAmount}` : '',
      secondTermAmountText: data.secondTermAmount ? `¥${data.secondTermAmount}` : '',
      payBtnText,
      showPayBtn: pendingAmount > 0 && [ORDER_STATUS.PENDING, ORDER_STATUS.DEPOSIT_PENDING, ORDER_STATUS.BALANCE_PENDING, ORDER_STATUS.RENEW_PENDING].includes(data.status),
      showCancelBtn: [ORDER_STATUS.PENDING, ORDER_STATUS.DEPOSIT_PENDING].includes(data.status),
      isLocked: data.isLocked || false,
    }
  },

  onPay() {
    const { order } = this.data
    
    let amountText = order.pendingAmountText
    let title = '确认支付'
    
    if (order.status === ORDER_STATUS.DEPOSIT_PENDING) {
      title = '支付定金'
    } else if (order.status === ORDER_STATUS.BALANCE_PENDING) {
      title = '支付尾款'
    } else if (order.status === ORDER_STATUS.RENEW_PENDING) {
      title = '续费'
    }
    
    wx.showModal({
      title: title,
      content: `确认支付 ${amountText}？`,
      confirmText: '确认支付',
      success: (res) => {
        if (res.confirm) {
          this.doPay()
        }
      },
    })
  },

  doPay() {
    const { order } = this.data
    
    wx.showLoading({ title: '支付中...', mask: true })
    
    setTimeout(() => {
      wx.hideLoading()
      wx.redirectTo({
        url: `/pages/order/pay-success?orderId=${order.id}`,
      })
    }, 1500)
  },

  onCancel() {
    const { order } = this.data
    
    wx.showModal({
      title: '确认取消',
      content: '确定要取消此订单吗？',
      confirmText: '确认取消',
      confirmColor: '#ff4d6a',
      success: (res) => {
        if (res.confirm) {
          this.doCancel()
        }
      },
    })
  },

  doCancel() {
    wx.showLoading({ title: '取消中...', mask: true })
    
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({ title: '订单已取消', icon: 'success' })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }, 1000)
  },

  onCopyOrderId() {
    const { order } = this.data
    wx.setClipboardData({
      data: order.id,
      success: () => {
        wx.showToast({ title: '已复制', icon: 'success' })
      }
    })
  },
})
