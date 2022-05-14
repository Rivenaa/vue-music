<template>
  <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="showNormalPlayer">
      <div class="cd-wrapper">
        <div class="cd" ref="cdRef">
          <img :src="currentSong.pic" :class="cdCls" ref="cdImageRef" />
        </div>
      </div>
      <div class="slider-wrapper" ref="sliderRef">
        <div class="slider-group">
          <div class="slider-page" v-for="song in playList" :key="song.id">
            <h2 class="name">{{ song.name }}</h2>
            <p class="desc">{{ song.singer }}</p>
          </div>
        </div>
      </div>
      <div class="control">
        <Progress-circle :radius="32" :progress="progress">
          <i
            class="icon-mini"
            :class="miniPlayIcon"
            @click.stop="togglePlay"
          ></i>
        </Progress-circle>
      </div>
      <div class="control" @click.stop="showPlayList">
        <i class="icon-playlist"></i>
      </div>
      <Playlist ref="playListRef" />
    </div>
  </transition>
</template>

<script setup>
import { useStore } from 'vuex'
import { ref, computed, defineProps } from 'vue'
import useCD from './use-cd'
import useMiniSlider from './use-mini-slider'
import ProgressCircle from './progress-circle.vue'
import Playlist from './playlist.vue'

defineProps({
  progress: {
    type: Number,
    default: 0
  },
  togglePlay: {
    type: Function
  }
})

const store = useStore()
const sliderRef = ref(null)
const playListRef = ref(null)

// computed
const fullScreen = computed(() => store.getters.fullScreen)
const currentSong = computed(() => store.getters.currentSong)
const playList = computed(() => store.getters.playList)
const playing = computed(() => store.getters.playing)
const miniPlayIcon = computed(() => {
  return playing.value ? 'icon-pause-mini' : 'icon-play-mini'
})

// hooks
const { cdRef, cdImageRef, cdCls } = useCD()
useMiniSlider(sliderRef)

// methods
const showNormalPlayer = () => {
  store.commit('music/setFullScreen', true)
}

const showPlayList = () => {
  playListRef.value.show()
}
</script>

<style lang="scss" scoped>
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: $color-highlight-background;
  .cd-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
    .cd {
      height: 100%;
      width: 100%;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        &.playing {
          animation: rotate 20s linear infinite;
        }
      }
    }
  }
  .slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-page {
        display: inline-block;
        width: 100%;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        .name {
          margin-bottom: 2px;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text;
        }
        .desc {
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
    }
  }
  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    .icon-mini {
      position: absolute;
      left: 0;
      top: 0;
      color: $color-theme-d;
      font-size: 32px;
    }
    .icon-playlist {
      position: relative;
      top: -2px;
      font-size: 28px;
      color: $color-theme-d;
    }
  }
  &.mini-enter-active,
  &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.45, 1);
  }
  &.mini-enter-from,
  &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
}
</style>
