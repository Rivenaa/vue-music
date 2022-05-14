<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" ref="bgImageRef" :style="bgImageStyle">
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div v-show="songs.length > 0" class="play-btn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" :style="filterStyle"></div>
    </div>
    <Scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      v-no-result:[noResultText]="noResult"
      :probeType="3"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <Song-list :songs="songs" @select="selectItem" :rank="rank"></Song-list>
      </div>
    </Scroll>
  </div>
</template>

<script setup>
import Scroll from '@/components/wrap-scroll'
import SongList from '@/components/base/SongList'
import { ref, defineProps, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

// props
const props = defineProps({
  songs: {
    type: Array,
    default: () => []
  },
  title: String,
  pic: String,
  loading: Boolean,
  noResultText: {
    type: String,
    default: '抱歉,没有找到可播放的歌曲'
  },
  rank: Boolean
})

const router = useRouter()
const store = useStore()
const scrollY = ref(0)
const bgImageRef = ref(null)
const imageHeight = ref(0)
const maxTranslateY = ref(0)
const RESERVED_HEIGHT = 40

const onScroll = pos => {
  scrollY.value = -pos.y
}

onMounted(() => {
  const imageHeightVal = (imageHeight.value = bgImageRef.value.clientHeight)
  maxTranslateY.value = imageHeightVal - RESERVED_HEIGHT
})

const noResult = computed(() => {
  return !props.songs.length && !props.loading
})

const playList = computed(() => store.getters.playList)

const scrollStyle = computed(() => {
  const bottom = playList.value.length ? '60px' : '0'
  return { top: `${imageHeight.value}px`, bottom }
})

const bgImageStyle = computed(() => {
  const scrollYVal = scrollY.value
  let zIndex = 0
  let paddingTop = '70%'
  let height = 0

  /* 处理iphone兼容 */
  const translateZ = 1

  if (scrollYVal > maxTranslateY.value) {
    zIndex = 10
    paddingTop = 0
    height = `${RESERVED_HEIGHT}px`
  }

  /* 下拉图片放大效果 */
  let scale = 1 // scale:比例
  if (scrollYVal < 0) {
    // Math.abs() 返回一个数的绝对值
    scale = 1 + Math.abs(scrollYVal / imageHeight.value)
  }

  return {
    zIndex,
    paddingTop,
    height,
    backgroundImage: `url(${props.pic})`,
    transform: `scale(${scale})translateZ(${translateZ}px)`
  }
})

const playBtnStyle = computed(() => {
  let display = ''
  if (scrollY.value >= maxTranslateY.value) {
    display = 'none'
  }
  return { display }
})

const filterStyle = computed(() => {
  let blur = 0
  const scrollYVal = scrollY.value
  const imageHeightVal = imageHeight.value
  if (scrollYVal >= 0) {
    blur =
      Math.min(
        maxTranslateY.value / imageHeightVal,
        scrollYVal / imageHeightVal
      ) * 20
  }
  return { backdropFilter: `blur(${blur}px)` }
})

const goBack = () => {
  router.back()
}

const selectItem = ({ song, index }) => {
  store.dispatch('music/selectPlay', { list: props.songs, index })
}

const random = () => {
  store.dispatch('music/randomPlay', props.songs)
}
</script>

<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 30;
      width: 100%;
      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
      }
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
    .filter {
      position: absolute;
      z-index: 20;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
