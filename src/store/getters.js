export const getters = {
  /* 播放列表 */
  playList: state => state.music.playList,
  /* 播放状态 */
  playing: state => state.music.playing,
  /* 播放模式 */
  playMode: state => state.music.playMode,
  /* 当前索引 */
  currentIndex: state => state.music.currentIndex,
  /* 伸缩状态 */
  fullScreen: state => state.music.fullScreen,
  /* 收藏列表 */
  favoriteList: state => state.music.favoriteList,
  /* 当前歌曲 */
  currentSong: state => state.music.playList[state.music.currentIndex] || {},
  /* 搜索历史 */
  searchHistory: state => state.music.searchHistory,
  /* 播放记录 */
  playHistory: state => state.music.playHistory
}
