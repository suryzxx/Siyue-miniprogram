const { myClassService } = require('../../../services/my-class.js')

Page({
  data: {
    navBarHeight: 0,
    loading: true,
    classId: '',
    classInfo: {},
    refundInfo: {},
    reason: '',
    submitting: false,
    hasRefundApplication: false,
    refundApplication: null
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
    this.loadRefundInfo(options.id)
  },

  async loadRefundInfo(classId) {
    const app = getApp()
    const currentStudent = app.getCurrentStudent()
    
    this.setData({ loading: true })
    try {
      const res = await myClassService.getRefundInfo(classId, {
        studentId: currentStudent?.id || app.globalData.currentStudentId
      })
      if (res.code === 200 && res.data) {
        // API返回 classInfo 和 paymentInfo
        const classInfo = res.data.classInfo
        const refundInfo = res.data.paymentInfo || res.data.refundInfo || {}
        this.setData({
          classInfo: this.formatClassInfo(classInfo),
          refundInfo: this.formatRefundInfo(refundInfo),
          loading: false
        })
        
        // 检查是否有退班申请
        this.checkRefundApplication()
      } else {
        throw new Error(res.message || '加载失败')
      }
    } catch (e) {
      console.error('加载退班信息失败:', e)
      // 使用模拟数据
      this.setData({
        classInfo: this.getMockClassInfo(),
        refundInfo: this.getMockRefundInfo(),
        loading: false
      })
    }
  },

  formatClassInfo(classInfo) {
    return {
      ...classInfo,
      displayName: classInfo.name,
      displayCampus: classInfo.campus?.name || '',
      displayTeacher: classInfo.mainTeacher?.name || '',
      displaySchedule: classInfo.schedule || '',
      progressText: classInfo.currentSession ? `第${classInfo.currentSession}讲` : '未开始'
    }
  },

  formatRefundInfo(refundInfo) {
    return {
      ...refundInfo,
      // 格式化金额显示
      totalPriceText: `¥${refundInfo.totalPrice?.toFixed(2) || '0.00'}`,
      pricePerSessionText: `¥${refundInfo.pricePerSession?.toFixed(2) || '0.00'}`,
      refundableAmountText: `¥${refundInfo.refundableAmount?.toFixed(2) || '0.00'}`,
      refundFeeText: refundInfo.refundFee > 0 ? `¥${refundInfo.refundFee.toFixed(2)}` : '无',
      finalRefundAmountText: `¥${refundInfo.finalRefundAmount?.toFixed(2) || '0.00'}`,
      // 进度显示
      sessionsText: `已上${refundInfo.attendedSessions || 0}讲，剩余${refundInfo.remainingSessions || 0}讲`
    }
  },

  getMockClassInfo() {
    return this.formatClassInfo({
      id: 'class-001',
      name: 'K3进阶一班',
      campus: { id: 'campus-001', name: '同曦校区' },
      mainTeacher: { id: 'teacher-001', name: 'Esther于哲敏' },
      schedule: '2026.03.07-2026.06.20 周二、周六 12:00-14:30',
      currentSession: 6,
      totalSessions: 15
    })
  },

  getMockRefundInfo() {
    return this.formatRefundInfo({
      totalSessions: 15,
      attendedSessions: 5,
      remainingSessions: 10,
      totalPrice: 5475.00,
      pricePerSession: 365.00,
      refundableAmount: 3650.00,
      refundFee: 365.00,
      finalRefundAmount: 3285.00
    })
  },

  checkRefundApplication() {
    // 这里应该调用API检查是否有退班申请
    // 暂时使用模拟数据
    const hasApplication = false
    this.setData({
      hasRefundApplication: hasApplication,
      refundApplication: hasApplication ? {
        id: 'refund-001',
        status: 'pending',
        applyTime: '2026-02-25 14:30:00',
        reason: '个人原因',
        refundAmount: 3285.00,
        statusText: '审核中'
      } : null
    })
  },

  onReasonInput(e) {
    this.setData({
      reason: e.detail.value
    })
  },

  async onSubmit() {
    const { classId, reason, refundInfo, submitting } = this.data
    
    if (!reason.trim()) {
      wx.showToast({
        title: '请输入退班原因',
        icon: 'none'
      })
      return
    }

    if (submitting) return

    // 显示确认对话框
    wx.showModal({
      title: '确认退班',
      content: `确定要申请退班吗？\n\n退班信息：\n- 已上课次：${refundInfo.attendedSessions || 0}讲\n- 剩余课次：${refundInfo.remainingSessions || 0}讲\n- 可退金额：${refundInfo.refundableAmountText}\n- 退班手续费：${refundInfo.refundFeeText}\n- 实际退款：${refundInfo.finalRefundAmountText}\n\n退班后该班级名额将释放给其他学员。`,
      confirmText: '确认退班',
      cancelText: '再想想',
      success: async (res) => {
        if (res.confirm) {
          this.setData({ submitting: true })
          wx.showLoading({ title: '提交中...', mask: true })

          try {
            const app = getApp()
            const currentStudent = app.getCurrentStudent()
            
            const refundRes = await myClassService.applyRefund(classId, {
              studentId: currentStudent.id,
              reason: reason,
              refundAmount: refundInfo.finalRefundAmount || 0
            })

            wx.hideLoading()

            if (refundRes.code === 200) {
              wx.showToast({
                title: '退班申请已提交',
                icon: 'success'
              })

              // 更新页面状态
              this.setData({
                hasRefundApplication: true,
                refundApplication: {
                  id: refundRes.data.refundId,
                  status: 'pending',
                  applyTime: new Date().toLocaleString(),
                  reason: reason,
                  refundAmount: refundInfo.finalRefundAmount || 0,
                  statusText: '审核中'
                },
                submitting: false
              })
            } else {
              wx.showToast({
                title: refundRes.message || '退班申请失败',
                icon: 'none'
              })
              this.setData({ submitting: false })
            }
          } catch (e) {
            wx.hideLoading()
            console.error('提交退班申请失败:', e)
            wx.showToast({
              title: '提交失败，请重试',
              icon: 'none'
            })
            this.setData({ submitting: false })
          }
        }
      }
    })
  },

  async onCancelRefund() {
    const { classId, refundApplication, submitting } = this.data
    
    if (submitting) return

    wx.showModal({
      title: '确认撤销',
      content: '确定要撤销退班申请吗？',
      confirmText: '确认撤销',
      cancelText: '取消',
      success: async (res) => {
        if (res.confirm) {
          this.setData({ submitting: true })
          wx.showLoading({ title: '撤销中...', mask: true })

          try {
            const app = getApp()
            const currentStudent = app.getCurrentStudent()
            
            const cancelRes = await myClassService.cancelRefund(classId, {
              studentId: currentStudent.id
            })

            wx.hideLoading()

            if (cancelRes.code === 200) {
              wx.showToast({
                title: '已撤销退班申请',
                icon: 'success'
              })

              // 更新页面状态
              this.setData({
                hasRefundApplication: false,
                refundApplication: null,
                submitting: false
              })
            } else {
              wx.showToast({
                title: cancelRes.message || '撤销失败',
                icon: 'none'
              })
              this.setData({ submitting: false })
            }
          } catch (e) {
            wx.hideLoading()
            console.error('撤销退班申请失败:', e)
            wx.showToast({
              title: '撤销失败，请重试',
              icon: 'none'
            })
            this.setData({ submitting: false })
          }
        }
      }
    })
  },

  onBack() {
    wx.navigateBack()
  }
})