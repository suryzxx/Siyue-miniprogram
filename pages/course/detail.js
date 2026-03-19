const { orderService } = require('../../services/order')
const { classService } = require('../../services/class')

Page({
  data: {
    navBarHeight: 0,
    isLoggedIn: false,
    loading: true,
    classId: '',
    classInfo: {},
    teacher: {},
    planItems: [],
  },

  onLoad(options) {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    this.setData({
      navBarHeight: app.globalData.navBarHeight,
      classId: options.id || '',
    })
    this.loadClassDetail(options.id)
  },

  onShow() {
    const app = getApp()
    this.setData({
      isLoggedIn: !!app.globalData.isLoggedIn,
    })
  },

  loadClassDetail(id) {
    if (!id) {
      wx.showToast({ title: '班级ID不存在', icon: 'none' })
      return
    }

    this.setData({ loading: true })

    classService.getOpenDetail(id).then(res => {
      if (res.code === 200 && res.data) {
        const data = res.data
        const classInfo = this.formatClassInfo(data)
        const planItems = this.formatPlanItems(data.class_schedule)
        const teacher = {
          name: data.teacher_name || (data.teacher_info && data.teacher_info.name) || '',
          poster: (data.teacher_info && data.teacher_info.poster) || '',
        }

        this.setData({
          classInfo,
          teacher,
          planItems,
          loading: false,
        })
      } else {
        wx.showToast({ title: res.msg || '获取班级详情失败', icon: 'none' })
        this.setData({ loading: false })
      }
    }).catch(err => {
      console.error('[detail] loadClassDetail error:', err)
      wx.showToast({ title: err.message || '网络错误', icon: 'none' })
      this.setData({ loading: false })
    })
  },

  /**
   * 格式化班级信息，将接口数据映射为前端需要的格式
   */
  formatClassInfo(data) {
    // 计算剩余名额
    const remaining = data.person_max > 0 ? data.person_max - (data.student_num || 0) : 0

    // 组合时间信息
    const timeParts = []
    if (data.first_in_class_time && data.first_out_class_time) {
      const dateStr = data.first_in_class_time.substring(0, 10)
      const startTime = data.first_in_class_time.substring(11, 16)
      const endTime = data.first_out_class_time.substring(11, 16)
      timeParts.push(dateStr + ' ' + startTime + '-' + endTime)
    }

    // 转换星期为中文
    if (data.class_days) {
      const weekDayMap = {
        'Mon': '周一', 'Tue': '周二', 'Wed': '周三',
        'Thu': '周四', 'Fri': '周五', 'Sat': '周六', 'Sun': '周日'
      }
      let daysArray = data.class_days

      if (typeof daysArray === 'string') {
        try {
          const parsed = JSON.parse(daysArray)
          if (Array.isArray(parsed)) {
            daysArray = parsed
          }
        } catch (e) {
          daysArray = daysArray.split(',')
        }
      }

      if (Array.isArray(daysArray)) {
        const daysStr = daysArray
          .filter(function(d) { return d })
          .map(function(d) { return weekDayMap[d.trim ? d.trim() : d] || d })
          .join('、')
        if (daysStr) timeParts.push(daysStr)
      }
    }
    const schedule = timeParts.join(' ')

    // 组合地点信息
    const locationParts = []
    if (data.campus_city_name) locationParts.push(data.campus_city_name)
    if (data.campus_area_name) locationParts.push(data.campus_area_name)
    if (data.campus_name) locationParts.push(data.campus_name)
    if (data.class_room_name) locationParts.push(data.class_room_name)
    const location = locationParts.join(' ')

    // 判断产品类型
    const isSystem = data.course_class_type === 0 || data.course_class_type_name === '体系课'
    const productType = isSystem ? 'system' : 'special'
    const productTypeName = data.course_class_type_name || (isSystem ? '体系课' : '专项课')

    const price = (data.course_fee || 0) / 100
    const materialPrice = (data.assistant_fee || 0) / 100
    const totalPrice = ((data.course_fee || 0) + (data.assistant_fee || 0)) / 100

    return {
      id: data.id,
      name: data.name,
      productName: data.course_name || '',
      productType: productType,
      productTypeName: productTypeName,
      level: data.course_sub_category_name || '',
      campus: {
        id: data.campus_id,
        name: data.campus_name || '',
        address: location
      },
      mainTeacher: {
        id: data.teacher_id,
        name: data.teacher_name || ''
      },
      schedule: schedule,
      classroom: data.class_room_name || '',
      totalSessions: data.sum_lesson_num || 0,
      remaining: remaining,
      capacity: data.person_max || 0,
      price: price,
      materialPrice: materialPrice,
      totalPrice: totalPrice,
      location: location,
    }
  },

  /**
   * 格式化教学计划，将接口的 class_schedule 转换为前端需要的格式
   */
  formatPlanItems(classSchedule) {
    if (!classSchedule || !Array.isArray(classSchedule)) {
      return []
    }

    return classSchedule.map(item => {
      let timeStr = ''
      
      if (item.in_class_time) {
        // 提取日期部分：2026-03-07 -> 2026.03.07
        const datePart = item.in_class_time.substring(0, 10).replace(/-/g, '.')
        // 提取上课时间：12:00
        const startTime = item.in_class_time.substring(11, 16)
        // 提取下课时间：14:30
        const endTime = item.out_class_time ? item.out_class_time.substring(11, 16) : ''
        
        timeStr = datePart + ' ' + startTime + (endTime ? '-' + endTime : '')
      }

      return {
        time: timeStr,
        title: item.lesson_name || ''
      }
    })
  },

  async onEnrollTap() {
    const app = getApp()
    const { classInfo } = this.data

    // 检查登录状态
    if (!app.globalData.isLoggedIn) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再进行报名',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/auth/login' })
          }
        },
      })
      return
    }

    const currentStudent = app.getCurrentStudent()

    // 检查是否有学生
    if (!currentStudent) {
      wx.showModal({
        title: '提示',
        content: '请先添加学生后再进行报名',
        confirmText: '去添加',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/student/add' })
          }
        },
      })
      return
    }

// // --- 强行写死开始 ---
// if (currentStudent) {
//   currentStudent.level = 'K3'; // 随便给个等级
//   currentStudent.needTest = false; // 强行改为不需要测试
// }
// // --- 强行写死结束 ---

    // 体系课需要检查评测等级
    if (classInfo.productType === 'system') {
      if (!currentStudent.level || currentStudent.needTest) {
        wx.showModal({
          title: '提示',
          content: `学生"${currentStudent.name}"尚未完成等级测试，请先预约线下评测`,
          confirmText: '去预约',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              wx.navigateTo({ url: `/pages/student/book-test?studentId=${currentStudent.id}` })
            }
          },
        })
        return
      }
    }

    // 根据余位决定报名还是候补
    if (classInfo.remaining > 0) {
      // 有余位，创建订单
      wx.showLoading({ title: '创建订单中...', mask: true })
      try {
        // 获取 wx.login code
        const loginRes = await new Promise((resolve, reject) => {
          wx.login({
            success: resolve,
            fail: reject
          })
        })
        const orderRes = await orderService.create({
          classId: classInfo.id,
          code: loginRes.code
        })
        wx.hideLoading()
        
        if (orderRes.code === 200 && orderRes.data) {
          const paymentData = orderRes.data
          
          const app = getApp()
          app.globalData.pendingPayment = {
            orderNo: paymentData.order_no,
            timeStamp: paymentData.time_stamp,
            nonceStr: paymentData.nonce_str,
            package: paymentData.package,
            signType: paymentData.sign_type || 'RSA',
            paySign: paymentData.pay_sign,
          }
          
          app.globalData.pendingClassInfo = {
            name: classInfo.name,
            productType: classInfo.productType,
            productTypeName: classInfo.productTypeName,
            level: classInfo.level,
            schedule: classInfo.schedule,
            location: classInfo.location,
            teacherName: classInfo.mainTeacher?.name || classInfo.teacherName || '',
            totalSessions: classInfo.totalSessions,
            price: classInfo.price,
            materialPrice: classInfo.materialPrice,
            totalPrice: classInfo.totalPrice,
          }
          
          wx.redirectTo({
            url: `/pages/order/detail?id=${paymentData.order_no}&fromClassDetail=true`,
          })
        } else {
          wx.showToast({ title: orderRes.msg || orderRes.message || '创建订单失败', icon: 'none' })
        }
      } catch (e) {
        wx.hideLoading()
        console.error('创建订单失败:', e)
        wx.showToast({ title: '创建订单失败，请重试', icon: 'none' })
      }
    } else {
      // 无余位，候补功能暂未开放
      // TODO: 候补功能开发中，以下代码保留待恢复
      // wx.showModal({
      //   title: '提示',
      //   content: '该班级已满员，是否加入候补？',
      //   confirmText: '加入候补',
      //   cancelText: '取消',
      //   success: (res) => {
      //     if (res.confirm) {
      //       wx.showToast({ title: '已加入候补', icon: 'success' })
      //     }
      //   },
      // })
      wx.showToast({ title: '候补功能开发中', icon: 'none' })
    }
  },
})
