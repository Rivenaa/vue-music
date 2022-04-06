import service from '@/service'

export const getRecommend = () => {
  return service({
    url: '/api/getRecommend',
    method: 'GET'
  })
}
