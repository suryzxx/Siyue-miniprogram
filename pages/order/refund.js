Page({
  data: {
    navBarHeight: 0,
    refund: {
      price: '¥5475.00',
      paid: '¥5475.00',
      usedLessons: 2,
      perLesson: 365,
      refundAmount: '¥0.00',
      reason: '',
    },
  },
  onLoad(options) {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    this.setData({
      navBarHeight: app.globalData.navBarHeight,
    })
    console.log('退款申请', options)
    this.updateRefundAmount()
  },
  updateRefundAmount() {
    const { paid, usedLessons, perLesson } = this.data.refund
    const paidNumber = Number(String(paid).replace(/[^\d.]/g, '')) || 0
    const refundAmount = Math.max(paidNumber - usedLessons * perLesson, 0)
    this.setData({
      'refund.refundAmount': `¥${refundAmount.toFixed(2)}`,
    })
  },
  onReasonInput(e) {
    this.setData({ 'refund.reason': e.detail.value })
  },
  onSubmit() {
    console.log('提交退款', this.data.refund)
  },
})
