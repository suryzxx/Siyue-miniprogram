const { commonService } = require('../../services/common')
const { classService } = require('../../services/class')

Page({
  data: {
    navBarHeight: 0,
    loading: true,
    loadingMore: false,
    page: 1,
    pageSize: 10,
    hasMore: true,
    classes: [],
    filters: {
      semesters: [],
      campuses: [],
      teachers: []
    },
    currentFilters: {
      semester: '',
      semesterName: '',
      campusId: '',
      campusName: '',
      teacherId: '',
      teacherName: ''
    }
  },

  onLoad() {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    this.setData({
      navBarHeight: app.globalData.navBarHeight
    })
    this.loadFilters()
    this.loadClasses()
  },

  onPullDownRefresh() {
    this.loadClasses(true).then(() => {
      wx.stopPullDownRefresh()
    })
  },

  onReachBottom() {
    if (this.data.loadingMore || !this.data.hasMore) return
    this.loadMoreClasses()
  },

  /**
   * 加载筛选项（校区、老师）
   */
  loadFilters() {
    const self = this
    Promise.all([
      commonService.getCampusList(),
      commonService.getTeacherList()
    ]).then(results => {
      const campusRes = results[0]
      const teacherRes = results[1]
      
      const campuses = (campusRes.data || []).map(item => ({
        id: item.id,
        name: item.name
      }))

      const teachers = (teacherRes.data || []).map(item => ({
        id: item.id,
        name: item.name
      }))

        self.setData({
          filters: {
            semesters: [
              { id: 'chun', name: '春季' },
              { id: 'shu', name: '暑假' },
              { id: 'qiu', name: '秋季' },
              { id: 'han', name: '寒假' }
            ],
            campuses: campuses,
            teachers: teachers
          }
        })
    }).catch(err => {
      console.error('[course] loadFilters error:', err)
    })
  },

  /**
   * 加载班级列表
   */
  loadClasses(isRefresh) {
    const self = this
    return new Promise(resolve => {
      if (isRefresh) {
        self.setData({ loading: true })
      }

      const currentFilters = self.data.currentFilters
      const pageSize = self.data.pageSize
      const params = {
        page: 1,
        page_size: pageSize,
        'search[sale_status]': 1
      }

      if (currentFilters.semester) {
        params['search[course_semester]'] = currentFilters.semester
      }
      if (currentFilters.campusId) {
        params['search[campus_ids]'] = currentFilters.campusId
      }
      if (currentFilters.teacherId) {
        params['search[teacher_ids]'] = currentFilters.teacherId
      }

      classService.getOpenList(params).then(res => {
        if (res.code === 200 && res.data) {
          let list = res.data.list || res.data || []
          if (!Array.isArray(list)) {
            list = []
          }
          const classes = self.formatClasses(list)
          const hasMore = list.length >= pageSize

          self.setData({
            classes: classes,
            loading: false,
            page: 1,
            hasMore: hasMore
          })
        } else {
          self.setData({
            classes: [],
            loading: false,
            page: 1,
            hasMore: false
          })
          wx.showToast({ title: res.msg || '获取班级列表失败', icon: 'none' })
        }
        resolve()
      }).catch(err => {
        console.error('[course] loadClasses error:', err)
        self.setData({
          classes: [],
          loading: false,
          page: 1,
          hasMore: false
        })
        wx.showToast({ title: err.message || '网络错误', icon: 'none' })
        resolve()
      })
    })
  },

  /**
   * 加载更多班级（无限滑动）
   */
  loadMoreClasses() {
    if (this.data.loadingMore || !this.data.hasMore) return

    const self = this
    this.setData({ loadingMore: true })

    const currentFilters = this.data.currentFilters
    const page = this.data.page
    const pageSize = this.data.pageSize
    const classes = this.data.classes
    const nextPage = page + 1
    const params = {
      page: nextPage,
      page_size: pageSize,
      'search[sale_status]': 1
    }

    if (currentFilters.semester) {
      params['search[course_semester]'] = currentFilters.semester
    }
    if (currentFilters.campusId) {
      params['search[campus_ids]'] = currentFilters.campusId
    }
    if (currentFilters.teacherId) {
      params['search[teacher_ids]'] = currentFilters.teacherId
    }

    classService.getOpenList(params).then(res => {
      if (res.code === 200 && res.data) {
        let list = res.data.list || res.data || []
        if (!Array.isArray(list)) {
          list = []
        }
        const newClasses = self.formatClasses(list)
        const hasMore = list.length >= pageSize

        self.setData({
          classes: classes.concat(newClasses),
          loadingMore: false,
          page: nextPage,
          hasMore: hasMore
        })
      } else {
        self.setData({
          loadingMore: false,
          hasMore: false
        })
      }
    }).catch(err => {
      console.error('[course] loadMoreClasses error:', err)
      self.setData({
        loadingMore: false,
        hasMore: false
      })
    })
  },

  formatClasses(classes) {
    const self = this
    return classes.map(item => {
      // 计算剩余名额
      const remaining = item.person_max > 0 ? item.person_max - item.student_num : 0
      
      // 组合时间信息
      const timeParts = []
      
      // 日期部分：first_in_class_time ~ last_out_class_time
      const firstInDate = item.first_in_class_time ? item.first_in_class_time.substring(0, 10) : '' // 2026-03-04
      const lastOutDate = item.last_out_class_time ? item.last_out_class_time.substring(0, 10) : '' // 2026-06-20
      if (firstInDate && lastOutDate) {
        timeParts.push(firstInDate + ' ~ ' + lastOutDate)
      }
      
      // 时间部分：直接使用后端的 lesson_time
      if (item.lesson_time) {
        timeParts.push(item.lesson_time) // 11:38 - 13:38
      }
      
      // 转换星期为中文
      if (item.class_days) {
        const weekDayMap = {
          'Mon': '周一', 'Tue': '周二', 'Wed': '周三',
          'Thu': '周四', 'Fri': '周五', 'Sat': '周六', 'Sun': '周日'
        }
        let daysStr = ''
        let daysArray = item.class_days
        
        // 如果是JSON字符串，先解析
        if (typeof daysArray === 'string') {
          try {
            const parsed = JSON.parse(daysArray)
            if (Array.isArray(parsed)) {
              daysArray = parsed
            }
          } catch (e) {
            // 不是JSON，按逗号分隔处理
            daysArray = daysArray.split(',')
          }
        }
        
        if (Array.isArray(daysArray)) {
          daysStr = daysArray
            .filter(function(d) { return d })
            .map(function(d) { return weekDayMap[d.trim ? d.trim() : d] || d })
            .join('、')
        }
        if (daysStr) timeParts.push(daysStr)
      }
      const timeStr = timeParts.join(' ')
      
      // 组合地点信息
      const locationParts = []
      if (item.campus_city_name) locationParts.push(item.campus_city_name)
      if (item.campus_area_name) locationParts.push(item.campus_area_name)
      if (item.campus_name) locationParts.push(item.campus_name)
      const locationStr = locationParts.join(' ')
      
      // 判断是否体系课
      const isSystem = item.course_class_type === 0 || item.course_class_type_name === '体系课'
      
      return {
        id: item.id,
        name: item.name,
        title: item.name,
        productName: item.course_name || '',
        productType: isSystem ? 'system' : 'special',
        level: item.course_sub_category_name || '',
        campus: {
          id: item.campus_id,
          name: item.campus_name || '',
          address: locationStr
        },
        mainTeacher: {
          id: item.teacher_id,
          name: item.teacher_name || '',
          avatar: '/images/pic/avatar.png'
        },
        schedule: timeStr,
        classroom: item.class_room_name || '',
        totalSessions: item.sum_lesson_num || 0,
        remaining: remaining,
        capacity: item.person_max || 0,
        price: (item.course_fee || 0) / 100,
        materialPrice: 0,
        time: timeStr,
        location: locationStr,
        productTypeDisplay: item.course_class_type_name || (isSystem ? '体系课（需评测）' : '专项课'),
        teacher: {
          id: item.teacher_id || '',
          name: item.teacher_name || '',
          avatar: '/images/pic/avatar.png'
        },
        remainingSeats: remaining,
        statusText: remaining > 0 ? '剩余' + remaining + '名额' : '已满员，可候补',
        statusClass: remaining > 0 ? 'is-remaining' : 'is-full',
        priceDisplay: '¥' + ((item.course_fee || 0) / 100),
        unit: '/' + (item.sum_lesson_num || 0) + '课次'
      }
    })
  },

  getProductTypeDisplay(item) {
    if (item.productType === 'system') {
      return '体系课（需评测）' + (item.level || '')
    } else {
      return '专项课' + (item.level ? ' ' + item.level : '')
    }
  },

  onFilterChange(e) {
    const self = this
    const newFilters = e.detail
    this.setData({
      currentFilters: newFilters
    }, () => {
      self.loadClasses()
    })
  },

  onClassTap(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/course/detail?id=' + id })
  }
})
