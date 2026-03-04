const { myClassService } = require('../../../services/my-class.js')

Page({
  data: {
    navBarHeight: 0,
    loading: true,
    classId: '',
    currentClass: {},
    transferOptions: [],
    selectedOption: null,
    reason: '',
    submitting: false,
    applyResult: null // 申请结果
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
    this.loadTransferOptions(options.id)
  },

  async loadTransferOptions(classId) {
    const app = getApp()
    const currentStudent = app.getCurrentStudent()
    
    console.log('[transfer.js] classId:', classId)
    console.log('[transfer.js] currentStudent:', currentStudent)
    
    this.setData({ loading: true })
    try {
      const res = await myClassService.getTransferOptions(classId, {
        studentId: currentStudent?.id || app.globalData.currentStudentId
      })
      
      console.log('[transfer.js] API响应:', res)
      console.log('[transfer.js] 调用的接口: /myclasses/' + classId + '/transfer-option')
      
      if (res.code === 200 && res.data) {
        // API返回的是 options，不是 transferOptions
        const options = res.data.options || res.data.transferOptions || []
        this.setData({
          currentClass: this.formatClassInfo(res.data.currentClass),
          transferOptions: this.formatTransferOptions(options),
          loading: false
        })
      } else {
        throw new Error(res.message || '加载失败')
      }
    } catch (e) {
      console.error('加载转班选项失败:', e)
      // 使用模拟数据
      this.setData({
        currentClass: this.getMockCurrentClass(),
        transferOptions: this.getMockTransferOptions(),
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

  formatTransferOptions(options) {
    return options.map(item => ({
      ...item,
      displayName: item.name,
      displayCampus: item.campus?.name || '',
      displayTeacher: item.mainTeacher?.name || '',
      displaySchedule: item.schedule || '',
      progressText: item.currentSession ? `第${item.currentSession}讲` : '未开始',
      seatsText: item.availableSeats ? `剩余${item.availableSeats}名额` : '已满员',
      feeText: item.transferFee > 0 ? `转班费: ¥${item.transferFee.toFixed(2)}` : '免费转班'
    }))
  },

  getMockCurrentClass() {
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

  getMockTransferOptions() {
    return this.formatTransferOptions([
      {
        id: 'class-003',
        name: 'K3进阶二班',
        campus: { id: 'campus-001', name: '同曦校区' },
        mainTeacher: { id: 'teacher-001', name: 'Esther于哲敏' },
        schedule: '2026.03.07-2026.06.20 周二、周六 14:50-16:50',
        currentSession: 6,
        availableSeats: 3,
        transferFee: 0,
        canTransfer: true
      },
      {
        id: 'class-004',
        name: 'K3进阶三班',
        campus: { id: 'campus-002', name: '奥体网球中心校区' },
        mainTeacher: { id: 'teacher-002', name: 'Shirley苡爽' },
        schedule: '2026.03.10-2026.06.25 周三、周日 10:00-12:00',
        currentSession: 5,
        availableSeats: 2,
        transferFee: 100,
        canTransfer: true
      },
      {
        id: 'class-005',
        name: 'K3进阶四班',
        campus: { id: 'campus-001', name: '同曦校区' },
        mainTeacher: { id: 'teacher-003', name: 'Tom王明' },
        schedule: '2026.03.07-2026.06.20 周一、周四 16:00-18:00',
        currentSession: 6,
        availableSeats: 0,
        transferFee: 0,
        canTransfer: false
      }
    ])
  },

  onOptionSelect(e) {
    const { index } = e.currentTarget.dataset
    const option = this.data.transferOptions[index]
    
    if (!option.canTransfer) {
      wx.showToast({
        title: '该班级已满员，无法转班',
        icon: 'none'
      })
      return
    }

    this.setData({
      selectedOption: option
    })
  },

  onReasonInput(e) {
    this.setData({
      reason: e.detail.value
    })
  },

  async onSubmit() {
    const { classId, selectedOption, reason, submitting } = this.data
    
    if (!selectedOption) {
      wx.showToast({
        title: '请选择要转入的班级',
        icon: 'none'
      })
      return
    }

    if (!reason.trim()) {
      wx.showToast({
        title: '请输入转班原因',
        icon: 'none'
      })
      return
    }

    if (submitting) return

    // 显示确认对话框
    wx.showModal({
      title: '确认转班',
      content: `确定要从【${this.data.currentClass.displayName}】转到【${selectedOption.displayName}】吗？${selectedOption.transferFee > 0 ? `\n需要支付转班费：¥${selectedOption.transferFee.toFixed(2)}` : ''}`,
      confirmText: '确认转班',
      cancelText: '再想想',
      success: async (res) => {
        if (res.confirm) {
          this.setData({ submitting: true })
          wx.showLoading({ title: '提交中...', mask: true })

          try {
            const app = getApp()
            const currentStudent = app.getCurrentStudent()
            
            const transferRes = await myClassService.applyTransfer(classId, {
              studentId: currentStudent.id,
              targetClassId: selectedOption.id,
              reason: reason
            })

            wx.hideLoading()

            if (transferRes.code === 200) {
              // 保存申请结果，包含班级名称
              const applyResult = {
                ...transferRes.data,
                targetClassName: selectedOption.displayName
              }
              
              this.setData({ 
                applyResult,
                submitting: false 
              })
              
              wx.showToast({
                title: '转班申请已提交',
                icon: 'success'
              })
            } else {
              wx.showToast({
                title: transferRes.message || '转班申请失败',
                icon: 'none'
              })
              this.setData({ submitting: false })
            }
          } catch (e) {
            wx.hideLoading()
            console.error('提交转班申请失败:', e)
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

  onBack() {
    wx.navigateBack()
  }
})