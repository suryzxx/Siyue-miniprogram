/**
 * 预约服务
 * 处理评测预约相关接口
 */

const { get, post } = require('../utils/request')
const { config } = require('../utils/config')

const subscribeService = {
  /**
   * 获取预约评测场次列表
   * 后端接口: GET /client/api/subscribe_review_batch/list
   * @param {object} params - 查询参数
   * @param {string} params.classRoomIds - 教室ID，多个逗号隔开
   * @param {string} params.startAt - 开始时间，格式：2026-03-01 00:00:00
   * @param {string} params.endAt - 结束时间，格式：2026-03-31 23:59:59
   */
  getReviewBatchList(params) {
    const { classRoomIds, startAt, endAt } = params
    const queryParams = {}
    if (classRoomIds) {
      queryParams['search[class_room_ids]'] = classRoomIds
    }
    if (startAt) {
      queryParams['search[start_at]'] = startAt
    }
    if (endAt) {
      queryParams['search[end_at]'] = endAt
    }
    
    if (config.useLocalMock) {
      return Promise.resolve({
        code: 200,
        message: '获取成功',
        data: {
          list: [],
          total: 0
        }
      })
    }
    return get('/client/api/subscribe_review_batch/list', queryParams)
  },

  /**
   * 获取预约评测列表
   * 后端接口: GET /client/api/subscribe/review/list
   */
  getReviewList() {
    if (config.useLocalMock) {
      return Promise.resolve({
        code: 200,
        message: '获取成功',
        data: {
          list: [
            {
              id: 1,
              campus_id: 1,
              campus_name: '同曦校区',
              time_at: '2026-03-15 09:00:00',
              status: 'pending',
              status_name: '待确认'
            }
          ],
          total: 1
        }
      })
    }
    return get('/client/api/subscribe/review/list')
  },

  /**
   * 取消预约
   * 后端接口: POST /client/api/subscribe/review/cancel
   * @param {number} id - 预约列表的id
   */
  cancelReview(id) {
    if (config.useLocalMock) {
      return Promise.resolve({
        code: 200,
        message: '取消成功',
        data: null
      })
    }
    return post('/client/api/subscribe/review/cancel', { id })
  },

  /**
   * 预约评测
   * 后端接口: POST /client/api/subscribe/review/create
   * @param {number} subscribeReviewBatchId - 场次ID
   */
  createReview(subscribeReviewBatchId) {
    if (config.useLocalMock) {
      return Promise.resolve({
        code: 200,
        message: '预约成功',
        data: {
          id: Date.now()
        }
      })
    }
    return post('/client/api/subscribe/review/create', { subscribe_review_batch_id: subscribeReviewBatchId })
  }
}

module.exports = { subscribeService }
