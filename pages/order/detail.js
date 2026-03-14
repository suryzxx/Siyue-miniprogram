const { ORDER_STATUS, ORDER_STATUS_CONFIG } = require('../../utils/status')
const { orderService } = require('../../services/order')
const { config } = require('../../utils/config')

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
    pendingPayment: null,
  },

  onLoad(options) {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    
    const pendingPayment = app.globalData.pendingPayment
    const pendingClassInfo = app.globalData.pendingClassInfo
    
    this.setData({
      navBarHeight: app.globalData.navBarHeight,
      orderId: options.id || '',
      action: options.action || '',
      pendingPayment: pendingPayment,
    })
    
    if (pendingPayment) {
      app.globalData.pendingPayment = null
    }
    if (pendingClassInfo) {
      app.globalData.pendingClassInfo = null
    }
    
    const fromClassDetail = options.fromClassDetail === 'true' || options.fromList === 'true'
    this.loadOrderDetail(options.id, fromClassDetail, pendingClassInfo)
  },

  loadOrderDetail(id, fromClassDetail, pendingClassInfo) {
    this.setData({ loading: true })

    if (config.useLocalMock) {
      setTimeout(() => {
        const data = MOCK_ORDERS_DATA[id] || Object.values(MOCK_ORDERS_DATA)[0]
        const order = this.formatOrder(data)
        this.setData({ order, loading: false })
      }, 300)
      return
    }

    
    const { classService } = require('../../services/class')
    
    orderService.getDetail(id)
      .then(res => {
        if (res.code === 200 && res.data) {
          let apiData = this.mapApiToOrder(res.data)
          const classId = apiData.classId
          
          // 如果从订单列表进入且有 classId, 调用班级详情 API 获取完整信息
          if (fromClassDetail && classId) {
            return classService.getOpenDetail(classId).then(classRes => {
              if (classRes.code === 200 && classRes.data) {
                const classDetail = classRes.data
                apiData = {
                  ...apiData,
                  className: classDetail.name || apiData.className,
                  productTypeName: classDetail.course_class_type_name || (classDetail.course_class_type === 0 ? '体系课' : '专项课') || apiData.productTypeName,
                  level: classDetail.course_sub_category_name || apiData.level,
                  schedule: this.formatSchedule(classDetail) || apiData.schedule,
                  location: this.formatLocation(classDetail) || apiData.location,
                  teacherName: classDetail.teacher_name || apiData.teacherName,
                  sessions: classDetail.sum_lesson_num || apiData.sessions,
                }
              }
              
              const order = this.formatOrder(apiData)
              this.setData({ order, loading: false })
            }).catch(err => {
              console.error('获取班级详情失败:', err)
              const order = this.formatOrder(apiData)
              this.setData({ order, loading: false })
            })
          } else if (pendingClassInfo) {
            // 如果没有 classId 但有 pendingClassInfo, 使用传递过来的数据
            apiData = {
              ...apiData,
              classId: pendingClassInfo.classId || apiData.classId,
              className: pendingClassInfo.name || apiData.className,
              productTypeName: pendingClassInfo.productTypeName || apiData.productTypeName,
              level: pendingClassInfo.level || apiData.level,
              schedule: pendingClassInfo.schedule || apiData.schedule,
              location: pendingClassInfo.location || apiData.location,
              teacherName: pendingClassInfo.teacherName || apiData.teacherName,
              sessions: pendingClassInfo.totalSessions || apiData.sessions,
              price: pendingClassInfo.price ?? apiData.price,
              materialPrice: pendingClassInfo.materialPrice ?? apiData.materialPrice,
              totalPrice: pendingClassInfo.totalPrice ?? apiData.totalPrice,
            }
          }
          
          const order = this.formatOrder(apiData)
          this.setData({ order, loading: false })
        } else {
          wx.showToast({ title: res.message || '获取订单失败', icon: 'none' })
          this.setData({ loading: false })
        }
      })
      .catch(err => {
        console.error('获取订单详情失败:', err)
        wx.showToast({ title: err.message || '网络错误', icon: 'none' })
        this.setData({ loading: false })
      })
  },

  formatSchedule(data) {
    const timeParts = []
    if (data.first_in_class_time && data.first_out_class_time) {
      const dateStr = data.first_in_class_time.substring(0, 10).replace(/-/g, '.')
      const startTime = data.first_in_class_time.substring(11, 16)
      const endTime = data.first_out_class_time.substring(11, 16)
      timeParts.push(dateStr + ' ' + startTime + '-' + endTime)
    }
    if (data.class_days) {
      const weekDayMap = { Mon: '周一', Tue: '周二', Wed: '周三', Thu: '周四', Fri: '周五', Sat: '周六', Sun: '周日' }
      let daysArray = data.class_days
      if (typeof daysArray === 'string') {
        try {
          const parsed = JSON.parse(daysArray)
          if (Array.isArray(parsed)) daysArray = parsed
        } catch (e) {
          daysArray = daysArray.split(',')
        }
      }
      if (Array.isArray(daysArray)) {
        const daysStr = daysArray.filter(d => d).map(d => weekDayMap[d.trim ? d.trim() : d] || d).join('、')
        if (daysStr) timeParts.push(daysStr)
      }
    }
    return timeParts.join(' ')
  },

  formatLocation(data) {
    const locationParts = []
    if (data.campus_city_name) locationParts.push(data.campus_city_name)
    if (data.campus_area_name) locationParts.push(data.campus_area_name)
    if (data.campus_name) locationParts.push(data.campus_name)
    if (data.class_room_name) locationParts.push(data.class_room_name)
    return locationParts.join(' ')
  },

  // 格式化时间：2026-03-15T02:24:44+08:00 -> 2026-03-15 02:24:44
  formatDateTime(dateStr) {
    if (!dateStr) return ''
    // 移除时区信息并替换T为空格
    return dateStr.replace(/T/, ' ').replace(/\+.*/, '').replace(/\..*/, '')
  },

  // 解析费用字符串（如 "¥1.23"）为数字
  parseFee(feeStr) {
    if (!feeStr) return 0
    if (typeof feeStr === 'number') return feeStr
    // 移除 ¥ 符号和其他非数字字符，只保留数字和小数点
    const numStr = String(feeStr).replace(/[^\d.]/g, '')
    return Number(numStr) || 0
  },

  // 将API返回的数据映射为页面需要的格式
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
      
      className: classInfo.name || '',
      productType: classInfo.product_type || 'system',
      productTypeName: classInfo.product_type === 'special' ? '专项课' : '体系课',
      level: classInfo.level || '',
      schedule: classInfo.schedule || '',
      location: classInfo.location || '',
      teacherName: classInfo.teacher_name || '',
      
      studentName: item.user_name || '',
      
      sessions: sessions,
      
      totalPrice: this.parseFee(item.total_fee_yuan) || this.parseFee(item.fee_yuan) || 0,
      price: this.parseFee(item.real_fee_yuan) || 0,
      materialPrice: this.parseFee(item.assistant_fee_yuan) || 0,
      paidAmount: Number(item.paid_amount) || 0,
      refundAmount: Number(item.refund_amount) || 0,
      depositAmount: Number(item.deposit_amount) || 0,
      balanceAmount: Number(item.balance_amount) || 0,
      firstTermAmount: Number(item.first_term_amount) || 0,
      secondTermAmount: Number(item.second_term_amount) || 0,
      usedSessions: Number(item.used_sessions) || 0,
      
      status: mappedStatus,
      statusNameFromApi: item.status_name || '',
      
      createTime: this.formatDateTime(item.created_at) || '',
      payTime: this.formatDateTime(item.paid_at) || '',
      cancelTime: this.formatDateTime(item.cancelled_at) || '',
      cancelReason: item.cancel_reason || '',
      refundTime: this.formatDateTime(item.refund_at) || '',
      refundReason: item.refund_reason || '',
      depositPayTime: this.formatDateTime(item.deposit_paid_at) || '',
      failTime: this.formatDateTime(item.fail_time) || '',
      failReason: item.fail_reason || '',
      exitTime: this.formatDateTime(item.exit_time) || '',
      exitReason: item.exit_reason || '',
      
      classId: classInfo.id || item.class_id || '',
      
      isLocked: item.is_locked || false,
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
      statusLabel: data.statusNameFromApi || config.label || data.status,
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
    this.doPay()
  },

  async doPay() {
    const { order, pendingPayment } = this.data
    
    let payment = pendingPayment
    
    if (!payment) {
      if (!order.classId) {
        wx.showToast({ title: '缺少班级信息，无法支付', icon: 'none' })
        return
      }
      
      wx.showLoading({ title: '获取支付信息...', mask: true })
      
      try {
        const loginRes = await new Promise((resolve, reject) => {
          wx.login({ success: resolve, fail: reject })
        })
        
        const payRes = await orderService.create({
          classId: order.classId,
          code: loginRes.code
        })
        
        wx.hideLoading()
        
        if (payRes.code === 200 && payRes.data) {
          payment = {
            orderNo: payRes.data.order_no,
            timeStamp: payRes.data.time_stamp,
            nonceStr: payRes.data.nonce_str,
            package: payRes.data.package,
            signType: payRes.data.sign_type || 'RSA',
            paySign: payRes.data.pay_sign,
          }
        } else {
          wx.showToast({ title: payRes.msg || payRes.message || '获取支付信息失败', icon: 'none' })
          return
        }
      } catch (e) {
        wx.hideLoading()
        console.error('获取支付信息失败:', e)
        wx.showToast({ title: '获取支付信息失败', icon: 'none' })
        return
      }
    }
    
    wx.showLoading({ title: '发起支付...', mask: true })
    
    wx.requestPayment({
      timeStamp: payment.timeStamp,
      nonceStr: payment.nonceStr,
      package: payment.package,
      signType: payment.signType,
      paySign: payment.paySign,
      success: () => {
        wx.hideLoading()
        wx.showToast({ title: '支付成功', icon: 'success' })
        setTimeout(() => {
          wx.redirectTo({
            url: `/pages/order/pay-success?orderId=${order.id}`,
          })
        }, 1500)
      },
      fail: (err) => {
        wx.hideLoading()
        console.error('支付失败:', err)
        
        if (err.errMsg && err.errMsg.includes('cancel')) {
          wx.showToast({ title: '支付已取消', icon: 'none' })
        } else {
          wx.showToast({ title: err.errMsg || '支付失败', icon: 'none' })
        }
      }
    })
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
