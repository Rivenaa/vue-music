import storage from 'good-storage'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { FAVORITE_KEY } from '@/assets/js/constant'

export default function useFavorite() {
  const store = useStore()
  const maxLength = 100 // 最大收藏数目

  /* 收藏列表 */
  const favoriteList = computed(() => store.getters.favoriteList)

  /* 根据歌曲是否在收藏列表显示图标 */
  const getFavoriteIcon = song => {
    return isFavorite(song) > -1 ? 'icon-favorite' : 'icon-not-favorite'
  }

  /* 点击收藏按钮 */
  const toggleFavorite = song => {
    let list = []
    if (isFavorite(song) > -1) {
      // remove
      list = remove(song)
    } else {
      // save
      list = save(song)
    }
    store.commit('music/setFavoriteList', list)
    storage.set(FAVORITE_KEY, list)
  }

  /* 判断歌曲是否在收藏列表 */
  const isFavorite = song => {
    return favoriteList.value.findIndex(item => {
      return item.id === song.id
    })
  }

  const save = song => {
    const favorite = storage.get(FAVORITE_KEY, [])
    const index = favorite.findIndex(item => {
      return item.id === song.id
    })
    /* 如果歌曲已在列表 停止执行步骤 */
    if (index > -1) {
      return
    }
    /* 添加歌曲 */
    favorite.unshift(song)
    /* 超过收藏数目 移除最早收藏项 */
    if (maxLength && maxLength < favorite.length) {
      favorite.pop()
    }
    return favorite
  }

  const remove = song => {
    const favorite = storage.get(FAVORITE_KEY, [])
    const index = favorite.findIndex(item => {
      return item.id === song.id
    })
    /* 如果歌曲已在列表 移除操作 */
    if (index > -1) {
      favorite.splice(index, 1)
    }
    return favorite
  }

  return { getFavoriteIcon, toggleFavorite }
}
