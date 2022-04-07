import axios from 'axios'

const service = axios.create({
  baseURL: '/api',
  timeout: 5000
})

const ERR_OK = 0
export function get(url, params) {
  return service
    .get(url, {
      params
    })
    .then(res => {
      const data = res.data
      if (data.code === ERR_OK) {
        return data.result
      }
    })
    .catch(e => {
      console.log(e)
    })
}
