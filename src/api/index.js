import { get } from '@/service'
import { Promise } from 'core-js'

/* 获取推荐列表 */
export function getRecommend() {
  return get('/getRecommend')
}

/* 获取歌手列表 */
export function getSingerList() {
  return get('/getSingerList')
}

/* 获取歌单列表 */
export function getSingerDetail(singer) {
  return get('/getSingerDetail', { mid: singer.mid })
}

/* 获取歌单url */
export async function getSongsUrl(songs) {
  if (!songs.length) return Promise.resolve(songs)

  const resutl = await get('/getSongsUrl', {
    mid: songs.map(song => {
      return song.mid
    })
  })
  const map = resutl.map
  return songs
    .map(song => {
      song.url = map[song.mid]
      return song
    })
    .filter(song => {
      return song.url.indexOf('vkey') > -1
    })
}

const lyricMap = {}

/* 获取歌词 */
export async function getLyric(song) {
  const mid = song.mid

  //  读取标记
  if (lyricMap[mid]) {
    return Promise.resolve(lyricMap[mid])
  }

  // 查看是否缓存过
  if (song.lyric) {
    return Promise.resolve(song.lyric)
  }

  const result = await get('/getLyric', { mid })
  const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
  // 标记
  lyricMap[mid] = lyric
  return lyric
}

/* 获取专辑歌单 */
export function getAlbum(album) {
  return get('/getAlbum', {
    id: album.id
  })
}

/* 排行榜 */
export function getTopList() {
  return get('/getTopList')
}

/* 排行榜歌单 */
export function getTopDetail(top) {
  return get('/getTopDetail', {
    id: top.id,
    period: top.period
  })
}

/* 热门搜索 */
export function getHotKeys() {
  return get('/getHotKeys')
}

/* 搜索 */
export function search(query, page, showSinger) {
  return get('/search', {
    query,
    page,
    showSinger
  })
}
