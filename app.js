const { config } = require('./utils/config')
const { authService } = require('./services/auth')
const { setToken, removeToken } = require('./utils/request')

App({
  globalData: {
    navBarHeight: 0,
    isLoggedIn: false,
    parent: null,
    students: [],
    currentStudentId: '',
    currentClassId: '', // 新增：当前班级ID
    courses: [],
    userInfo: null,
    // 新增：我的班级、候补、筛选条件
    myClasses: [],
    myWaitlists: [],
    filters: {
      semesters: [],
      campuses: [],
      teachers: [],
    },
    currentFilters: {
      semester: '',
      campusId: '',
      teacherId: '',
    },
  },

  onLaunch() {
    this.calculateNavBarHeight()
    this.restoreLoginState()
  },

  calculateNavBarHeight() {
    const systemInfo = wx.getSystemInfoSync()
    const statusBarHeight = systemInfo.statusBarHeight || 0
    const rpxToPx = systemInfo.windowWidth / 750
    const contentHeight = 60 * rpxToPx
    this.globalData.navBarHeight = statusBarHeight + contentHeight
  },

  restoreLoginState() {
    try {
      const loginData = wx.getStorageSync('loginData')
      if (loginData) {
        this.globalData.isLoggedIn = true
        this.globalData.parent = loginData.parent
        this.globalData.students = loginData.students || []
        this.globalData.currentStudentId = loginData.currentStudentId || ''
        this.globalData.currentClassId = loginData.currentClassId || ''
        this.globalData.userInfo = loginData.userInfo || null
        this.globalData.myClasses = loginData.myClasses || []
        this.globalData.myWaitlists = loginData.myWaitlists || []
      }
    } catch (e) {
      console.log('恢复登录状态失败', e)
    }
  },

  saveLoginState() {
    try {
      wx.setStorageSync('loginData', {
        parent: this.globalData.parent,
        students: this.globalData.students,
        currentStudentId: this.globalData.currentStudentId,
        currentClassId: this.globalData.currentClassId,
        userInfo: this.globalData.userInfo,
        myClasses: this.globalData.myClasses,
        myWaitlists: this.globalData.myWaitlists,
      })
    } catch (e) {
      console.log('保存登录状态失败', e)
    }
  },

  async login(phone) {
    try {
      const res = await authService.login(phone)
      if (res.code === 200 && res.data) {
        this.globalData.isLoggedIn = true
        this.globalData.parent = { phone }
        this.globalData.userInfo = res.data.user || null
        if (res.data.students && res.data.students.length > 0) {
          this.globalData.students = res.data.students
          this.globalData.currentStudentId = res.data.students[0].id
        }
        this.saveLoginState()
        return { success: true, data: res.data }
      }
      return { success: false, message: res.message || '登录失败' }
    } catch (e) {
      console.error('登录失败', e)
      return { success: false, message: e.message || '网络错误' }
    }
  },

  async logout() {
    try {
      await authService.logout()
    } catch (e) {
      console.log('退出登录API调用失败', e)
    }
    this.globalData.isLoggedIn = false
    this.globalData.parent = null
    this.globalData.students = []
    this.globalData.currentStudentId = ''
    this.globalData.currentClassId = ''
    this.globalData.userInfo = null
    this.globalData.myClasses = []
    this.globalData.myWaitlists = []
    removeToken()
    try {
      wx.removeStorageSync('loginData')
    } catch (e) {
      console.log('清除登录状态失败', e)
    }
  },

  async register(studentData) {
    try {
      const res = await authService.register(studentData)
      if (res.code === 200 && res.data) {
        this.globalData.isLoggedIn = true
        this.globalData.parent = { phone: studentData.phone }
        if (res.data.student) {
          this.globalData.students.push(res.data.student)
          if (!this.globalData.currentStudentId) {
            this.globalData.currentStudentId = res.data.student.id
          }
        }
        this.globalData.userInfo = res.data.user || null
        this.saveLoginState()
        return { success: true, data: res.data }
      }
      return { success: false, message: res.message || '注册失败' }
    } catch (e) {
      console.error('注册失败', e)
      return { success: false, message: e.message || '网络错误' }
    }
  },

  async getUserInfo() {
    try {
      const res = await authService.getMe()
      if (res.code === 200 && res.data) {
        this.globalData.userInfo = res.data.user || res.data
        if (res.data.students) {
          this.globalData.students = res.data.students
        }
        this.saveLoginState()
        return { success: true, data: res.data }
      }
      return { success: false, message: res.message || '获取用户信息失败' }
    } catch (e) {
      console.error('获取用户信息失败', e)
      return { success: false, message: e.message || '网络错误' }
    }
  },

  addStudent(student) {
    if (this.globalData.students.length >= 5) {
      return { success: false, message: '最多只能添加5个学生' }
    }
    const newStudent = {
      id: student.id || this.generateStudentId(),
      name: student.name || student.studentName,
      gender: student.gender,
      birthDate: student.birthDate,
      avatar: student.avatar || '/images/pic/avatar.png',
      level: student.level || null,
      needTest: student.level ? false : true,
      grade: student.grade,
      englishName: student.englishName,
      school: student.school,
      city: student.city,
    }
    this.globalData.students.push(newStudent)
    if (!this.globalData.currentStudentId) {
      this.globalData.currentStudentId = newStudent.id
    }
    this.saveLoginState()
    return { success: true, student: newStudent }
  },

  generateStudentId() {
    return 'stu_' + Date.now() + '_' + Math.floor(Math.random() * 1000)
  },

  updateStudent(id, updates) {
    const index = this.globalData.students.findIndex((s) => s.id === id)
    if (index === -1) {
      return { success: false, message: '学生不存在' }
    }
    this.globalData.students[index] = {
      ...this.globalData.students[index],
      ...updates,
    }
    this.saveLoginState()
    return { success: true, student: this.globalData.students[index] }
  },

  removeStudent(id) {
    if (this.globalData.students.length <= 1) {
      return { success: false, message: '至少需要保留一个学生' }
    }
    this.globalData.students = this.globalData.students.filter((s) => s.id !== id)
    if (this.globalData.currentStudentId === id) {
      this.globalData.currentStudentId = this.globalData.students[0]?.id || ''
    }
    this.saveLoginState()
    return { success: true }
  },

  completeStudentTest(studentId, level = 'K3飞跃') {
    return this.updateStudent(studentId, { level, needTest: false })
  },

  getCurrentStudent() {
    return this.globalData.students.find(
      (s) => s.id === this.globalData.currentStudentId
    )
  },

  // 新增：获取当前班级
  getCurrentClass() {
    return this.globalData.myClasses.find(
      (c) => c.id === this.globalData.currentClassId
    ) || this.globalData.myClasses[0]
  },

  // 新增：添加已报名班级
  addMyClass(classInfo) {
    const exists = this.globalData.myClasses.find((c) => c.id === classInfo.id)
    if (!exists) {
      this.globalData.myClasses.push(classInfo)
      this.saveLoginState()
    }
    return { success: true }
  },

  // 新增：添加候补
  addWaitlist(waitlistInfo) {
    const exists = this.globalData.myWaitlists.find((w) => w.id === waitlistInfo.id)
    if (!exists) {
      this.globalData.myWaitlists.push(waitlistInfo)
      this.saveLoginState()
    }
    return { success: true }
  },

  // 新增：移除候补
  removeWaitlist(waitlistId) {
    this.globalData.myWaitlists = this.globalData.myWaitlists.filter(
      (w) => w.id !== waitlistId
    )
    this.saveLoginState()
    return { success: true }
  },

  // 新增：更新筛选条件
  setFilters(filters) {
    this.globalData.filters = { ...this.globalData.filters, ...filters }
  },

  // 新增：更新当前筛选
  setCurrentFilters(currentFilters) {
    this.globalData.currentFilters = { ...this.globalData.currentFilters, ...currentFilters }
  },
})
