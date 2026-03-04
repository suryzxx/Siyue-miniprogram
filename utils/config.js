/**
 * 环境配置文件
 * 通过 useMock 开关控制使用本地模拟数据还是远程API
 */

// 环境配置
const envConfig = {
  // 开发环境：使用本地模拟数据
  development: {
    name: '开发环境',
    baseURL: 'https://m1.apifoxmock.com/m1/7828196-7576309-default',
    useLocalMock: true,  // 使用本地模拟数据
    useMock: true,
    debug: true
  },
  // 生产环境：使用真实后端数据
  production: {
    name: '生产环境',
    baseURL: 'https://api.your-real-server.com',
    useLocalMock: false,
    useMock: false,
    debug: false
  }
}

// ============================================
// 【开关控制】修改这里切换环境
// ============================================
const CURRENT_ENV = 'development' // 'development' 或 'production'
// ============================================

// 获取当前环境配置
const config = envConfig[CURRENT_ENV]

// API 版本
config.apiVersion = 'v1'

// 请求超时时间（毫秒）
config.timeout = 10000

// 构建完整的 API 基础路径
config.apiBaseURL = `${config.baseURL}/api/${config.apiVersion}`

// 调试日志
if (config.debug) {
  console.log(`[Config] 当前环境: ${config.name}`)
  console.log(`[Config] API地址: ${config.apiBaseURL}`)
  console.log(`[Config] 使用本地Mock: ${config.useLocalMock}`)
}

module.exports = {
  config,
  CURRENT_ENV,
  envConfig
}
