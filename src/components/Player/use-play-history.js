import { PLAY_KET } from '@/assets/js/constant'
import storage from 'good-storage'
import { useStore } from 'vuex'

export default function usePlayHistory() {
  const store = useStore()
  const maxLength = 100

  function savePlay(song) {
    const songs = storage.get(PLAY_KET, [])
    const index = songs.findIndex(item => {
      return item.id === song.id
    })
    if (index > -1) {
      songs.splice(index, 1)
    }
    songs.unshift(song)
    if (maxLength && songs.length > maxLength) {
      songs.pop()
    }
    store.commit('music/setPlayHistory', songs)
    storage.set(PLAY_KET, songs)
  }

  return { savePlay }
}
