<template>
  <div class="player" v-show="playList.length">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.pic" alt="" />
        </div>
        <div class="top">
          <div class="back" @click="goback">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="subtitle">{{ currentSong.singer }}</h2>
        </div>
        <div
          class="middle"
          @touchstart.prevent="onMiddleTouchStart"
          @touchmove.prevent="onMiddleTouchMove"
          @touchend.prevent="onMiddleTouchEnd"
        >
          <div class="middle-l" :style="middleLStyle">
            <div class="cd-wrapper" ref="cdWrapperRef">
              <div class="cd" ref="cdRef">
                <img
                  class="image"
                  :class="cdCls"
                  :src="currentSong.pic"
                  ref="cdImageRef"
                />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <Scroll
            v-if="currentLyric"
            ref="lyricScrollRef"
            class="middle-r"
            :style="middleRStyle"
          >
            <div class="lyric-wrapper">
              <div ref="lyricListRef">
                <p
                  class="text"
                  :class="{ current: currentLineNum === index }"
                  v-for="(line, index) in currentLyric.lines"
                  :key="line.num"
                >
                  {{ line.txt }}
                </p>
              </div>
              <div class="pure-music" v-show="pureMusicLyric">
                <p>{{ pureMusicLyric }}</p>
              </div>
            </div>
          </Scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{ active: currentShow === 'cd' }"></span>
            <span
              class="dot"
              :class="{ active: currentShow === 'lyric' }"
            ></span>
          </div>
          <!-- 进度条 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <Progress-bar
                ref="progressBarRef"
                :progress="progress"
                @progress-changing="onProgressChanging"
                @progress-changed="onProgressChanged"
              />
            </div>
            <span class="time time-r">
              {{ formatTime(currentSong.duration) }}
            </span>
          </div>
          <!-- operators 操作 -->
          <div class="operators">
            <div class="icon i-left">
              <i @click="changeMode" :class="modeIcon"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlay" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i
                @click="toggleFavorite(currentSong)"
                :class="getFavoriteIcon(currentSong)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <Mini-player :progress="progress" :toggle-play="togglePlay" />
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="ended"
    ></audio>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { ref, computed, watch, nextTick } from 'vue'
import { PLAY_MODE } from '@/assets/js/constant'
import { formatTime } from '@/utils/format'
import useMode from './use-mode'
import useFavorite from './use-favorite'
import useCD from './use-cd'
import useLyric from './use-lyric'
import useMiddleInteractive from './use-middle-interactive'
import useAnimation from './use-animation'
import usePlayHistory from './use-play-history'
import Scroll from '@/components/base/Scroll'
import ProgressBar from './progress-bar'
import MiniPlayer from './mini-player.vue'

const store = useStore()

// el
const audioRef = ref(null)
const progressBarRef = ref(null)

// data
const songReady = ref(false)
const currentTime = ref(0)
let progressChanging = false

// computed

/* 播放列表 */
const playList = computed(() => store.getters.playList)
/* 当前歌曲 */
const currentSong = computed(() => store.getters.currentSong)
/* 播放状态 */
const playing = computed(() => store.getters.playing)
/* 播放模式 */
const playMode = computed(() => store.getters.playMode)
/* 当前索引 */
const currentIndex = computed(() => store.getters.currentIndex)
/* 伸缩状态 */
const fullScreen = computed(() => store.getters.fullScreen)
/* 根据播放状态修改图标 */
const playIcon = computed(() => (playing.value ? 'icon-pause' : 'icon-play'))
/* disable样式 */
const disableCls = computed(() => (songReady.value ? '' : 'disable'))

const progress = computed(() => currentTime.value / currentSong.value.duration)

// hooks

/* 播放模式的封装方法 */
const { modeIcon, changeMode } = useMode()

/* 收藏歌曲 */
const { toggleFavorite, getFavoriteIcon } = useFavorite()

/* cd旋转 */
const { cdRef, cdImageRef, cdCls } = useCD()

const { savePlay } = usePlayHistory()

/* 切换cd 或 歌词 */
const {
  currentShow,
  middleLStyle,
  middleRStyle,
  onMiddleTouchStart,
  onMiddleTouchMove,
  onMiddleTouchEnd
} = useMiddleInteractive()

/* 歌词 */
const {
  lyricScrollRef,
  lyricListRef,
  currentLyric,
  currentLineNum,
  pureMusicLyric,
  playingLyric,
  playLyric,
  stopLyric
} = useLyric({
  songReady,
  currentTime
})

const { cdWrapperRef, enter, afterEnter, leave, afterLeave } = useAnimation()

/* 监听currentSong的变化 关联播放器的src */
watch(currentSong, newSong => {
  if (!newSong.id && !newSong.url) {
    return
  }
  currentTime.value = 0
  songReady.value = false
  const audioEl = audioRef.value
  audioEl.src = newSong.url
  audioEl.play()
  store.commit('music/setPlaying', true)
})

/* 监听playing 关联播放器状态 */
watch(playing, newPlaying => {
  if (!songReady.value) {
    return
  }
  const audioEl = audioRef.value
  if (newPlaying) {
    audioEl.play()
    playLyric()
  } else {
    audioEl.pause()
    stopLyric()
  }
})

watch(fullScreen, async newFullScreen => {
  if (newFullScreen) {
    await nextTick()
    playLyric()
    progressBarRef.value.setOffset(progress.value)
  }
})

// methods

/* 退出窗口 */
const goback = () => {
  store.commit('music/setFullScreen', false)
}

/* 播放按钮 */
const togglePlay = () => {
  if (!songReady.value) {
    return
  }
  store.commit('music/setPlaying', !playing.value)
}

const prev = () => {
  const list = playList.value
  if (!songReady.value || !list.length) {
    return
  }

  if (list.length === 1 || playMode.value === PLAY_MODE.loop) {
    loop()
  } else {
    let index = currentIndex.value - 1
    if (index === -1) {
      index = list.length - 1
    }
    store.commit('music/setCurrentIndex', index)
  }
}

const next = () => {
  const list = playList.value
  if (!songReady.value || !list.length) {
    return
  }

  if (list.length === 1 || playMode.value === PLAY_MODE.loop) {
    loop()
  } else {
    let index = currentIndex.value + 1
    if (index === list.length) {
      index = 0
    }
    store.commit('music/setCurrentIndex', index)
  }
}

const loop = () => {
  const audioEl = audioRef.value
  audioEl.currentTime = 0
  audioEl.play()
  store.commit('music/setPlaying', true)
}

/* pause audio的原生事件  当待机或者关闭页面会触发 */
const pause = () => {
  store.commit('music/setPlaying', false)
}

/* audio 播放器准备完成触发 */
const ready = () => {
  if (songReady.value) {
    return
  }
  songReady.value = true
  playLyric()
  savePlay(currentSong.value)
}

const error = () => {
  songReady.value = true
}

const updateTime = e => {
  if (!progressChanging) {
    currentTime.value = e.target.currentTime
  }
}

/* 歌曲播放完触发该事件 ended  */
const ended = () => {
  currentTime.value = 0
  if (playMode.value === PLAY_MODE.loop) {
    loop()
  } else {
    next()
  }
}

const onProgressChanging = progress => {
  progressChanging = true
  currentTime.value = currentSong.value.duration * progress
  playLyric()
  stopLyric()
}

const onProgressChanged = progress => {
  progressChanging = false
  audioRef.value.currentTime = currentTime.value =
    currentSong.value.duration * progress

  playLyric()

  if (!playing.value) {
    store.commit('music/setPlaying', true)
  }
}
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;
      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      padding: 0 50px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
              &.playing {
                animation: rotate 20s linear infinite;
              }
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
  }
}
</style>
