import { useStore } from 'vuex'
import { ref, watch, computed } from 'vue'
import { getLyric } from '@/api'
import Lyric from 'lyric-parser'

export default function useLyric({ songReady, currentTime }) {
  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)
  const currentLyric = ref(null)
  const currentLineNum = ref(0)
  const pureMusicLyric = ref('')
  const playingLyric = ref('')

  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  watch(currentSong, async newSong => {
    if (!newSong.id && !newSong.url) {
      return
    }

    /* 重置歌词 */
    stopLyric() // 停止播放
    currentLyric.value = null // 清空实例
    currentLineNum.value = 0 // 重置行号
    pureMusicLyric.value = ''
    playingLyric.value = ''

    /* 调用接口获取歌词 */
    const lyric = await getLyric(newSong)

    /* 歌词缓存到vuex中 */
    store.commit('music/addSongLyric', { song: newSong, lyric })

    /* 保护 */
    if (currentSong.value.lyric !== lyric) {
      return
    }

    /* 插件实例化 */
    currentLyric.value = new Lyric(lyric, handleLyric)

    const hasLyric = currentLyric.value.lines.length // 插件实例化后是否有歌词

    if (hasLyric) {
      /* 如果audio准备好的话 播放歌词 */
      if (songReady.value) {
        playLyric()
      }
    } else {
      playingLyric.value = pureMusicLyric.value = lyric.replace(
        /\[(\d{2}):(\d{2}):(\d{2})\]/g,
        ''
      )
    }
  })

  function handleLyric({ lineNum, txt }) {
    currentLineNum.value = lineNum
    playingLyric.value = txt
    const scrollComp = lyricScrollRef.value
    const listEl = lyricListRef.value
    if (!listEl) {
      return
    }
    if (lineNum > 5) {
      const lineEl = listEl.children[lineNum - 5]
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      scrollComp.scroll.scrollToElement(0, 0, 1000)
    }
  }

  /* 播放歌词方法 seek() 当前播放时间 跳转到指定位置 */
  function playLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }

  /* 暂停歌词 */
  function stopLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }

  return {
    lyricScrollRef,
    lyricListRef,
    currentLyric,
    currentLineNum,
    pureMusicLyric,
    playingLyric,
    playLyric,
    stopLyric
  }
}
