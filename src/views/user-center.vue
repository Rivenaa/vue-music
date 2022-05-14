<template>
  <div class="user-center" v-no-result:[noResultText]="noResult">
    <div class="back" @click="back">
      <i class="icon-back" />
    </div>
    <div class="switches-wrapper">
      <Switches :items="['我喜欢的', '最近播放']" v-model="currentIndex" />
    </div>
    <div class="play-btn" v-if="currentList.length" @click="random">
      <i class="icon-play" />
      <span class="text">随机播放全部</span>
    </div>
    <div class="list-wrapper">
      <Scroll class="list-scroll" v-if="currentIndex === 0">
        <div class="list-inner">
          <Song-list :songs="favoriteList" @select="select" />
        </div>
      </Scroll>
      <Scroll class="list-scroll" v-if="currentIndex === 1">
        <div class="list-inner">
          <Song-list :songs="playHistory" @select="select" />
        </div>
      </Scroll>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Switches from '@/components/base/Switches'
import SongList from '@/components/base/SongList'
import Scroll from '@/components/wrap-scroll'

const store = useStore()
const router = useRouter()
const currentIndex = ref(0)

const favoriteList = computed(() => store.getters.favoriteList)
const playHistory = computed(() => store.getters.playHistory)
const noResult = computed(() =>
  currentIndex.value === 0
    ? !favoriteList.value.length
    : !playHistory.value.length
)
const noResultText = computed(() =>
  currentIndex.value === 0 ? '暂无收藏歌曲' : '你还没听过歌曲'
)
const currentList = computed(() =>
  currentIndex.value === 0 ? favoriteList.value : playHistory.value
)
const back = () => {
  router.back()
}
const select = async ({ song, index }) => {
  await store.dispatch('music/addSong', song)
  store.dispatch('music/selectPlay', { list: currentList.value, index })
}
const random = async () => {
  await store.dispatch('music/randomPlay', currentList.value)
}
</script>

<style lang="scss" scoped>
.user-center {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 100;
  background: $color-background;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .switches-wrapper {
    margin: 10px 0 30px 0;
  }
  .play-btn {
    box-sizing: border-box;
    width: 135px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border: 1px solid $color-text-l;
    color: $color-text-l;
    border-radius: 100px;
    font-size: 0;
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
  .list-wrapper {
    position: absolute;
    top: 110px;
    bottom: 0;
    width: 100%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
      .list-inner {
        padding: 20px 30px;
      }
    }
  }
}
</style>
