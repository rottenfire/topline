import Store from '@/store'
import axios from 'axios'
import JSONbig from 'json-bigint'

const instance = axios.create({
  baseURL: ' http://ttapi.research.itcast.cn',
  timeout: 5000
})

// 获取到服务器返回的数据，并且是在处理数据之前使用
// transformResponse 是在响应拦截器之前执行
instance.defaults.transformResponse = [function (data) {
  try {
    // data 数据可能不是标准的 JSON 格式字符串，否则会导致 JSONbig.parse(data) 转换失败报错
    return JSONbig.parse(data)
  } catch (err) {
    // 无法转换的数据直接原样返回
    return data
  }
}]

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  if (Store.state.user) {
    config.headers.Authorization = `Bearer ${Store.state.user.token}`
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
instance.interceptors.response.use(function (response) {
  // Do something with response data

  return response.data.data ? response.data.data : response
}, function (error) {
  // Do something with response error
  console.dir(error)
  return Promise.reject(error)
})

export default instance
