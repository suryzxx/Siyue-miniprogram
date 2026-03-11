Component({
  properties: {
    filters: {
      type: Object,
      value: {
        semesters: [],
        campuses: [],
        teachers: [],
      },
    },
    currentFilters: {
      type: Object,
      value: {
        semester: '',
        semesterName: '',
        campusId: '',
        campusName: '',
        teacherId: '',
        teacherName: '',
      },
    },
  },

  data: {
    showPopup: false,
    popupType: '',
    popupTitle: '',
    popupOptions: [],
    hasFilters: false,
  },

  observers: {
    'currentFilters': function(currentFilters) {
      // 监听 currentFilters 变化，计算是否有筛选条件
      const hasFilters = !!(currentFilters.semester || currentFilters.campusId || currentFilters.teacherId)
      this.setData({ hasFilters })
    }
  },

  methods: {
    onSemesterTap() {
      const { filters, currentFilters } = this.data
      const options = filters.semesters.map((item) => ({
        id: item.id,
        name: item.name,
        selected: item.id === currentFilters.semester,
      }))
      this.setData({
        showPopup: true,
        popupType: 'semester',
        popupTitle: '选择学期',
        popupOptions: options,
      })
    },

    onCampusTap() {
      const { filters, currentFilters } = this.data
      const options = filters.campuses.map((item) => ({
        id: item.id,
        name: item.name,
        selected: item.id === currentFilters.campusId,
      }))
      this.setData({
        showPopup: true,
        popupType: 'campus',
        popupTitle: '选择校区',
        popupOptions: options,
      })
    },

    onTeacherTap() {
      const { filters, currentFilters } = this.data
      const options = filters.teachers.map((item) => ({
        id: item.id,
        name: item.name,
        selected: item.id === currentFilters.teacherId,
      }))
      this.setData({
        showPopup: true,
        popupType: 'teacher',
        popupTitle: '选择主教老师',
        popupOptions: options,
      })
    },

    onSelectOption(e) {
      const { item } = e.currentTarget.dataset
      const { popupType, currentFilters } = this.data
      let newFilters = { ...currentFilters }

      if (popupType === 'semester') {
        newFilters.semester = item.selected ? '' : item.id
        newFilters.semesterName = item.selected ? '' : item.name
      } else if (popupType === 'campus') {
        newFilters.campusId = item.selected ? '' : item.id
        newFilters.campusName = item.selected ? '' : item.name
      } else if (popupType === 'teacher') {
        newFilters.teacherId = item.selected ? '' : item.id
        newFilters.teacherName = item.selected ? '' : item.name
      }

      this.setData({ showPopup: false })
      this.triggerEvent('change', newFilters)
    },

    onReset() {
      this.triggerEvent('change', {
        semester: '',
        semesterName: '',
        campusId: '',
        campusName: '',
        teacherId: '',
        teacherName: '',
      })
    },

    onMaskTap() {
      this.setData({ showPopup: false })
    },

    onClosePopup() {
      this.setData({ showPopup: false })
    },

    stopPropagation() {
      // 阻止事件冒泡
    },
  },
})
