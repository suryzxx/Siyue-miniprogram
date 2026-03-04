const { config } = require('./config')

const getToken = () => {
  try {
    return wx.getStorageSync('token') || ''
  } catch (e) {
    return ''
  }
}

const setToken = (token) => {
  try {
    wx.setStorageSync('token', token)
  } catch (e) {
    console.error('Token存储失败', e)
  }
}

const removeToken = () => {
  try {
    wx.removeStorageSync('token')
  } catch (e) {
    console.error('Token移除失败', e)
  }
}

const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = getToken()
    
    const header = {
      'Content-Type': 'application/json',
      ...options.header
    }
    
    if (token) {
      header['Authorization'] = `Bearer ${token}`
    }

    const url = options.url.startsWith('http') 
      ? options.url 
      : `${config.apiBaseURL}${options.url}`

    if (config.debug) {
      console.log(`[Request] ${options.method || 'GET'} ${url}`)
      if (options.data) {
        console.log('[Request] Data:', options.data)
      }
    }

    wx.request({
      url,
      method: options.method || 'GET',
      data: options.data,
      header,
      timeout: config.timeout,
      success: (res) => {
        if (config.debug) {
          console.log('[Response]', res.statusCode, res.data)
        }

        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          removeToken()
          wx.redirectTo({ url: '/pages/auth/login' })
          reject({ code: 401, message: '登录已过期，请重新登录' })
        } else {
          reject(res.data || { code: res.statusCode, message: '请求失败' })
        }
      },
      fail: (err) => {
        if (config.debug) {
          console.error('[Request Error]', err)
        }
        reject({ code: -1, message: '网络连接失败，请检查网络' })
      }
    })
  })
}

const get = (url, data, options = {}) => {
  return request({ url, method: 'GET', data, ...options })
}

const post = (url, data, options = {}) => {
  return request({ url, method: 'POST', data, ...options })
}

const put = (url, data, options = {}) => {
  return request({ url, method: 'PUT', data, ...options })
}

const del = (url, data, options = {}) => {
  return request({ url, method: 'DELETE', data, ...options })
}

module.exports = {
  request,
  get,
  post,
  put,
  del,
  getToken,
  setToken,
  removeToken
}
