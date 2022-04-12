import { get } from '@/service'

/* 获取推荐列表 */
export function getRecommend() {
  return get('/getRecommend')
}

/* 获取歌手列表 */
export function getSingerList() {
  return get('/getSingerList')
}
