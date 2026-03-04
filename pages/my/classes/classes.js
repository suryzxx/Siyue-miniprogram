// 模拟数据 - 当前班级
const MOCK_CURRENT_CLASS = {
  id: 'class-001',
  name: 'K3进阶一班',
  campus: '同曦校区',
  teacher: 'Esther于哲敏',
  startDate: '2026.03.07',
  endDate: '2026.06.20',
  schedule: '周二、周六 12:00-14:30',
  currentSession: 6,
  totalSessions: 16
}

// 模拟数据 - 班级列表
const MOCK_CLASSES = [
  {
    id: 'class-001',
    name: 'K3进阶一班',
    campus: '同曦校区',
    teacher: 'Esther于哲敏',
    startDate: '2026.03.07',
    endDate: '2026.06.20',
    schedule: '周二12:00-14:30',
    currentSession: 6,
    totalSessions: 16,
    status: 'active'
  },
  {
    id: 'class-002',
    name: 'K2基础二班',
    campus: '同曦校区',
    teacher: 'Esther于哲敏',
    startDate: '2025.09.01',
    endDate: '2026.01.15',
    totalSessions: 16,
    status: 'completed'
  },
  {
    id: 'class-003',
    name: 'K1启蒙一班',
    campus: '天街校区',
    teacher: 'Mark张小明',
    startDate: '2025.03.01',
    endDate: '2025.07.10',
    totalSessions: 12,
    status: 'completed'
  },
  {
    id: 'class-004',
    name: 'K4卓越一班',
    campus: '同曦校区',
    teacher: 'Esther于哲敏',
    startDate: '2026.07.15',
    endDate: '2026.11.20',
    schedule: '周三 18:30-20:30',
    status: 'unstarted'
  }
]

// 模拟数据 - 可转班列表
const MOCK_TRANSFER_CLASSES = [
  {
    id: 'transfer-001',
    name: 'K3进阶二班',
    campus: '同曦校区',
    teacher: 'Marcus张伟',
    schedule: '2026.03.10-2026.06.25 周三、周日 14:00-16:30',
    remaining: 3,
    status: 'available'
  },
  {
    id: 'transfer-002',
    name: 'K3进阶三班',
    campus: '河西校区',
    teacher: 'Sophia王芳',
    schedule: '2026.03.12-2026.06.28 周四、周日 09:00-11:30',
    remaining: 8,
    status: 'available'
  },
  {
    id: 'transfer-003',
    name: 'K3进阶四班',
    campus: '同曦校区',
    teacher: 'Linda李娜',
    schedule: '2026.03.15-2026.07.01 周一、周五 16:00-18:30',
    remaining: 0,
    status: 'full'
  }
]

// 模拟数据 - 可调课班级列表
const MOCK_ADJUST_CLASSES = [
  {
    id: 'adjust-001',
    name: 'K3进阶三班',
    campus: '同曦校区',
    teacher: '张老师',
    schedule: '周六10:00-11:30',
    remaining: 2
  },
  {
    id: 'adjust-002',
    name: 'K3进阶二班',
    campus: '同曦校区',
    teacher: '李老师',
    schedule: '周六14:00-15:30',
    remaining: 0
  },
  {
    id: 'adjust-003',
    name: 'K3进阶五班',
    campus: '同曦校区',
    teacher: '王老师',
    schedule: '周六16:00-17:30',
    remaining: 5
  }
]

Page({
  data: {
    navBarHeight: 0,
    currentTab: 0,
    tabs: ['班级列表', '转班', '调课'],
    
    // 当前班级信息（用于转班和调课tab）
    currentClass: null,
    
    // 班级列表
    classList: [],
    
    // 转班列表
    transferList: [],
    
    // 调课列表
    adjustList: [],
    
    // 讲次列表
    sessionList: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    currentSessionIndex: 0
  },

  onLoad: function() {
    var app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    this.setData({
      navBarHeight: app.globalData.navBarHeight
    })
    this.loadData()
  },

  onShow: function() {
    this.loadData()
  },

  loadData: function() {
    // 使用模拟数据
    this.setData({
      currentClass: MOCK_CURRENT_CLASS,
      classList: MOCK_CLASSES,
      transferList: MOCK_TRANSFER_CLASSES,
      adjustList: MOCK_ADJUST_CLASSES
    })
  },

  // Tab 切换
  onTabChange: function(e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      currentTab: parseInt(index)
    })
  },

  // 选择讲次
  onSelectSession: function(e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      currentSessionIndex: parseInt(index)
    })
  },

  // 切换班级（历史班级切换为当前班级）
  onSwitchClass: function(e) {
    var classItem = e.currentTarget.dataset.item
    wx.showModal({
      title: '切换班级',
      content: '确定要切换到 ' + classItem.name + ' 吗？',
      success: function(res) {
        if (res.confirm) {
          wx.showToast({
            title: '切换成功',
            icon: 'success'
          })
        }
      }
    })
  },

  // 立即转班
  onTransfer: function(e) {
    var classItem = e.currentTarget.dataset.item
    if (classItem.remaining === 0) {
      wx.showToast({
        title: '该班级已满员',
        icon: 'none'
      })
      return
    }
    wx.showModal({
      title: '确认转班',
      content: '确定要转入 ' + classItem.name + ' 吗？',
      success: function(res) {
        if (res.confirm) {
          wx.showToast({
            title: '转班申请已提交',
            icon: 'success'
          })
        }
      }
    })
  },

  // 调课
  onAdjust: function(e) {
    var classItem = e.currentTarget.dataset.item
    if (classItem.remaining === 0) {
      wx.showToast({
        title: '该班级已满员',
        icon: 'none'
      })
      return
    }
    wx.showModal({
      title: '确认调课',
      content: '确定要调到 ' + classItem.name + ' 吗？',
      success: function(res) {
        if (res.confirm) {
          wx.showToast({
            title: '调课申请已提交',
            icon: 'success'
          })
        }
      }
    })
  }
})
