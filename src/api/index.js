import { get } from '@/service'

export function getRecommend() {
  return get('/getRecommend')
}
