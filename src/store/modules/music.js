import { PLAY_MODE, SEARCH_KET } from '@/assets/js/constant'
import { shuffle } from '@/utils/shuffle'
import storage from 'good-storage'

export default {
  namespaced: true,
  state: () => ({
    sequenceList: [], // 顺序列表
    playList: [], // 播放列表
    playing: false, // 播放状态
    playMode: PLAY_MODE.sequence, // 播放模式
    currentIndex: 0, // 当前索引
    fullScreen: false, // 播放器的状态(全屏or收缩)
    favoriteList: [], // 收藏列表
    searchHistory: storage.get(SEARCH_KET) || [], // 搜索历史
    playHistory: []
  }),
  mutations: {
    setSequenceList(state, list) {
      state.sequenceList = list
    },
    setPlayList(state, list) {
      state.playList = list
    },
    setPlaying(state, playing) {
      state.playing = playing
    },
    setPlayMode(state, mode) {
      state.playMode = mode
    },
    setCurrentIndex(state, index) {
      state.currentIndex = index
    },
    setFullScreen(state, fullScreen) {
      state.fullScreen = fullScreen
    },
    setFavoriteList(state, favoriteList) {
      state.favoriteList = favoriteList
    },
    addSongLyric(state, { song, lyric }) {
      state.playList.map(item => {
        if (item.mid === song.mid) {
          item.lyric = lyric
        }
        return item
      })
    },
    setSearchHistory(state, searchs) {
      state.searchHistory = searchs
    },
    setPlayHistory(state, songs) {
      state.playHistory = songs
    }
  },
  actions: {
    selectPlay(context, { list, index }) {
      context.commit('setPlayList', list)
      context.commit('setPlaying', true)
      context.commit('setPlayMode', PLAY_MODE.sequence)
      context.commit('setCurrentIndex', index)
      context.commit('setFullScreen', true)
    },
    randomPlay(context, list) {
      context.commit('setPlayList', shuffle(list))
      context.commit('setPlaying', true)
      context.commit('setPlayMode', PLAY_MODE.random)
      context.commit('setCurrentIndex', 0)
      context.commit('setFullScreen', true)
    },
    changeMode(context, mode) {
      const sequenceList = context.state.sequenceList.slice()
      const playList = context.state.playList.slice()
      const id = context.getters.currentSong.id // 当前歌曲的id

      if (mode === PLAY_MODE.random) {
        context.commit('setPlayList', shuffle(playList || sequenceList))
      } else {
        context.commit('setPlayList', playList)
      }

      // 列表相对应的歌曲 返回它的索引
      const index = context.state.playList.findIndex(song => {
        return song.id === id
      })
      context.commit('setPlayMode', mode)
      context.commit('setCurrentIndex', index)
    },
    removeSong(context, song) {
      const playList = context.state.playList.slice()
      const index = playList.findIndex(item => {
        return item.id === song.id
      })
      if (index === -1) {
        return
      }
      let currentIndex = context.state.currentIndex
      if (index < currentIndex || index === playList.length) {
        currentIndex--
      }
      playList.splice(index, 1)
      context.commit('setPlayList', playList)
      context.commit('setCurrentIndex', currentIndex)
      if (!playList.length) {
        context.commit('setPlaying', false)
      }
    },
    playListClear(context) {
      context.commit('setPlayList', [])
      context.commit('setCurrentIndex', 0)
      context.commit('setPlaying', false)
    },
    addSong(context, song) {
      const playList = context.state.playList.slice()
      let currentIndex = context.state.currentIndex
      const index = playList.findIndex(item => {
        return item.id === song.id
      })
      if (index >= 0) {
        currentIndex = index
      } else {
        playList.push(song)
        currentIndex = playList.length - 1
      }

      context.commit('setPlayList', playList)
      context.commit('setCurrentIndex', currentIndex)
      context.commit('setPlaying', true)
      context.commit('setFullScreen', true)
    }
  },
  getters: {
    currentSong: state => state.playList[state.currentIndex]
  }
}
