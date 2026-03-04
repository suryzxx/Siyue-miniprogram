Page({
  data: {
    navBarHeight: 0,
    courseId: '',
    students: [],
    selectedStudentId: '',
  },
  computed: {
    evaluationStatus(item) {
      if (item.level !== null) {
        return item.level;
      } else if (item.needTest === true) {
        return '待评测';
      } else {
        return '';
      }
    },
    canProceed() {
      const selectedStudent = this.data.students.find(
        (item) => item.id === this.data.selectedStudentId
      );
      return selectedStudent && !selectedStudent.needTest;
    },
  },
  onLoad(options) {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    const { students, currentStudentId } = app.globalData
    this.setData({
      navBarHeight: app.globalData.navBarHeight,
      courseId: options.courseId || '',
      students,
      selectedStudentId: currentStudentId || students[0]?.id || '',
    })
  },
  onSelectStudent(e) {
    this.setData({ selectedStudentId: e.currentTarget.dataset.id })
  },
  onNext() {
    if (!this.data.canProceed) {
      wx.showToast({
        title: '请先完成等级测试',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    const app = getApp()
    const course =
      app.globalData.courses?.find((item) => item.id === this.data.courseId) || {}
    const nextUrl =
      course.remainingSeats > 0
        ? `/pages/order/confirm?courseId=${this.data.courseId}&studentId=${this.data.selectedStudentId}`
        : `/pages/waitlist/confirm?courseId=${this.data.courseId}&studentId=${this.data.selectedStudentId}`
    wx.navigateTo({ url: nextUrl })
  },

  onBookTest(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/student/book-test?studentId=${id}` })
  },
})
