import { SEARCH_KET } from '@/assets/js/constant'
import storage from 'good-storage'
import { useStore } from 'vuex'

export default function useSearchHistory() {
  const store = useStore()
  const maxLength = 100 // 最大搜索数目

  function saveSearch(query) {
    const searches = storage.get(SEARCH_KET, [])
    const index = searches.findIndex(item => {
      return item === query
    })
    if (index === 0) {
      return
    }
    if (index > 0) {
      searches.splice(index, 1)
    }

    searches.unshift(query)
    if (maxLength && searches.length > maxLength) {
      searches.pop()
    }
    set(searches)
  }

  function removeSearch(query) {
    const searches = storage.get(SEARCH_KET, [])
    const index = searches.findIndex(item => {
      return item === query
    })
    if (index > -1) {
      searches.splice(index, 1)
    }
    set(searches)
  }

  function set(key) {
    store.commit('music/setSearchHistory', key)
    storage.set(SEARCH_KET, key)
  }

  function clearSearch() {
    store.commit('music/setSearchHistory', [])
    storage.remove(SEARCH_KET)
  }

  return { saveSearch, removeSearch, clearSearch }
}
