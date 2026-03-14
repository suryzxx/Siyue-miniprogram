const { classService } = require('../../../services/class')

Page({
  data: {
    navBarHeight: 0,
    currentTab: 0,
    tabs: ['班级列表', '转班', '调课'],
    
    currentClass: null,
    classList: [],
    transferList: [],
    adjustList: [],
    sessionList: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    currentSessionIndex: 0,
    loading: false
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
    this.setData({ loading: true })
    
    // TODO: 之后改回我的班级接口 /client/api/class/my/list
    // 临时用班级列表接口测试
    classService.getOpenList({ page: 1, page_size: 20 }).then(res => {
      if (res.code === 200 && res.data) {
        const list = res.data.list || res.data || []
        const classList = list.map(item => this.formatClassItem(item))
        const currentClass = classList.find(c => c.status === 'active') || classList[0] || null
        
        this.setData({
          classList,
          currentClass,
          loading: false
        })
      } else {
        this.setData({ loading: false })
      }
    }).catch(err => {
      console.error('加载班级列表失败:', err)
      this.setData({ loading: false })
    })
  },

  formatClassItem: function(item) {
    const formatDate = (dateStr) => {
      if (!dateStr) return ''
      return dateStr.split(' ')[0].replace(/-/g, '.')
    }
    
    const startDate = formatDate(item.first_in_class_time)
    const endDate = formatDate(item.last_out_class_time)
    const lessonTime = item.lesson_time || ''
    const classDays = item.class_days_cn || ''
    
    let schedule = ''
    if (lessonTime) schedule = lessonTime
    if (classDays) schedule += (schedule ? ' ' : '') + classDays
    
    let status = 'active'
    const now = new Date()
    if (item.first_in_class_time) {
      const start = new Date(item.first_in_class_time)
      if (start > now) status = 'unstarted'
    }
    if (item.last_out_class_time) {
      const end = new Date(item.last_out_class_time)
      if (end < now) status = 'completed'
    }

    return {
      id: item.id,
      name: item.name,
      campus: item.campus_name || '',
      teacher: item.teacher_name || '',
      startDate,
      endDate,
      schedule,
      currentSession: item.current_lesson_num || 1,
      totalSessions: item.sum_lesson_num || 16,
      status
    }
  },

  onTabChange: function(e) {
    var index = parseInt(e.currentTarget.dataset.index)
    if (index === 1 || index === 2) {
      wx.showToast({
        title: '开发中',
        icon: 'none'
      })
      return
    }
    this.setData({
      currentTab: index
    })
  },

  onSelectSession: function(e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      currentSessionIndex: parseInt(index)
    })
  },

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
