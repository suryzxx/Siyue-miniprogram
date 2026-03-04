const { get, post } = require('../utils/request')

const assessmentService = {
  getCampuses(params = {}) {
    return get('/assessments/campuses', params)
  },

  getSlots(campusId, startDate, endDate) {
    return get('/assessments/slots', { campusId, startDate, endDate })
  },

  create(data) {
    return post('/assessments', {
      studentId: data.studentId,
      campusId: data.campusId,
      bookDate: data.bookDate,
      bookTime: data.bookTime
    })
  },

  getList(params = {}) {
    return get('/assessments', params)
  },

  getDetail(id) {
    return get(`/assessments/${id}`)
  },

  cancel(id) {
    return post(`/assessments/${id}/cancel`)
  }
}

module.exports = { assessmentService }
