import axios from 'axios'

const service = axios.create({
  baseURL: '/api',
  timeout: 5000
})

/* 响应拦截器 */
service.interceptors.request.use(response => {
  const data = response.data
  console.log(response)
  if (response.code === ERR_OK) {
    return data.result
  } else {
    return Promise.reject(new Error())
  }
})

export default service
