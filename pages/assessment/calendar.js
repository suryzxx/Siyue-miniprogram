const { commonService } = require('../../services/common')
const { subscribeService } = require('../../services/subscribe')

Page({
  data: {
    navBarHeight: 0,
    
    // 全部校区数据
    allCampusList: [],
    
    // 地址数据（从API加载，已过滤）
    addressData: [],
    
    // 地区选择
    provinces: [],
    cities: [],
    districts: [],
    campusList: [],
    classroomList: [],
    
    selectedProvince: '',
    selectedProvinceName: '',
    selectedCity: '',
    selectedCityName: '',
    selectedDistrict: '',
    selectedDistrictName: '',
    selectedCampus: null,
    
    // 弹窗控制
    showRegionPicker: false,
    regionPickerStep: 'province',
    
    // 周日历
    weekDays: [],
    weekRangeText: '',
    currentWeekStart: null,
    
    // 日历数据
    daysSlotsData: [],
    
    // 加载状态
    loading: false,
    
    // 确认弹窗
    showConfirmModal: false,
    confirmSlot: null
  },

  onLoad() {
    const app = getApp()
    if (!app.globalData.navBarHeight) {
      app.calculateNavBarHeight()
    }
    this.setData({
      navBarHeight: app.globalData.navBarHeight
    })
    
    this.initCurrentWeek()
    this.initData()
  },

  async initData() {
    try {
      const campusRes = await commonService.getCampusList()
      const constants = await commonService.getConstants()
      
      if (campusRes.code === 200 && campusRes.data) {
        this.setData({ allCampusList: campusRes.data })
        this.buildAddressOptions(campusRes.data, constants?.address || [])
        
        if (campusRes.data.length > 0) {
          const defaultCampus = campusRes.data[0]
          this.setData({ selectedCampus: defaultCampus })
          const classrooms = await this.loadClassrooms()
          this.loadBatchData(classrooms)
        }
      }
    } catch (e) {
      console.error('初始化数据失败', e)
    }
  },

  buildAddressOptions(campusList, addressData) {
    const provinceSet = new Map()
    const citySet = new Map()
    const districtSet = new Map()
    
    campusList.forEach(campus => {
      if (campus.province && campus.city && campus.area) {
        provinceSet.set(campus.province, true)
        citySet.set(campus.city, campus.province)
        districtSet.set(campus.area, campus.city)
      }
    })
    
    const codeToName = this.buildCodeToNameMap(addressData)
    
    const provinces = []
    const addressOptions = []
    
    provinceSet.forEach((_, provinceCode) => {
      const cities = []
      citySet.forEach((parentCode, cityCode) => {
        if (parentCode === provinceCode) {
          const districts = []
          districtSet.forEach((parentCityCode, districtCode) => {
            if (parentCityCode === cityCode) {
              districts.push({
                code: districtCode,
                name: codeToName.get(districtCode) || districtCode
              })
            }
          })
          
          if (districts.length > 0) {
            cities.push({
              code: cityCode,
              name: codeToName.get(cityCode) || cityCode,
              children: districts
            })
          }
        }
      })
      
      if (cities.length > 0) {
        addressOptions.push({
          code: provinceCode,
          name: codeToName.get(provinceCode) || provinceCode,
          children: cities
        })
        provinces.push({
          code: provinceCode,
          name: codeToName.get(provinceCode) || provinceCode
        })
      }
    })
    
    this.setData({ 
      addressData: addressOptions,
      provinces: provinces
    })
  },

  buildCodeToNameMap(addressData) {
    const map = new Map()
    
    if (!Array.isArray(addressData)) return map
    
    addressData.forEach(province => {
      if (province.value && province.label) {
        map.set(province.value, province.label)
      }
      if (province.children && Array.isArray(province.children)) {
        province.children.forEach(city => {
          if (city.value && city.label) {
            map.set(city.value, city.label)
          }
          if (city.children && Array.isArray(city.children)) {
            city.children.forEach(district => {
              if (district.value && district.label) {
                map.set(district.value, district.label)
              }
            })
          }
        })
      }
    })
    
    return map
  },

  async loadClassrooms() {
    const { selectedCampus } = this.data
    if (!selectedCampus) return []
    
    try {
      const res = await commonService.getClassroomList()
      if (res.code === 200 && res.data) {
        const classrooms = res.data.filter(item => item.campus_id === selectedCampus.id)
        this.setData({ classroomList: classrooms })
        return classrooms
      }
    } catch (e) {
      console.error('加载教室失败', e)
    }
    return []
  },

  initCurrentWeek() {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    const monday = new Date(today)
    monday.setDate(today.getDate() + diffToMonday)
    monday.setHours(0, 0, 0, 0)
    
    this.setData({ currentWeekStart: monday })
    this.updateWeekDisplay()
  },

  updateWeekDisplay() {
    const { currentWeekStart } = this.data
    const weekDays = []
    const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart)
      date.setDate(currentWeekStart.getDate() + i)
      weekDays.push({
        date: this.formatDate(date),
        dayName: dayNames[i],
        dateNum: date.getDate(),
        month: date.getMonth() + 1
      })
    }
    
    const sunday = new Date(currentWeekStart)
    sunday.setDate(currentWeekStart.getDate() + 6)
    
    const weekRangeText = `${currentWeekStart.getMonth() + 1}月${currentWeekStart.getDate()}日～${sunday.getMonth() + 1}月${sunday.getDate()}日`
    
    this.setData({ weekDays, weekRangeText })
  },

  formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  },

  async loadBatchData(classroomListParam) {
    const { currentWeekStart, weekDays } = this.data
    const classroomList = classroomListParam || this.data.classroomList
    
    if (!weekDays || weekDays.length === 0) {
      this.setData({ daysSlotsData: [] })
      return
    }
    
    if (!classroomList || classroomList.length === 0) {
      this.setData({ daysSlotsData: this.buildEmptyDaysSlotsData() })
      return
    }
    
    const classRoomIds = classroomList.map(c => c.id).join(',')
    const startAt = this.formatDateTime(currentWeekStart, '00:00:00')
    
    const weekEnd = new Date(currentWeekStart)
    weekEnd.setDate(currentWeekStart.getDate() + 6)
    const endAt = this.formatDateTime(weekEnd, '23:59:59')
    
    this.setData({ loading: true })
    
    try {
      const res = await subscribeService.getReviewBatchList({
        classRoomIds,
        startAt,
        endAt
      })
      
      let batchList = []
      if (res.code === 200) {
        batchList = (res.data && res.data.list) ? res.data.list : (Array.isArray(res.data) ? res.data : [])
      } else if (res.msg === 'ok' && res.data) {
        batchList = Array.isArray(res.data) ? res.data : (res.data.list || [])
      }
      
      if (batchList.length > 0) {
        this.buildDaysSlotsData(batchList)
      } else {
        this.setData({ daysSlotsData: this.buildEmptyDaysSlotsData() })
      }
    } catch (e) {
      console.error('加载场次数据失败', e)
      this.setData({ daysSlotsData: this.buildEmptyDaysSlotsData() })
    } finally {
      this.setData({ loading: false })
    }
  },

  formatDateTime(date, time) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day} ${time}`
  },

  buildEmptyDaysSlotsData() {
    const { weekDays } = this.data
    return weekDays.map(day => ({
      date: day.date,
      dayName: day.dayName,
      dateNum: day.dateNum,
      month: day.month,
      slots: []
    }))
  },

  buildDaysSlotsData(batchList) {
    const { weekDays } = this.data
    
    const daysSlotsData = weekDays.map(day => {
      const dayBatches = batchList.filter(batch => {
        const batchDate = batch.start_at ? batch.start_at.split(' ')[0] : ''
        return batchDate === day.date
      })
      
      const slots = dayBatches.map(batch => {
        const startTime = batch.start_at ? batch.start_at.split(' ')[1].substring(0, 5) : ''
        const endTime = batch.end_at ? batch.end_at.split(' ')[1].substring(0, 5) : ''
        
        return {
          id: batch.id,
          date: day.date,
          time: `${startTime}-${endTime}`,
          teacher: batch.teacher_name || '',
          classroomName: batch.class_room_name || '',
          remainingCount: batch.remaining_count || 0,
          campusName: batch.campus_name || '',
          campusDetail: batch.campus_detail || ''
        }
      })
      
      slots.sort((a, b) => a.time.localeCompare(b.time))
      
      return {
        date: day.date,
        dayName: day.dayName,
        dateNum: day.dateNum,
        month: day.month,
        slots: slots
      }
    })
    
    this.setData({ daysSlotsData })
  },

  generateSlotsData() {
    this.loadBatchData()
  },

  onPrevWeek() {
    const { currentWeekStart } = this.data
    const newStart = new Date(currentWeekStart)
    newStart.setDate(currentWeekStart.getDate() - 7)
    this.setData({ currentWeekStart: newStart })
    this.updateWeekDisplay()
    this.loadBatchData()
  },

  onNextWeek() {
    const { currentWeekStart } = this.data
    const newStart = new Date(currentWeekStart)
    newStart.setDate(currentWeekStart.getDate() + 7)
    this.setData({ currentWeekStart: newStart })
    this.updateWeekDisplay()
    this.loadBatchData()
  },

  onShowRegionPicker() {
    this.setData({ 
      showRegionPicker: true,
      regionPickerStep: 'province'
    })
  },

  onHideRegionPicker() {
    this.setData({ showRegionPicker: false })
  },

  onSelectProvince(e) {
    const { code, name } = e.currentTarget.dataset
    const { addressData } = this.data
    
    const provinceData = addressData.find(p => p.code === code)
    const cities = provinceData?.children || []
    
    this.setData({
      selectedProvince: code,
      selectedProvinceName: name,
      selectedCity: '',
      selectedCityName: '',
      selectedDistrict: '',
      selectedDistrictName: '',
      cities: cities,
      districts: [],
      campusList: [],
      regionPickerStep: 'city'
    })
  },

  onSelectCity(e) {
    const { code, name } = e.currentTarget.dataset
    const { cities } = this.data
    
    const cityData = cities.find(c => c.code === code)
    const districts = cityData?.children || []
    
    this.setData({
      selectedCity: code,
      selectedCityName: name,
      selectedDistrict: '',
      selectedDistrictName: '',
      districts: districts,
      campusList: [],
      regionPickerStep: 'district'
    })
  },

  onSelectDistrict(e) {
    const { code, name } = e.currentTarget.dataset
    
    this.setData({
      selectedDistrict: code,
      selectedDistrictName: name,
      regionPickerStep: 'campus'
    })
    
    this.loadCampusList()
  },

  async loadCampusList() {
    const { allCampusList, selectedProvince, selectedCity, selectedDistrict } = this.data
    
    let filteredList = allCampusList
    
    if (selectedProvince) {
      filteredList = filteredList.filter(item => item.province === selectedProvince)
    }
    if (selectedCity) {
      filteredList = filteredList.filter(item => item.city === selectedCity)
    }
    if (selectedDistrict) {
      filteredList = filteredList.filter(item => item.area === selectedDistrict)
    }
    
    this.setData({ campusList: filteredList })
  },

  async onSelectCampus(e) {
    const { id } = e.currentTarget.dataset
    const campus = this.data.campusList.find(item => item.id === id)
    
    if (!campus) return
    
    this.setData({
      selectedCampus: campus,
      showRegionPicker: false,
      daysSlotsData: [],
      classroomList: []
    })
    
    const classrooms = await this.loadClassrooms()
    this.loadBatchData(classrooms)
  },

  // 点击路径项返回对应层级
  onPathItemTap(e) {
    const { level } = e.currentTarget.dataset
    this.setData({ regionPickerStep: level })
  },

  onSlotTap(e) {
    const slot = e.currentTarget.dataset.slot
    this.setData({
      confirmSlot: slot,
      showConfirmModal: true
    })
  },

  onCancelConfirm() {
    this.setData({
      showConfirmModal: false,
      confirmSlot: null
    })
  },

  async onConfirmBook() {
    const { confirmSlot } = this.data
    if (!confirmSlot) return

    this.setData({ showConfirmModal: false })

    try {
      wx.showLoading({ title: '预约中...', mask: true })
      const result = await subscribeService.createReview(confirmSlot.id)
      wx.hideLoading()

      const isSuccess = result.code === 200 || result.msg === 'ok'
      if (isSuccess) {
        wx.showToast({
          title: '预约成功',
          icon: 'success'
        })
        this.loadBatchData()
      } else {
        wx.showToast({
          title: result.message || result.msg || '预约失败',
          icon: 'none'
        })
      }
    } catch (err) {
      wx.hideLoading()
      wx.showToast({
        title: err.message || '预约失败',
        icon: 'none'
      })
    }

    this.setData({ confirmSlot: null })
  }
})
