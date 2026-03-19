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
    showSemesterPopup: false,
    showCampusPopup: false,
    showTeacherPopup: false,
    semesterOptions: [],
    campusOptions: [],
    teacherOptions: [],
    campusSearchKeyword: '',
    teacherSearchKeyword: '',
    tempSelectedSemester: null,
    tempSelectedCampus: null,
    tempSelectedTeacher: null,
  },

  observers: {
    'filters.semesters': function(semesters) {
      this.updateSemesterOptions(semesters)
    },
    'filters.campuses': function(campuses) {
      this.updateCampusOptions(campuses, '')
    },
    'filters.teachers': function(teachers) {
      this.updateTeacherOptions(teachers, '')
    }
  },

  methods: {
    updateSemesterOptions(semesters) {
      const { currentFilters } = this.data
      const options = (semesters || []).map(item => ({
        id: item.id,
        name: item.name,
        selected: item.id === currentFilters.semester
      }))
      this.setData({ semesterOptions: options })
    },

    updateCampusOptions(campuses, keyword) {
      const { currentFilters } = this.data
      let list = campuses || []
      if (keyword) {
        list = list.filter(item => item.name && item.name.indexOf(keyword) > -1)
      }
      const options = list.map(item => ({
        id: item.id,
        name: item.name,
        selected: item.id === currentFilters.campusId
      }))
      this.setData({ campusOptions: options })
    },

    updateTeacherOptions(teachers, keyword) {
      const { currentFilters } = this.data
      let list = teachers || []
      if (keyword) {
        list = list.filter(item => item.name && item.name.indexOf(keyword) > -1)
      }
      const options = list.map(item => ({
        id: item.id,
        name: item.name,
        selected: item.id === currentFilters.teacherId
      }))
      this.setData({ teacherOptions: options })
    },

    onSemesterTap() {
      this.updateSemesterOptions(this.data.filters.semesters)
      this.setData({ 
        showSemesterPopup: true,
        tempSelectedSemester: this.data.currentFilters.semester || null
      })
    },

    onCampusTap() {
      this.updateCampusOptions(this.data.filters.campuses, '')
      this.setData({ 
        showCampusPopup: true,
        campusSearchKeyword: '',
        tempSelectedCampus: this.data.currentFilters.campusId || null
      })
    },

    onTeacherTap() {
      this.updateTeacherOptions(this.data.filters.teachers, '')
      this.setData({ 
        showTeacherPopup: true,
        teacherSearchKeyword: '',
        tempSelectedTeacher: this.data.currentFilters.teacherId || null
      })
    },

    onSelectSemester(e) {
      const { item } = e.currentTarget.dataset
      const { semesterOptions, tempSelectedSemester } = this.data
      
      const newSelectedId = tempSelectedSemester === item.id ? null : item.id
      const options = semesterOptions.map(opt => ({
        ...opt,
        selected: opt.id === newSelectedId
      }))
      
      this.setData({ 
        semesterOptions: options,
        tempSelectedSemester: newSelectedId
      })
    },

    onSelectCampus(e) {
      const { item } = e.currentTarget.dataset
      const { campusOptions, tempSelectedCampus } = this.data
      
      const newSelectedId = tempSelectedCampus === item.id ? null : item.id
      const options = campusOptions.map(opt => ({
        ...opt,
        selected: opt.id === newSelectedId
      }))
      
      this.setData({ 
        campusOptions: options,
        tempSelectedCampus: newSelectedId
      })
    },

    onSelectTeacher(e) {
      const { item } = e.currentTarget.dataset
      const { teacherOptions, tempSelectedTeacher } = this.data
      
      const newSelectedId = tempSelectedTeacher === item.id ? null : item.id
      const options = teacherOptions.map(opt => ({
        ...opt,
        selected: opt.id === newSelectedId
      }))
      
      this.setData({ 
        teacherOptions: options,
        tempSelectedTeacher: newSelectedId
      })
    },

    onCampusSearch(e) {
      const keyword = e.detail.value || ''
      this.setData({ campusSearchKeyword: keyword })
      this.updateCampusOptions(this.data.filters.campuses, keyword)
    },

    onTeacherSearch(e) {
      const keyword = e.detail.value || ''
      this.setData({ teacherSearchKeyword: keyword })
      this.updateTeacherOptions(this.data.filters.teachers, keyword)
    },

    onResetSemester() {
      const options = this.data.semesterOptions.map(opt => ({
        ...opt,
        selected: false
      }))
      this.setData({ 
        semesterOptions: options,
        tempSelectedSemester: null
      })
    },

    onResetCampus() {
      const options = this.data.campusOptions.map(opt => ({
        ...opt,
        selected: false
      }))
      this.setData({ 
        campusOptions: options,
        tempSelectedCampus: null
      })
    },

    onResetTeacher() {
      const options = this.data.teacherOptions.map(opt => ({
        ...opt,
        selected: false
      }))
      this.setData({ 
        teacherOptions: options,
        tempSelectedTeacher: null
      })
    },

    onConfirmSemester() {
      const { tempSelectedSemester, filters, currentFilters } = this.data
      const selected = filters.semesters.find(item => item.id === tempSelectedSemester)
      
      const newFilters = {
        ...currentFilters,
        semester: tempSelectedSemester || '',
        semesterName: selected ? selected.name : ''
      }
      
      this.setData({ showSemesterPopup: false })
      this.triggerEvent('change', newFilters)
    },

    onConfirmCampus() {
      const { tempSelectedCampus, filters, currentFilters } = this.data
      const selected = filters.campuses.find(item => item.id === tempSelectedCampus)
      
      const newFilters = {
        ...currentFilters,
        campusId: tempSelectedCampus || '',
        campusName: selected ? selected.name : ''
      }
      
      this.setData({ showCampusPopup: false })
      this.triggerEvent('change', newFilters)
    },

    onConfirmTeacher() {
      const { tempSelectedTeacher, filters, currentFilters } = this.data
      const selected = filters.teachers.find(item => item.id === tempSelectedTeacher)
      
      const newFilters = {
        ...currentFilters,
        teacherId: tempSelectedTeacher || '',
        teacherName: selected ? selected.name : ''
      }
      
      this.setData({ showTeacherPopup: false })
      this.triggerEvent('change', newFilters)
    },

    onCloseSemesterPopup() {
      this.setData({ showSemesterPopup: false })
    },

    onCloseCampusPopup() {
      this.setData({ showCampusPopup: false })
    },

    onCloseTeacherPopup() {
      this.setData({ showTeacherPopup: false })
    },

    onSemesterPopupChange(e) {
      if (!e.detail.visible) {
        this.setData({ showSemesterPopup: false })
      }
    },

    onCampusPopupChange(e) {
      if (!e.detail.visible) {
        this.setData({ showCampusPopup: false })
      }
    },

    onTeacherPopupChange(e) {
      if (!e.detail.visible) {
        this.setData({ showTeacherPopup: false })
      }
    },
  },
})
