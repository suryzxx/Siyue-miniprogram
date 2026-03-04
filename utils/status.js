const ORDER_STATUS = {
  // 正常报名流程
  PENDING: 'pending',           // 待支付（30分钟）
  PAID: 'paid',                 // 已支付
  CANCELLED: 'cancelled',       // 已取消
  REFUNDED: 'refunded',         // 已退款
  
  // 预售流程
  DEPOSIT_PENDING: 'deposit_pending',   // 待付定金（30分钟）
  DEPOSIT_PAID: 'deposit_paid',         // 已付定金，等待开班
  BALANCE_PENDING: 'balance_pending',   // 待付尾款（24小时）
  PRESALE_FAILED: 'presale_failed',     // 预售失败（自动退定金）
  
  // 分期流程
  RENEW_PENDING: 'renew_pending',       // 待续费（秋下，24小时）
  PARTIAL_PAID: 'partial_paid',         // 部分支付（秋上已付，秋下未付，退出班级）
}

// 订单状态显示配置
const ORDER_STATUS_CONFIG = {
  [ORDER_STATUS.PENDING]: {
    label: '待支付',
    tip: '请在30分钟内完成支付，超时订单将自动取消',
    color: '#ff8c00',
    group: 'pending',
  },
  [ORDER_STATUS.PAID]: {
    label: '已支付',
    tip: '订单已完成支付',
    color: '#10b981',
    group: 'completed',
  },
  [ORDER_STATUS.CANCELLED]: {
    label: '已取消',
    tip: '订单已取消',
    color: '#999999',
    group: 'closed',
  },
  [ORDER_STATUS.REFUNDED]: {
    label: '已退款',
    tip: '退款已完成',
    color: '#6b4ce6',
    group: 'closed',
  },
  [ORDER_STATUS.DEPOSIT_PENDING]: {
    label: '待付定金',
    tip: '请在30分钟内支付定金锁定名额',
    color: '#ff8c00',
    group: 'pending',
  },
  [ORDER_STATUS.DEPOSIT_PAID]: {
    label: '已付定金',
    tip: '定金已支付，等待班级开班',
    color: '#3b82f6',
    group: 'pending',
  },
  [ORDER_STATUS.BALANCE_PENDING]: {
    label: '待付尾款',
    tip: '班级已开班，请在24小时内支付尾款',
    color: '#ff8c00',
    group: 'pending',
  },
  [ORDER_STATUS.PRESALE_FAILED]: {
    label: '预售失败',
    tip: '未达到开班人数，定金已自动退还',
    color: '#999999',
    group: 'closed',
  },
  [ORDER_STATUS.RENEW_PENDING]: {
    label: '待续费',
    tip: '秋上课程已结束，请在24小时内续费秋下',
    color: '#ff8c00',
    group: 'pending',
  },
  [ORDER_STATUS.PARTIAL_PAID]: {
    label: '部分支付',
    tip: '秋上课程费用已支付，秋下未续费已退出班级',
    color: '#ef4444',
    group: 'closed',
  },
}

const WAITLIST_STATUS = {
  PENDING: 'pending',
  NOTIFIED: 'notified',
  CONFIRMED: 'confirmed',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
  FAILED: 'failed',
}

const ASSESS_STATUS = {
  UNASSESSED: 'unassessed',
  ASSESSED: 'assessed',
}

const CLASS_STATUS = {
  OPEN: 'open',
  FULL: 'full',
  CLOSED: 'closed',
}

const ENROLLMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
}

const PRODUCT_TYPE = {
  SYSTEM: 'system',      // 体系课
  SPECIAL: 'special',    // 专项课
}

module.exports = {
  ORDER_STATUS,
  ORDER_STATUS_CONFIG,
  WAITLIST_STATUS,
  ASSESS_STATUS,
  CLASS_STATUS,
  ENROLLMENT_STATUS,
  PAYMENT_STATUS,
  PRODUCT_TYPE,
}
